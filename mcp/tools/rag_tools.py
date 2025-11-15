"""
RAG (Retrieval-Augmented Generation) tools using Upstash Vector
"""
import os
import requests
from typing import Optional, List, Dict

async def semantic_search(query: str, top_k: int = 5) -> dict:
    """
    Perform semantic search using Upstash Vector
    """
    try:
        # Get environment variables
        vector_url = os.getenv("UPSTASH_VECTOR_REST_URL")
        vector_token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
        use_local = os.getenv("USE_LOCAL_EMBEDDINGS", "false").lower() == "true"
        
        if not vector_url or not vector_token:
            return {
                "error": "Upstash Vector credentials not configured",
                "results": []
            }
        
        # Get query embedding
        query_vector = await embed_query(query, use_local)
        
        if not query_vector:
            return {
                "error": "Failed to generate query embedding",
                "results": []
            }
        
        # Query Upstash Vector
        response = requests.post(
            f"{vector_url.rstrip('/')}/query",
            headers={
                "Authorization": f"Bearer {vector_token}",
                "Content-Type": "application/json"
            },
            json={
                "vector": query_vector,
                "topK": top_k,
                "includeMetadata": True,
                "includeVectors": False
            },
            timeout=10
        )
        
        if not response.ok:
            return {
                "error": f"Vector query failed: {response.status_code}",
                "results": []
            }
        
        data = response.json()
        results = []
        
        for match in data:
            results.append({
                "id": match.get("id", ""),
                "score": match.get("score", 0.0),
                "metadata": match.get("metadata", {}),
                "text": match.get("metadata", {}).get("text", "")
            })
        
        return {
            "query": query,
            "top_k": top_k,
            "results_found": len(results),
            "results": results
        }
    
    except Exception as e:
        return {
            "error": f"Semantic search failed: {str(e)}",
            "results": []
        }

async def embed_query(query: str, use_local: bool = True) -> Optional[List[float]]:
    """
    Generate embedding vector for a query
    """
    try:
        if use_local:
            # Use local embedding service
            local_url = os.getenv("LOCAL_EMBEDDING_SERVICE_URL", "http://127.0.0.1:8000")
            response = requests.post(
                f"{local_url.rstrip('/')}/embed",
                json={"input": query},
                timeout=10
            )
            
            if response.ok:
                data = response.json()
                return data.get("embedding", data.get("embeddings", [[]])[0])
        
        else:
            # Use OpenAI embeddings (fallback)
            openai_key = os.getenv("OPENAI_API_KEY")
            if not openai_key:
                return None
            
            response = requests.post(
                "https://api.openai.com/v1/embeddings",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "text-embedding-3-small",
                    "input": query
                },
                timeout=10
            )
            
            if response.ok:
                data = response.json()
                return data.get("data", [{}])[0].get("embedding")
        
        return None
    
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

async def get_vector_stats() -> dict:
    """
    Get statistics about the vector database
    """
    try:
        vector_url = os.getenv("UPSTASH_VECTOR_REST_URL")
        vector_token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
        
        if not vector_url or not vector_token:
            return {"error": "Upstash Vector credentials not configured"}
        
        response = requests.get(
            f"{vector_url.rstrip('/')}/info",
            headers={"Authorization": f"Bearer {vector_token}"},
            timeout=10
        )
        
        if response.ok:
            return response.json()
        
        return {"error": f"Failed to get vector stats: {response.status_code}"}
    
    except Exception as e:
        return {"error": f"Stats query failed: {str(e)}"}
