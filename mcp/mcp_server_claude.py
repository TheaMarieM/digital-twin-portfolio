#!/usr/bin/env python3
"""
MCP Server for Digital Twin Portfolio
Compatible with Claude Desktop MCP protocol
"""
import asyncio
import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Optional

# Add parent directory for imports
sys.path.insert(0, str(Path(__file__).parent))

# Import MCP server functionality
try:
    from mcp.server.fastmcp import FastMCP
    from mcp.server.models import InitializationOptions
    from mcp.types import Tool, TextContent, ImageContent
except ImportError:
    # If FastMCP not available, use basic implementation
    print("Note: FastMCP not available, using basic MCP implementation")
    from mcp.server import Server
    from mcp.server.models import InitializationOptions
    from mcp.types import Tool, TextContent

# Import our tools
from tools.portfolio_tools import query_portfolio, get_projects, get_skills, search_experience
from tools.interview_tools import ask_interview_question, get_interview_questions
from tools.rag_tools import semantic_search

# Global portfolio data
PORTFOLIO_DATA = None

def load_portfolio():
    """Load portfolio data from profile.json"""
    global PORTFOLIO_DATA
    try:
        profile_path = Path(__file__).parent.parent / "data" / "profile.json"
        with open(profile_path, 'r', encoding='utf-8') as f:
            PORTFOLIO_DATA = json.load(f)
        return True
    except Exception as e:
        print(f"Error loading portfolio: {e}")
        return False

# Create MCP server
try:
    app = FastMCP("Digital Twin Portfolio")
except:
    # Fallback to basic server
    from mcp.server import Server
    app = Server("digital-twin-portfolio")

@app.tool()
async def query_portfolio_tool(query: str) -> str:
    """Query the portfolio for specific information about projects, skills, or experience"""
    result = await query_portfolio(query, PORTFOLIO_DATA)
    return json.dumps(result, indent=2)

@app.tool()
async def get_projects_tool(limit: Optional[int] = None) -> str:
    """Get a list of all projects with details"""
    result = await get_projects(PORTFOLIO_DATA, limit)
    return json.dumps(result, indent=2)

@app.tool()
async def get_skills_tool(category: Optional[str] = None) -> str:
    """Get technical skills and experience areas"""
    result = await get_skills(PORTFOLIO_DATA, category)
    return json.dumps(result, indent=2)

@app.tool()
async def search_experience_tool(keywords: str) -> str:
    """Search for specific experience using keywords"""
    result = await search_experience(keywords, PORTFOLIO_DATA)
    return json.dumps(result, indent=2)

@app.tool()
async def ask_interview_question_tool(question: str) -> str:
    """Get portfolio-based answer to interview questions"""
    result = await ask_interview_question(question, PORTFOLIO_DATA)
    return json.dumps(result, indent=2)

@app.tool()
async def get_interview_questions_tool(category: Optional[str] = None) -> str:
    """Get common interview questions by category"""
    result = await get_interview_questions(category)
    return json.dumps(result, indent=2)

@app.tool()
async def semantic_search_tool(query: str, top_k: int = 5) -> str:
    """Perform semantic vector search using RAG"""
    result = await semantic_search(query, top_k)
    return json.dumps(result, indent=2)

# Initialize and run
async def main():
    # Load portfolio data
    if not load_portfolio():
        print("❌ Failed to load portfolio data")
        return
    
    print("✅ Portfolio Digital Twin MCP Server started")
    print(f"📊 Loaded {len(PORTFOLIO_DATA.get('star_items', []))} portfolio items")
    
    # Run the server
    options = InitializationOptions(
        server_name="digital-twin-portfolio",
        server_version="1.0.0"
    )
    
    # Start MCP server
    await app.run(options)

if __name__ == "__main__":
    print("🚀 Starting Portfolio Digital Twin MCP Server...")
    asyncio.run(main())