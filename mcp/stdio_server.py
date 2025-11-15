#!/usr/bin/env python3
"""
Simple MCP-compatible server for Claude Desktop
Uses stdio protocol instead of HTTP
"""
import json
import sys
import asyncio
from pathlib import Path

# Add parent directory for imports
sys.path.insert(0, str(Path(__file__).parent))

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
        print(f"Error loading portfolio: {e}", file=sys.stderr)
        return False

def send_response(id, result=None, error=None):
    """Send JSON-RPC response"""
    response = {
        "jsonrpc": "2.0",
        "id": id
    }
    
    if error:
        response["error"] = {"code": -32000, "message": error}
    else:
        response["result"] = result
    
    print(json.dumps(response), flush=True)

def send_tools_list(id):
    """Send list of available tools"""
    tools = [
        {
            "name": "query_portfolio",
            "description": "Query the portfolio for specific information about projects, skills, or experience",
            "inputSchema": {
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
            "inputSchema": {
                "type": "object",
                "properties": {
                    "limit": {"type": "number", "description": "Maximum number of projects"}
                }
            }
        },
        {
            "name": "get_skills",
            "description": "Get technical skills and experience areas", 
            "inputSchema": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "description": "Skill category"}
                }
            }
        },
        {
            "name": "ask_interview_question",
            "description": "Get portfolio-based answer to interview questions",
            "inputSchema": {
                "type": "object", 
                "properties": {
                    "question": {"type": "string", "description": "Interview question"}
                },
                "required": ["question"]
            }
        }
    ]
    
    send_response(id, {"tools": tools})

async def call_tool(id, name, arguments):
    """Call a specific tool"""
    try:
        if not PORTFOLIO_DATA:
            send_response(id, error="Portfolio data not loaded")
            return
            
        if name == "query_portfolio":
            result = await query_portfolio(arguments.get("query", ""), PORTFOLIO_DATA)
        elif name == "get_projects":
            result = await get_projects(PORTFOLIO_DATA, arguments.get("limit"))
        elif name == "get_skills":
            result = await get_skills(PORTFOLIO_DATA, arguments.get("category"))
        elif name == "ask_interview_question":
            result = await ask_interview_question(arguments.get("question", ""), PORTFOLIO_DATA)
        elif name == "search_experience":
            result = await search_experience(arguments.get("keywords", ""), PORTFOLIO_DATA)
        elif name == "get_interview_questions":
            result = await get_interview_questions(arguments.get("category"))
        elif name == "semantic_search":
            result = await semantic_search(arguments.get("query", ""), arguments.get("top_k", 5))
        else:
            send_response(id, error=f"Unknown tool: {name}")
            return
        
        send_response(id, {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps(result, indent=2)
                }
            ]
        })
        
    except Exception as e:
        send_response(id, error=str(e))

async def handle_request(request):
    """Handle incoming JSON-RPC request"""
    try:
        method = request.get("method")
        params = request.get("params", {})
        id = request.get("id")
        
        if method == "initialize":
            send_response(id, {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {"listChanged": True}
                },
                "serverInfo": {
                    "name": "digital-twin-portfolio",
                    "version": "1.0.0"
                }
            })
            
        elif method == "tools/list":
            send_tools_list(id)
            
        elif method == "tools/call":
            await call_tool(id, params.get("name"), params.get("arguments", {}))
            
        else:
            send_response(id, error=f"Unknown method: {method}")
            
    except Exception as e:
        send_response(request.get("id"), error=str(e))

async def main():
    """Main server loop"""
    # Load portfolio data
    if not load_portfolio():
        sys.exit(1)
    
    print(f"✅ Loaded {len(PORTFOLIO_DATA.get('star_items', []))} portfolio items", file=sys.stderr)
    
    # Process stdin
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
                
            request = json.loads(line.strip())
            await handle_request(request)
            
        except json.JSONDecodeError:
            continue
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    asyncio.run(main())