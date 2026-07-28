import asyncio
from notebooklm import NotebookLMClient

NOTEBOOKS = [
    {
        "name": "Session Summaries",
        "id": "db9c779b-13bb-4a9f-bd4b-38946a8dd939",
    },
    {
        "name": "Raw Session Transcripts",
        "id": "f71ec634-7f3f-4823-bc72-de77cbc4c69a",
    },
]

async def sync():
    # Pass timeout=120.0 to the client initialization so all RPCs get 2 minutes
    async with NotebookLMClient.from_storage(timeout=120.0) as client:
        for nb in NOTEBOOKS:
            print("========================================")
            print(f" Checking Notebook: {nb['name']}")
            print(f" ID: {nb['id']}")
            print("========================================")

            try:
                sources = await client.sources.list(nb["id"])

                if not sources:
                    print("  └─ No sources found in this notebook.\n")
                    continue

                for source in sources:
                    source_id = getattr(source, "id", None) or str(source)
                    source_title = getattr(source, "title", source_id)

                    print(f"Refreshing: {source_title} ({source_id})...")
                    
                    success = False
                    for attempt in range(1, 3):
                        try:
                            await client.sources.refresh(
                                source_id=source_id, 
                                notebook_id=nb["id"]
                            )
                            print("  └─ Successfully refreshed.\n")
                            success = True
                            break
                        except Exception as e:
                            print(f"  └─ Attempt {attempt} failed: {e}")
                            if attempt < 2:
                                print("     Retrying in 5 seconds...")
                                await asyncio.sleep(5)
                    
                    if not success:
                        print("  └─ [ERROR] Max retries reached for this source.\n")

            except Exception as e:
                print(f"  └─ Failed to list sources: {e}\n")

if __name__ == "__main__":
    asyncio.run(sync())