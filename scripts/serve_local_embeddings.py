#!/usr/bin/env python3
"""
Lightweight local embedding server using sentence-transformers.

Run:
  python scripts/serve_local_embeddings.py

This starts a FastAPI app on 127.0.0.1:8000 by default. It exposes POST /embed
which accepts JSON { "input": string | [string] } and returns { "embeddings": [[...]] }

Environment variables:
  LOCAL_EMBEDDING_MODEL - optional, default: all-MiniLM-L6-v2
  PORT - optional, default 8000
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Union

try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    print("Missing 'sentence-transformers'. Install with: pip install sentence-transformers fastapi uvicorn")
    raise


class EmbedRequest(BaseModel):
    input: Union[str, List[str]]


app = FastAPI(title="Local Embedding Service")

MODEL_NAME = os.environ.get('LOCAL_EMBEDDING_MODEL', os.environ.get('EMBEDDING_MODEL', 'all-MiniLM-L6-v2'))
PORT = int(os.environ.get('PORT', '8000'))

print(f"Loading embedding model: {MODEL_NAME}")
model = SentenceTransformer(MODEL_NAME)
print("Model loaded. Ready to serve embeddings.")


@app.post('/embed')
def embed(req: EmbedRequest):
    texts = req.input if isinstance(req.input, list) else [req.input]
    if not texts:
        raise HTTPException(status_code=400, detail="No input texts provided")
    try:
        embs = model.encode(texts, show_progress_bar=False)
        embeddings = [list(map(float, e)) for e in embs]
        # If single input, return single embedding via 'embedding' field for convenience
        if isinstance(req.input, str):
            return {"embedding": embeddings[0]}
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=PORT)
