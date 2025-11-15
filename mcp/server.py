#!/usr/bin/env python3
"""
MCP-compatible HTTP Server for Portfolio Digital Twin
Exposes portfolio data and RAG capabilities via REST API
(Compatible with MCP protocol without requiring the SDK)
"""
import os
import sys
import json
from pathlib import Path
from contextlib import asynccontextmanager

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Any, Dict, List
import uvicorn

# Import our custom tools
from tools.portfolio_tools import (
    query_portfolio,
    get_projects,
    get_skills,
    search_experience
)
from tools.interview_tools import (
    ask_interview_question,
    get_interview_questions
)
from tools.rag_tools import (
    semantic_search,
    embed_query
)

# Store portfolio data in memory
PORTFOLIO_DATA = None

def load_portfolio():
    """Load portfolio data from profile.json"""
    global PORTFOLIO_DATA
    try:
        profile_path = Path(__file__).parent.parent / "data" / "profile.json"
        with open(profile_path, 'r', encoding='utf-8') as f:
            PORTFOLIO_DATA = json.load(f)
        return PORTFOLIO_DATA
    except Exception as e:
        print(f"Error loading portfolio: {e}")
        return None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global PORTFOLIO_DATA
    try:
        print("🚀 Starting Portfolio Digital Twin MCP Server on http://127.0.0.1:3000")
        load_portfolio()
        print("✅ Portfolio Digital Twin MCP Server started")
        print(f"📊 Loaded {len(PORTFOLIO_DATA.get('star_items', []))} portfolio items")
    except Exception as e:
        print(f"❌ Error during startup: {e}")
        import traceback
        traceback.print_exc()
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Portfolio Digital Twin MCP Server")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Portfolio Digital Twin MCP Server",
    description="Model Context Protocol server exposing portfolio data and RAG capabilities",
    version="1.0.0",
    lifespan=lifespan
)

# Request/Response models
class ToolRequest(BaseModel):
    name: str
    arguments: Optional[Dict[str, Any]] = {}

class ToolResponse(BaseModel):
    success: bool
    result: Optional[Any] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    """Server info"""
    return {
        "name": "portfolio-digital-twin",
        "version": "1.0.0",
        "protocol": "MCP-compatible HTTP",
        "tools_available": 7,
        "status": "ready"
    }

@app.get("/tools")
async def list_tools():
    """List all available MCP tools"""
    return {
        "tools": [
            {
                "name": "query_portfolio",
                "description": "Query the portfolio for specific information about projects, skills, or experience",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Natural language query"}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "get_projects",
                "description": "Get a list of all projects with details",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "limit": {"type": "number", "description": "Maximum number of projects"}
                    }
                }
            },
            {
                "name": "get_skills",
                "description": "Get technical skills and experience areas",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "category": {"type": "string", "description": "Optional category filter"}
                    }
                }
            },
            {
                "name": "search_experience",
                "description": "Search for specific experience using keywords",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "keywords": {"type": "string", "description": "Keywords to search"}
                    },
                    "required": ["keywords"]
                }
            },
            {
                "name": "ask_interview_question",
                "description": "Get portfolio-based answer to interview questions",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string", "description": "Interview question"}
                    },
                    "required": ["question"]
                }
            },
            {
                "name": "get_interview_questions",
                "description": "Get common interview questions by category",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "category": {"type": "string", "description": "Question category"}
                    }
                }
            },
            {
                "name": "semantic_search",
                "description": "Perform semantic vector search using RAG",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Search query"},
                        "top_k": {"type": "number", "description": "Number of results"}
                    },
                    "required": ["query"]
                }
            }
        ]
    }

@app.post("/call_tool", response_model=ToolResponse)
async def call_tool(request: ToolRequest):
    """Execute a tool"""
    if PORTFOLIO_DATA is None:
        load_portfolio()
    
    try:
        args = request.arguments or {}
        
        # Route to appropriate tool
        if request.name == "query_portfolio":
            result = await query_portfolio(args.get("query", ""), PORTFOLIO_DATA)
        
        elif request.name == "get_projects":
            result = await get_projects(PORTFOLIO_DATA, args.get("limit"))
        
        elif request.name == "get_skills":
            result = await get_skills(PORTFOLIO_DATA, args.get("category"))
        
        elif request.name == "search_experience":
            result = await search_experience(args.get("keywords", ""), PORTFOLIO_DATA)
        
        elif request.name == "ask_interview_question":
            result = await ask_interview_question(args.get("question", ""), PORTFOLIO_DATA)
        
        elif request.name == "get_interview_questions":
            result = await get_interview_questions(args.get("category"))
        
        elif request.name == "semantic_search":
            result = await semantic_search(
                args.get("query", ""),
                args.get("top_k", 5)
            )
        
        else:
            raise HTTPException(status_code=404, detail=f"Unknown tool: {request.name}")
        
        return ToolResponse(success=True, result=result)
    
    except Exception as e:
        return ToolResponse(success=False, error=str(e))

if __name__ == "__main__":
    # Load environment from .env.local if available
    env_path = Path(__file__).parent.parent / ".env.local"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip().strip('"')
    
    print("🚀 Starting Portfolio Digital Twin MCP Server on http://127.0.0.1:3000")
    uvicorn.run(app, host="127.0.0.1", port=3000, log_level="info")
