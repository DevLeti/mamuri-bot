from typing import Optional
from fastapi import FastAPI
import daangn_crawl

# uvicorn main:app --reload
app = FastAPI()

@app.get("/daangn/{item}")
def read_item(item: str, q: Optional[str] = None):
    crawl_json = daangn_crawl.crawl(item)
    return crawl_json