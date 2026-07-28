"""
Gemini Local Summarizer — v1.0.0
Processes exported Markdown transcripts from the local claude_logs/ folder,
summarizes via Gemini, updates Google Docs in Google Drive, and moves processed
files to the log_archive folder.
"""

from google.auth import default
from google.auth.transport.requests import Request as GoogleAuthRequest
from googleapiclient.discovery import build
import google.generativeai as genai
from datetime import datetime
import os
import re
import json
import shutil

# --- Config ---
PROJECT_ROOT = r"C:\Users\ryanm\source\repos\bbs-style-discovery"
LOG_DIR_NAME = "claude_logs"
ARCHIVE_DIR_NAME = "log_archive"

SUMMARY_TITLE = "Claude Session Summaries"
RAW_TITLE     = "Claude Raw Session Transcripts"
INDEX_TITLE   = "Claude Session Index"
LATEST_TITLE  = "Claude Latest Session"
NOTES_TITLE   = "Claude Session Notes"

# --- Drive Paths ---
LOCAL_LOG_DIR = os.path.join(PROJECT_ROOT, LOG_DIR_NAME)
LOCAL_ARCHIVE_DIR = os.path.join(LOCAL_LOG_DIR, ARCHIVE_DIR_NAME)
os.makedirs(LOCAL_ARCHIVE_DIR, exist_ok=True)

# --- Authenticate Google Drive & Docs API ---
print("[1/4] Authenticating Google Drive and Docs APIs...")
creds, _ = default()
if creds and creds.expired and creds.refresh_token:
    creds.refresh(GoogleAuthRequest())

drive_svc = build("drive", "v3", credentials=creds)
docs_svc  = build("docs",  "v1", credentials=creds)

# Configure Gemini Client
# Assumes GOOGLE_API_KEY environment variable is set or uses ADC
genai.configure()
model = genai.GenerativeModel("gemini-2.5-flash")

# --- Find markdown files ---
md_files = sorted(
    (f for f in os.listdir(LOCAL_LOG_DIR) if f.lower().endswith(".md")),
    key=lambda f: os.path.getmtime(os.path.join(LOCAL_LOG_DIR, f))
)

DIRECTIVE_RE = re.compile(r'^%%DIRECTIVE:\s*(\{.*\})\s*$', re.MULTILINE)

def extract_directives(text):
    directives = []
    for match in DIRECTIVE_RE.finditer(text):
        try:
            directives.append(json.loads(match.group(1)))
        except json.JSONDecodeError as e:
            print(f"  Directive parse error (skipping): {e}")
    return directives

if not md_files:
    print(f"No markdown files found in {LOCAL_LOG_DIR} — nothing to process.")
