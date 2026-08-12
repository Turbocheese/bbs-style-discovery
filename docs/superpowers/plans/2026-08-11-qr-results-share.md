# QR Results Share Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a client scan a QR code on their own phone to land on their
style/colour result, without touching the kiosk iPad's share sheet.

**Architecture:** A new `share-qr.js` file draws a QR code (via a newly
vendored library) encoding the client's result keys as URL query params. A
small boot-time check in `app.js` restores a result from those params when
the app is opened fresh (i.e. on the client's own phone, from the scan). No
backend, no new page — the restore path reuses the existing result-rendering
functions as-is.

**Tech Stack:** Vanilla ES5 JS (matches existing codebase), one new vendored
dependency (`soldair/node-qrcode` browser build), no build step.

**Spec:** `docs/superpowers/specs/2026-08-11-qr-results-share-design.md`

## Global Constraints
- No framework, no build step, no CDN at runtime — the QR library must be
  downloaded once and committed to `vendor/`, never fetched live.
- ES5 style: `var`, function declarations, string concatenation (no
  `let`/`const`/arrow functions/template literals in files that are already
  ES5 — `app.js`, `styles.css` edits follow this; a brand-new file may still
  match ES5 for consistency with the rest of the codebase).
- One delegated click handler on `document.body` (app.js) — new interactions
  are new `data-action` branches in that handler, never a second listener.
- This project has **no unit test framework** (`CLAUDE.md`: "no unit tests,
  no CI"). Verification here follows the project's actual convention:
  `node --check` for syntax on every file touched, a temporary ad hoc
  Playwright script for behavior (same pattern used by the
  `ensemble-flat-lay-polish` feature), and `node verify/smoke.js` +
  `node verify/audit.js` as the final gate. The temporary Playwright script
  lives under the job's scratch directory, not committed to the repo.
- Any change to `app.js` or `styles.css` requires bumping its `?v=` in
  `index.html` **and** the matching entry + `CACHE_VERSION` in `sw.js`
  (current values at plan time: `app.js?v=91`, `styles.css?v=92`,
  `CACHE_VERSION = "bbs-v114"`).
- Copy voice: British English, playful/experiential framing (not
  "consultation" language).

---

### Task 1: Vendor the QR code generator

**Files:**
- Create: `vendor/qrcode.min.js`

**Interfaces:**
- Produces: global `QRCode` object with `QRCode.toCanvas(canvasElement, text, options, callback)`, used by Task 3.

- [ ] **Step 1: Download the library**

Run:
```bash
curl -sL https://cdn.jsdelivr.net/npm/qrcode@1/build/qrcode.min.js -o vendor/qrcode.min.js
```

- [ ] **Step 2: Confirm it downloaded correctly and note the resolved version**

Run:
```bash
head -c 200 vendor/qrcode.min.js
wc -l vendor/qrcode.min.js
```
Expected: non-empty minified JS starting with a UMD wrapper (e.g. `!function(t,e){...}` or a `/*! ... */` banner). The `@1` in the URL floats to the latest 1.x release — read any version string in the banner comment (if present) so it can go in the commit message. If the file is empty or curl errored, stop and re-run — do not proceed with an empty vendor file.

- [ ] **Step 3: Sanity-check the library loads and exposes `QRCode.toCanvas`**

**Correction (verified 2026-08-12, superseding an earlier version of this
step that used `require()`):** this build of the library is a plain
browser-global script — it assigns `QRCode` as a bare global when loaded via
a `<script>` tag, with no `module.exports`. That's exactly the loading path
`index.html` will actually use (Task 11), so verify it the same way, in a
sandboxed context rather than via `require()`:

```bash
node -e "var vm=require('vm');var fs=require('fs');var code=fs.readFileSync('./vendor/qrcode.min.js','utf8');var sandbox={};vm.createContext(sandbox);vm.runInContext(code,sandbox);console.log(typeof sandbox.QRCode!=='undefined' && typeof sandbox.QRCode.toCanvas==='function' ? 'OK' : 'MISSING');"
```
Expected: prints `OK`. This has been run against the real downloaded file
and confirmed to print `OK` — if it prints `MISSING` for you, something
about the downloaded file differs from what was verified (re-check Step 1's
download succeeded and is non-empty), not a problem with this check's logic.

- [ ] **Step 4: Commit**

```bash
git add vendor/qrcode.min.js
git commit -m "Vendor qrcode.min.js for the QR results share feature"
```

---

### Task 2: Add `showShareQR` to fresh state

**Files:**
- Modify: `app.js:3283-3316` (`getFreshState()`)

**Interfaces:**
- Produces: `appState.showShareQR` (boolean), consumed by Tasks 5, 6, 7, 8, 9.

- [ ] **Step 1: Add the field**

In `getFreshState()`, add `showShareQR: false,` immediately after `openFilterDD: null,` (same kind of transient UI-toggle field):

```javascript
        openFilterDD: null,
        showShareQR: false,
        wardrobeChecklist: {},
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Add showShareQR field to fresh app state"
```

---

### Task 3: Create `share-qr.js`

**Files:**
- Create: `share-qr.js`

**Interfaces:**
- Consumes: global `QRCode.toCanvas(canvasElement, text, options, callback)` (Task 1); global `appState.archetypeKey` / `appState.colourResultKey` (already exist in app.js).
- Produces: `buildShareURL(archetypeKey, colourResultKey)` — pure function, returns a URL string or `null`. `initShareQR()` — finds `.qr-share-canvas` in the DOM and draws into it. Both consumed by Task 10 (render wiring) and Task 6/7 (markup that provides the canvas).

- [ ] **Step 1: Write the file**

```javascript
// share-qr.js
// Builds the client-facing share URL for a result and draws it as a QR
// code. Loaded after app.js (needs the global appState).

function buildShareURL(archetypeKey, colourResultKey) {
    var params = [];
    if (archetypeKey) params.push("styleKey=" + encodeURIComponent(archetypeKey));
    if (colourResultKey) params.push("colourKey=" + encodeURIComponent(colourResultKey));
    if (params.length === 0) return null;
    var base = location.origin + location.pathname;
    return base + "?" + params.join("&");
}

function initShareQR() {
    if (typeof QRCode === "undefined") return;
    var canvas = document.querySelector(".qr-share-canvas");
    if (!canvas) return;
    var url = buildShareURL(appState.archetypeKey, appState.colourResultKey);
    if (!url) return;
    QRCode.toCanvas(canvas, url, { width: 220, margin: 1 }, function (err) {
        if (err) console.error("QR generation failed:", err);
    });
}
```

- [ ] **Step 2: Verify syntax**

Run: `node --check share-qr.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Sanity-check `buildShareURL` in isolation**

Run:
```bash
node -e "
global.location = { origin: 'https://turbocheese.github.io', pathname: '/bbs-style-discovery/' };
eval(require('fs').readFileSync('./share-qr.js', 'utf8'));
console.log(buildShareURL('modern_minimalist', 'deep_autumn'));
console.log(buildShareURL('modern_minimalist', null));
console.log(buildShareURL(null, null));
"
```
Expected:
```
https://turbocheese.github.io/bbs-style-discovery/?styleKey=modern_minimalist&colourKey=deep_autumn
https://turbocheese.github.io/bbs-style-discovery/?styleKey=modern_minimalist
null
```
If the output differs, fix `buildShareURL` before moving on — this function's output is exactly what gets encoded into the QR, and exactly what the restore logic in Task 5 must parse back.

- [ ] **Step 4: Commit**

```bash
git add share-qr.js
git commit -m "Add share-qr.js: build share URLs and draw the QR canvas"
```

---

### Task 4: Restore a shared result on boot

**Files:**
- Modify: `app.js:3318-3335` (boot sequence, right after `appState` is assigned)

**Interfaces:**
- Consumes: `getFreshState()` (Task 2's shape), `location.search`.
- Produces: `appState.view`, `appState.archetypeKey`, `appState.colourResultKey`, `appState.inJourney`, `appState.journeyStage` set correctly before the first `render()` call, for Tasks 6/7's rendering to pick up.

- [ ] **Step 1: Add the restore branch**

Current code (`app.js:3318-3335`):
```javascript
var savedSession = null;
try {
    savedSession = localStorage.getItem("bbs_session");
} catch (e) {
    console.log("Local storage disabled");
}

var appState;
try {
    appState = savedSession ? JSON.parse(savedSession) : getFreshState();
} catch (e) {
    console.log("Corrupted session data, starting fresh");
    try {
        localStorage.removeItem("bbs_session");
    } catch (e2) {}
    appState = getFreshState();
}
```

Add immediately after that block (before the `visCompare`/`visEnsemble` reset comment that follows it):
```javascript
// A scanned share link always starts a brand-new browser session on the
// client's own phone — savedSession is null there. Gate structurally on
// !savedSession (not just "URL params happen to be present") so this can
// never fire against a real in-progress kiosk session — e.g. a staff
// member reopening a previously-shared link on the store's own iPad, which
// already has a client's session in localStorage, must NOT wipe it.
// See docs/superpowers/specs/2026-08-11-qr-results-share-design.md.
var shareParams = new URLSearchParams(location.search);
var sharedStyleKey = shareParams.get("styleKey");
var sharedColourKey = shareParams.get("colourKey");
if (!savedSession && (sharedStyleKey || sharedColourKey)) {
    appState = getFreshState();
    if (sharedStyleKey) appState.archetypeKey = sharedStyleKey;
    if (sharedColourKey) appState.colourResultKey = sharedColourKey;
    if (sharedStyleKey && sharedColourKey) {
        appState.inJourney = true;
        appState.journeyStage = "done";
        appState.view = "result";
    } else if (sharedStyleKey) {
        appState.view = "result";
    } else {
        appState.view = "colour-result";
    }
}
```
**Note on the `!savedSession` guard:** `savedSession` here is the *raw JSON
string* read from `localStorage` two blocks above (`app.js:3319-3316`
region), not the parsed `appState` — it is `null` only when nothing was
ever saved in this browser, which is exactly the "genuinely fresh device"
condition this branch requires. This makes the safety property structural
(the branch is unreachable whenever a prior session exists) rather than an
assumption asserted only in a comment.

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Restore a shared result from styleKey/colourKey URL params on boot"
```

(Behavioral verification — that this actually renders the right screen — happens in Task 13, once Tasks 6/7 give the restored state something to render into.)

---

### Task 5: Add the share-qr button and inline reveal to the style result

**Files:**
- Modify: `app.js:4763-4768` (`renderResult()`, `.arch-staff-actions` block)

**Interfaces:**
- Consumes: `appState.showShareQR` (Task 2), renders a `.qr-share-canvas` element that Task 9's `initShareQR()` call will find.
- Produces: `data-action="share-qr"` button, consumed by Task 8 (click handler).

- [ ] **Step 1: Edit the staff-actions block**

Current (`app.js:4763-4768`):
```javascript
        '<div class="arch-staff-actions">' +
        '<div class="arch-staff-label">Save &amp; share</div>' +
        '<button class="arch-btn-quiet btn-bare" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-native">Share to Phone</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="export-dossier">Export Client Dossier</button>' +
        "</div>" +
```

Replace with:
```javascript
        '<div class="arch-staff-actions">' +
        '<div class="arch-staff-label">Save &amp; share</div>' +
        '<button class="arch-btn-quiet btn-bare" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-native">Share to Phone</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-qr">Scan to Take With You</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="export-dossier">Export Client Dossier</button>' +
        "</div>" +
        (appState.showShareQR
            ? '<div class="qr-share-card">' +
              '<canvas class="qr-share-canvas"></canvas>' +
              '<p class="qr-share-caption">Scan with your phone\'s camera to save your results.</p>' +
              "</div>"
            : "") +
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Add Scan to Take With You QR reveal to the style result screen"
```

---

### Task 6: Add the share-qr button and inline reveal to the colour result

**Files:**
- Modify: `app.js:7400-7405` (`renderColourDirectionResult()`, `.arch-staff-actions` block)

**Interfaces:**
- Same as Task 5, for the colour-only result screen.

- [ ] **Step 1: Edit the staff-actions block**

Current (`app.js:7400-7405`):
```javascript
        '<div class="arch-staff-actions">' +
        '<div class="arch-staff-label">Save &amp; share</div>' +
        '<button class="arch-btn-quiet btn-bare" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-native">Share to Phone</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="colour-restart">Start Again</button>' +
        "</div>" +
```

Replace with:
```javascript
        '<div class="arch-staff-actions">' +
        '<div class="arch-staff-label">Save &amp; share</div>' +
        '<button class="arch-btn-quiet btn-bare" data-action="save-card">Save Card</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-native">Share to Phone</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="share-qr">Scan to Take With You</button>' +
        '<button class="arch-btn-quiet btn-bare" data-action="colour-restart">Start Again</button>' +
        "</div>" +
        (appState.showShareQR
            ? '<div class="qr-share-card">' +
              '<canvas class="qr-share-canvas"></canvas>' +
              '<p class="qr-share-caption">Scan with your phone\'s camera to save your results.</p>' +
              "</div>"
            : "") +
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Add Scan to Take With You QR reveal to the colour result screen"
```

---

### Task 7: Reset `showShareQR` on restart

**Files:**
- Modify: `app.js:6603-6609` (`colour-restart` handler)
- Modify: `app.js:6610-` (`style-restart` handler)

**Interfaces:**
- Consumes/mutates: `appState.showShareQR`.

- [ ] **Step 1: Reset in `colour-restart`**

Current (`app.js:6603-6609`):
```javascript
    else if (action === "colour-restart") {
        appState.colourStep = 0;
        appState.colourAnswersById = {};
        appState.colourResultKey = null;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        navigateColourDirection();
    }
```

Add one line:
```javascript
    else if (action === "colour-restart") {
        appState.colourStep = 0;
        appState.colourAnswersById = {};
        appState.colourResultKey = null;
        appState.showShareQR = false;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        navigateColourDirection();
    }
```

- [ ] **Step 2: Reset in `style-restart`**

`style-restart` begins at `app.js:6610`:
```javascript
    else if (action === "style-restart") {
        appState.quizStep = 0;
        appState.quizAnswers = [];
        appState.quizAnswersById = {};
        appState.selFocus = "";
        appState.selFit = "";
        appState.selPalette = "";
```
(more field resets follow). Read the full handler first (`grep -n "style-restart" -A 20 app.js`) to see every field it resets, then add `appState.showShareQR = false;` as one more line in that same list — alongside the other `appState.selX = ""` resets, before whatever closes the block.

- [ ] **Step 3: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "Reset showShareQR on style/colour restart"
```

---

### Task 8: Wire the `share-qr` click handler

**Files:**
- Modify: `app.js:6633` area (delegated click handler, alongside `save-card`)

**Interfaces:**
- Consumes: `data-action="share-qr"` (Tasks 5, 6); `appState.showShareQR` (Task 2); `render()` (existing function).

- [ ] **Step 1: Add the branch**

Immediately before the existing `else if (action === "save-card") {` branch at `app.js:6633`, add:
```javascript
    else if (action === "share-qr") {
        appState.showShareQR = !appState.showShareQR;
        render();
    }
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Wire share-qr click handler to toggle the QR reveal"
```

---

### Task 9: Draw the QR after render

**Files:**
- Modify: `app.js:6246` and the matching line in the `animate: true` branch (search for the second `if (typeof initHeritageStrips === "function") initHeritageStrips();` — same line, appears once per branch of `render()`)

**Interfaces:**
- Consumes: `initShareQR()` (Task 3).

- [ ] **Step 1: Add the call after both `initHeritageStrips()` calls**

This exact line appears twice in `app.js` (once in the `!animate` branch, once in the `animate` branch's `setTimeout`):
```javascript
            if (typeof initHeritageStrips === "function") initHeritageStrips();
```
Using `replace_all` (the addition is identical both times), change each occurrence to:
```javascript
            if (typeof initHeritageStrips === "function") initHeritageStrips();
            if (typeof initShareQR === "function") initShareQR();
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0). Also run `grep -c "initShareQR" app.js` — expected: `2` (one call per `render()` branch). If it's `1`, the `replace_all` only hit one branch — add the line to the other branch manually.

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Draw the share QR after every render"
```

---

### Task 10: Style the QR reveal card

**Files:**
- Modify: `styles.css` (append new section at end of file — brand-new selectors, no existing `.qr-share-*` rules to collide with)

**Interfaces:**
- Consumes: `--ease-out` (styles.css:78), `--dur-base` (styles.css:81), the existing `@media (prefers-reduced-motion: reduce)` pattern (e.g. styles.css:7449).
- Produces: `.qr-share-card`, `.qr-share-canvas`, `.qr-share-caption` — consumed by Tasks 5/6's markup.

- [ ] **Step 1: Append the new section**

At the end of `styles.css`, add:
```css

/* ============================================
   QR RESULTS SHARE
   ============================================ */

.qr-share-card {
    background: #faf8f3;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 20px;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    animation: qrShareReveal var(--dur-base) var(--ease-out);
}

.qr-share-canvas {
    width: 220px;
    height: 220px;
}

.qr-share-caption {
    font-size: 0.85rem;
    color: var(--taupe);
    max-width: 260px;
    margin: 0;
}

@keyframes qrShareReveal {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
    .qr-share-card {
        animation: none;
    }
}
```

- [ ] **Step 2: Confirm the tokens referenced exist**

Run: `grep -n "^\s*--taupe:\|^\s*--line:" styles.css`
Expected: both print a line (these are existing root tokens; if either name doesn't match, use the actual token name found and update the block above before committing).

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Style the QR share reveal card"
```

---

### Task 11: Wire script tags, precache, and version bumps

**Files:**
- Modify: `index.html:337-349` (script tags)
- Modify: `sw.js:9,14,34` (`CACHE_VERSION`, `styles.css` entry, `app.js` entry, plus two new precache entries)

**Interfaces:**
- Consumes: `vendor/qrcode.min.js` (Task 1), `share-qr.js` (Task 3), current versions (`app.js?v=91`, `styles.css?v=92`, `CACHE_VERSION = "bbs-v114"`).

- [ ] **Step 1: Add script tags to `index.html`**

Current (`index.html:347-349`):
```html
    <script src="vendor/html2canvas.min.js"></script>
    <script src="vendor/jspdf.umd.min.js"></script>
    <script src="app.js?v=91"></script>
```

Replace with (note `app.js` version bumped, and `share-qr.js` loads *after* `app.js` since it reads the global `appState`):
```html
    <script src="vendor/html2canvas.min.js"></script>
    <script src="vendor/jspdf.umd.min.js"></script>
    <script src="vendor/qrcode.min.js"></script>
    <script src="app.js?v=92"></script>
    <script src="share-qr.js?v=1"></script>
```

- [ ] **Step 2: Bump `styles.css` version in `index.html`**

Search `index.html` for `styles.css?v=` and bump that occurrence from `92` to `93` (same number used in Step 4 below).

- [ ] **Step 3: Bump `CACHE_VERSION` in `sw.js`**

Current (`sw.js:9`):
```javascript
var CACHE_VERSION = "bbs-v114";
```
Replace with:
```javascript
var CACHE_VERSION = "bbs-v115";
```

- [ ] **Step 4: Update `sw.js` PRECACHE list**

Current (`sw.js:14,32-34`):
```javascript
    "./styles.css?v=92",
```
and
```javascript
    "./vendor/html2canvas.min.js",
    "./vendor/jspdf.umd.min.js",
    "./app.js?v=91",
```

Change the `styles.css` line to `"./styles.css?v=93",` and change the vendor/app block to:
```javascript
    "./vendor/html2canvas.min.js",
    "./vendor/jspdf.umd.min.js",
    "./vendor/qrcode.min.js",
    "./app.js?v=92",
    "./share-qr.js?v=1",
```

- [ ] **Step 5: Verify syntax**

Run: `node --check sw.js`
Expected: no output (exit code 0). (`index.html` has no JS syntax to check directly; Task 13's Playwright pass covers it.)

- [ ] **Step 6: Commit**

```bash
git add index.html sw.js
git commit -m "Wire share-qr.js and vendor/qrcode.min.js into load order, bump cache version"
```

---

### Task 12: Confirm `data.js`/`verify/audit.js` are unaffected

**Amendment (discovered running this task):** `verify/audit.js` does more
than check `data.js` — it also pins `index.html`'s exact `<script src>`
order against a hardcoded `EXPECTED_SCRIPT_ORDER` array, as a guard against
the load-bearing order documented in `CLAUDE.md` silently drifting. Task 11
correctly added `vendor/qrcode.min.js` and `share-qr.js` to `index.html`,
but nothing in the plan updated this array to match — so the audit now
correctly fails, exactly as it's designed to when the real order and the
documented order disagree. This task now includes fixing that.

**Files:**
- Modify: `verify/audit.js` (the `EXPECTED_SCRIPT_ORDER` array)

- [ ] **Step 1: Update the expected script order**

Current (`verify/audit.js`, in the `EXPECTED_SCRIPT_ORDER` array):
```javascript
var EXPECTED_SCRIPT_ORDER = [
    "data.js", "validator.js", "query.js", "discovery-ui.js",
    "colour-direction.js", "lookbook.js", "wardrobe-templates.js",
    "cloth-data.js", "heritage.js", "attract-shader.js", "weave-engine.js",
    "garment-photo.js", "fabric-visualiser.js", "cloth-study.js",
    "archetype-avatars.js", "vendor/cobe.js", "mill-map.js",
    "vendor/html2canvas.min.js", "vendor/jspdf.umd.min.js", "app.js"
];
```

Replace with (adds the two new entries in the exact positions Task 11 put
them in `index.html` — `vendor/qrcode.min.js` alongside the other vendor
libraries, `share-qr.js` after `app.js`):
```javascript
var EXPECTED_SCRIPT_ORDER = [
    "data.js", "validator.js", "query.js", "discovery-ui.js",
    "colour-direction.js", "lookbook.js", "wardrobe-templates.js",
    "cloth-data.js", "heritage.js", "attract-shader.js", "weave-engine.js",
    "garment-photo.js", "fabric-visualiser.js", "cloth-study.js",
    "archetype-avatars.js", "vendor/cobe.js", "mill-map.js",
    "vendor/html2canvas.min.js", "vendor/jspdf.umd.min.js",
    "vendor/qrcode.min.js", "app.js", "share-qr.js"
];
```

- [ ] **Step 2: Run the data audit**

Run: `node verify/audit.js`
Expected: exits clean, ending in `AUDIT: ALL CHECKS PASSED` (or equivalent
all-PASS output) — in particular the "script tag order matches CLAUDE.md's
documented load order" check must now read PASS, and the topic/cloth/mill
checks (unaffected by this feature) must still all read PASS too.

- [ ] **Step 3: Commit**

```bash
git add verify/audit.js
git commit -m "Add vendor/qrcode.min.js and share-qr.js to audit's expected script order"
```

---

### Task 13: End-to-end verification

**Files:**
- Create (temporary, not committed): a Playwright script under the job's scratch directory, e.g. `$CLAUDE_JOB_DIR/tmp/verify-qr-share.js`

**Interfaces:**
- Exercises everything from Tasks 1–11 together.

- [ ] **Step 1: Serve the app locally**

Run (in the repo root, background):
```bash
npx serve . -l 5000
```

- [ ] **Step 2: Write the temporary Playwright script**

```javascript
// $CLAUDE_JOB_DIR/tmp/verify-qr-share.js
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    // 1. Load the app, complete the style quiz far enough to reach a result.
    //    (Adjust selectors to match the actual quiz flow if they've drifted
    //    since this plan was written — read app.js's onboarding/quiz view
    //    functions if any selector below doesn't match.)
    await page.goto("http://localhost:5000/");
    await page.waitForSelector("body");

    // 2. Directly set a result via localStorage to reach the result screen
    //    without walking the full quiz (faster, and isolates this feature
    //    from quiz-flow regressions, which smoke.js already covers).
    await page.evaluate(() => {
        var state = {
            view: "result",
            archetypeKey: "modern_minimalist",
            colourResultKey: null,
            history: [],
            wardrobeChecklist: {},
        };
        localStorage.setItem("bbs_session", JSON.stringify(state));
    });
    await page.reload();

    const qrButton = page.locator('[data-action="share-qr"]');
    await qrButton.waitFor({ state: "visible", timeout: 10000 });
    await qrButton.click();

    const canvas = page.locator(".qr-share-canvas");
    await canvas.waitFor({ state: "visible", timeout: 5000 });
    const canvasHasContent = await canvas.evaluate((el) => {
        const ctx = el.getContext("2d");
        const data = ctx.getImageData(0, 0, el.width, el.height).data;
        return data.some((channel, i) => i % 4 !== 3 && channel !== 255);
    });
    if (!canvasHasContent) throw new Error("QR canvas appears blank");

    // 3. Read the encoded URL back out and follow it in a fresh context,
    //    simulating the client's own phone scanning the code.
    const shareUrl = await page.evaluate(() => buildShareURL(appState.archetypeKey, appState.colourResultKey));
    if (!shareUrl || shareUrl.indexOf("styleKey=modern_minimalist") === -1) {
        throw new Error("Unexpected share URL: " + shareUrl);
    }

    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();
    freshPage.on("pageerror", (err) => errors.push(String(err)));
    await freshPage.goto(shareUrl.replace(/^https:\/\/[^/]+\/bbs-style-discovery\//, "http://localhost:5000/"));
    await freshPage.waitForSelector(".arch-result-persona", { timeout: 10000 });
    const restoredView = await freshPage.evaluate(() => appState.view);
    if (restoredView !== "result") throw new Error("Restore did not land on result view, got: " + restoredView);

    await freshContext.close();
    await browser.close();

    if (errors.length > 0) {
        console.error("Console/page errors detected:", errors);
        process.exit(1);
    }
    console.log("QR share verification passed.");
})();
```

- [ ] **Step 3: Run it**

Run: `node $CLAUDE_JOB_DIR/tmp/verify-qr-share.js`
Expected: prints `QR share verification passed.` and exits 0. If a selector doesn't match (e.g. `.arch-result-persona` was renamed), read the current `renderResult()` output in `app.js` and fix the selector — do not delete the assertion.

- [ ] **Step 4: Manual check — colour-only and unified paths**

With the local server still running, in a real browser:
- Complete only the colour quiz, reach the colour result, tap "Scan to Take With You", confirm the QR appears.
- Complete both quizzes (Full Journey), reach the unified "This Is You" result, tap the button, confirm the QR appears there too, and that the encoded URL (log `buildShareURL(...)` in devtools) includes both `styleKey` and `colourKey`.
- Open the logged URL in a new tab; confirm it lands on the unified result (not a bare style-only result).

- [ ] **Step 5: Run the full smoke suite**

Run: `node verify/smoke.js`
Expected: exits clean, no new console errors or 4xx/5xx responses.

- [ ] **Step 6: Final commit (if Steps 3-5 required any fixes)**

If any fixes were needed to pass verification:
```bash
git add -A
git commit -m "Fix issues found during QR share end-to-end verification"
```

---

## Self-Review Notes

**Spec coverage:** Task 1 covers "New file + dependency" (vendoring). Task 3
covers `buildShareURL`/`initShareQR`. Task 4 covers "Restore-on-load". Tasks
5-6 cover "UI placement". Task 7 covers the spec's "State and wiring" reset
requirement. Task 8 covers the click-handler wiring. Task 9 covers "Drawing
the QR". Task 10 covers styling (spec didn't specify exact CSS — this task
follows the project's existing token/reduced-motion conventions). Task 11
covers deploy/cache-busting, required by `CLAUDE.md`'s Definition of Done.
Task 12/13 cover the spec's full testing checklist. No spec section is
without a task.

**Placeholder scan:** No "TBD"/"add error handling" placeholders — every
step has literal code or an exact command. Task 7's `style-restart` step
intentionally asks the implementer to read the current handler first (it
resets many fields already; hardcoding an old_string here without reading it
fresh risks decaying the moment anything else in that handler changes) —
this is a deliberate anchor-by-description choice, not a placeholder, and
the line to add is fully specified.

**Type/name consistency:** `buildShareURL(archetypeKey, colourResultKey)` —
same parameter order used in Task 3's definition, Task 9's usage note, and
Task 13's verification script. `appState.showShareQR` — same name in Tasks
2, 5, 6, 7, 8. `.qr-share-canvas` / `.qr-share-card` / `.qr-share-caption` —
same three class names across Tasks 5, 6, 10. `data-action="share-qr"` —
same string in Tasks 5, 6, 8.
