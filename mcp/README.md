# Portfolio Digital Twin MCP Server

✅ **STATUS: ACTIVE & WORKING WITH CLAUDE DESKTOP**

A Model Context Protocol (MCP) server that exposes your portfolio data, interview capabilities, and RAG search to AI assistants like Claude Desktop and VS Code Copilot.

**🎯 Successfully Connected**: Claude Desktop now has live access to portfolio data through MCP protocol.

## 🎯 Quick Success Verification

**Claude Desktop Integration**: ✅ **WORKING**

Test these queries in Claude Desktop:
```bash
"What are your technical skills?"
"Tell me about your accessibility projects"  
"Generate frontend interview questions"
```

**Expected Response**: Claude will return specific portfolio data including HTML/CSS skills, WCAG compliance projects, and tailored questions.

## 🚀 Features

### Tools Available

1. **query_portfolio** - Query portfolio using natural language
2. **get_projects** - Get list of all projects with details
3. **get_skills** - Get technical skills by category
4. **search_experience** - Search for specific experience using keywords
5. **ask_interview_question** - Get portfolio-based answers to interview questions
6. **get_interview_questions** - Get common interview questions by category
7. **semantic_search** - Perform RAG vector search across portfolio

## 📦 Installation

### 1. Install MCP SDK

```powershell
pip install mcp
```

### 2. Configure Environment

Your `.env.local` should already have:
```
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...
USE_LOCAL_EMBEDDINGS=true
LOCAL_EMBEDDING_SERVICE_URL=http://127.0.0.1:8000
```

### 3. Test the Server

```powershell
# Activate venv
& .venv\Scripts\Activate.ps1

# Load environment variables
$lines = Get-Content .env.local | Where-Object { $_ -and $_ -notmatch '^\s*#' }
foreach ($l in $lines) {
    if ($l -match '^\s*([^=]+)=(.*)$') {
        $n=$matches[1].Trim()
        $v=$matches[2].Trim().Trim('"')
        Set-Item -Path Env:\$n -Value $v
    }
}

# Run the server
python mcp/server.py
```

## 🔌 Integration

### Claude Desktop

Add to your Claude Desktop config (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "portfolio-digital-twin": {
      "command": "python",
      "args": ["C:\\Users\\Admin\\my-ai-app\\mcp\\server.py"],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "your-url-here",
        "UPSTASH_VECTOR_REST_TOKEN": "your-token-here",
        "USE_LOCAL_EMBEDDINGS": "true"
      }
    }
  }
}
```

### VS Code Copilot

Add to VS Code settings or use the MCP extension.

## 🧪 Testing Tools

### Using MCP Inspector

```powershell
npx @modelcontextprotocol/inspector python mcp/server.py
```

### Example Tool Calls

**Query Portfolio:**
```json
{
  "name": "query_portfolio",
  "arguments": {
    "query": "What experience do you have with accessibility?"
  }
}
```

**Get Projects:**
```json
{
  "name": "get_projects",
  "arguments": {
    "limit": 5
  }
}
```

**Ask Interview Question:**
```json
{
  "name": "ask_interview_question",
  "arguments": {
    "question": "Tell me about a challenging problem you solved"
  }
}
```

**Semantic Search (RAG):**
```json
{
  "name": "semantic_search",
  "arguments": {
    "query": "responsive design and accessibility",
    "top_k": 3
  }
}
```

## 📊 Architecture

```
mcp/
├── server.py                    # Main MCP server
├── config.json                  # MCP configuration
├── tools/
│   ├── __init__.py
│   ├── portfolio_tools.py       # Portfolio query tools
│   ├── interview_tools.py       # Interview simulation
│   └── rag_tools.py            # Vector search & RAG
└── README.md
```

## 🎯 Use Cases

1. **Recruiters**: Query portfolio data via AI assistants
2. **Interview Prep**: Practice with AI-powered interview questions
3. **Portfolio Search**: Semantic search across projects and experience
4. **Digital Twin**: AI representation that answers as you would

## 🔒 Security

- Never commit `.env.local` with real tokens
- MCP server runs locally by default
- Credentials passed via environment variables only

## 🐛 Troubleshooting

### Server won't start
- Ensure `pip install mcp` is installed
- Check Python path in config
- Verify environment variables are set

### Tools not appearing
- Check server output for errors
- Verify portfolio data exists at `data/profile.json`
- Restart Claude Desktop / VS Code after config changes

### RAG search not working
- Ensure Upstash Vector has indexed data (run `scripts/index_local_embeddings.py`)
- Check vector credentials in environment
- Verify local embedding service is running (if USE_LOCAL_EMBEDDINGS=true)

## 📚 Next Steps

1. Install MCP SDK: `pip install mcp`
2. Test server: `python mcp/server.py`
3. Configure Claude Desktop or VS Code
4. Try the tools with AI assistants!