else:
    print(f"[2/4] Found {len(md_files)} transcript file(s) to process.\n")
    summary_sections = []
    raw_sections     = []
    index_rows       = []
    notes_entries    = []
    latest_session   = None

    for filename in md_files:
        log_path = os.path.join(LOCAL_LOG_DIR, filename)
        print(f"--- Processing: {filename} ---")

        with open(log_path, "r", encoding="utf-8") as f:
            original_text = f.read().strip()

        if not original_text:
            print("  Empty file — skipping.\n")
            continue

        # Archive raw transcript locally
        stem         = os.path.splitext(filename)[0]
        timestamp    = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        archive_name = f"{stem}_archived_{timestamp}.md"
        shutil.copy2(log_path, os.path.join(LOCAL_ARCHIVE_DIR, archive_name))
        print(f"  Archived as: {archive_name}")

        # Directives
        directives = extract_directives(original_text)
        if directives:
            print(f"  Found {len(directives)} directive(s).")
            for d in directives:
                notes_entries.append((filename, timestamp, d))

        raw_sections.append(f"=== {filename} — {timestamp} ===\n\n{original_text}")

        # Summarize via Gemini
        summary_prompt = f"""You are summarising a session log for an ongoing project.
The log is formatted as a Markdown transcript exported from Claude.ai.
Ignore Markdown formatting syntax (headers, bold, code fences, etc.) — treat it as plain content.
Ignore any lines beginning with %%DIRECTIVE: — these are internal pipeline commands, not conversation content.

Produce a concise summary that preserves:
- Key decisions made
- Topics discussed
- Any action items or next steps
- Any important technical findings

Keep the summary under 500 words. Write in plain prose, no bullet points.

Session log:
{original_text}"""

        summary_response = model.generate_content(summary_prompt)
        summary = summary_response.text.strip()
        print("  Summarized via Gemini.")
        summary_sections.append(f"=== {filename} — {timestamp} ===\n\n{summary}")

        # Extract topics
        topic_prompt = f"""Read the session summary below and extract 4-6 short topic tags (2-4 words each).
Return ONLY a comma-separated list. No preamble, no explanation, no punctuation beyond commas.

Summary:
{summary}"""

        try:
            raw_tags = model.generate_content(topic_prompt).text.strip()
            topics = raw_tags.strip('"').strip("'")
        except Exception as e:
            print(f"  Topic extraction failed ({e}); using placeholder.")
            topics = "—"

        index_rows.append((filename, timestamp, topics))
        print(f"  Topics: {topics}")
        latest_session = (filename, timestamp, topics, summary)

        # Move processed transcript file out of active directory
        os.remove(log_path)
        print(f"  Removed original from active log directory.\n")

    # --- Google Docs Helpers ---
    def get_or_create_doc(title, folder_id):
        q = f"name = '{title}' and mimeType = 'application/vnd.google-apps.document' and '{folder_id}' in parents and trashed = false"
        results = drive_svc.files().list(q=q, fields="files(id)").execute()
        files = results.get("files", [])
        if files:
            return files[0]["id"]
        else:
            doc = docs_svc.documents().create(body={"title": title}).execute()
            doc_id = doc["documentId"]
            drive_svc.files().update(fileId=doc_id, addParents=folder_id, removeParents="root", fields="id, parents").execute()
            return doc_id

    def append_to_doc(doc_id, new_content):
        doc_body   = docs_svc.documents().get(documentId=doc_id).execute()
        insert_idx = doc_body["body"]["content"][-1]["endIndex"] - 1
        text       = ("\n\n\n" + new_content) if insert_idx > 1 else new_content
        docs_svc.documents().batchUpdate(
            documentId=doc_id,
            body={"requests": [{"insertText": {"location": {"index": insert_idx}, "text": text}}]}
        ).execute()

    def overwrite_doc(title, folder_id, content):
        q = f"name = '{title}' and mimeType = 'application/vnd.google-apps.document' and '{folder_id}' in parents and trashed = false"
        results = drive_svc.files().list(q=q, fields="files(id)").execute()
        files = results.get("files", [])
        if files:
            doc_id = files[0]["id"]
            doc_body = docs_svc.documents().get(documentId=doc_id).execute()
            end_idx  = doc_body["body"]["content"][-1]["endIndex"] - 1
            requests = []
            if end_idx > 1:
                requests.append({"deleteContentRange": {"range": {"startIndex": 1, "endIndex": end_idx}}})
            requests.append({"insertText": {"location": {"index": 1}, "text": content}})
        else:
            doc = docs_svc.documents().create(body={"title": title}).execute()
            doc_id = doc["documentId"]
            drive_svc.files().update(fileId=doc_id, addParents=folder_id, removeParents="root", fields="id, parents").execute()
            requests = [{"insertText": {"location": {"index": 1}, "text": content}}]

        docs_svc.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()
        return doc_id

    def get_indexed_filenames(doc_id):
        doc = docs_svc.documents().get(documentId=doc_id).execute()
        text = ""
        for el in doc["body"]["content"]:
            if "paragraph" in el:
                for run in el["paragraph"].get("elements", []):
                    text += run.get("textRun", {}).get("content", "")
        return set(text.splitlines())

    # --- Write to Drive Docs ---
    print("[3/4] Locating Google Drive folder...")
    q = f"name = '{LOG_DIR_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    results = drive_svc.files().list(q=q, fields="files(id)").execute()
    folders = results.get("files", [])
    if not folders:
        raise RuntimeError(f"Could not find '{LOG_DIR_NAME}' folder in Google Drive.")
    log_folder_id = folders[0]["id"]

    print("[4/4] Updating Google Docs...")
    if summary_sections:
        doc_id = get_or_create_doc(SUMMARY_TITLE, log_folder_id)
        append_to_doc(doc_id, "\n\n\n".join(summary_sections))

    if raw_sections:
        doc_id = get_or_create_doc(RAW_TITLE, log_folder_id)
        append_to_doc(doc_id, "\n\n\n".join(raw_sections))

    if index_rows:
        doc_id = get_or_create_doc(INDEX_TITLE, log_folder_id)
        existing = get_indexed_filenames(doc_id)
        new_rows = [f"{fname}\t{ts}\t{topics}" for fname, ts, topics in index_rows if fname not in existing]
        if new_rows:
            append_to_doc(doc_id, "\n".join(new_rows))

    if latest_session:
        fname, ts, topics, summary = latest_session
        latest_content = f"Filename: {fname}\nTimestamp: {ts}\nTags: {topics}\n\nSummary:\n{summary}"
        overwrite_doc(LATEST_TITLE, log_folder_id, latest_content)

    if notes_entries:
        doc_id = get_or_create_doc(NOTES_TITLE, log_folder_id)
        for fname, ts, directive in notes_entries:
            if directive.get("action") == "save_note":
                topic   = directive.get("topic", "—")
                content = directive.get("content", "")
                entry   = f"=== {fname} — {ts} ===\nTopic: {topic}\n{content}"
                append_to_doc(doc_id, entry)

    print("✅ All Google Docs successfully updated!")
