# Testing the MCP Server

## Quick Start

### Terminal 1: Start the Server
```powershell
& .venv\Scripts\Activate.ps1
python mcp/server.py
```

Wait for: `✅ Portfolio Digital Twin MCP Server started`

### Terminal 2: Run Tests
```powershell
& .venv\Scripts\Activate.ps1
python mcp/test_server.py
```

## Manual Testing with PowerShell

### 1. Get Server Info
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8001/" | ConvertTo-Json
```

### 2. List Available Tools
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8001/tools" | ConvertTo-Json -Depth 5
```

### 3. Test get_projects Tool
```powershell
$body = @{
    name = "get_projects"
    arguments = @{
        limit = 3
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/call_tool" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 10
```

### 4. Test get_skills Tool
```powershell
$body = @{
    name = "get_skills"
    arguments = @{
        category = "frontend"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/call_tool" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 10
```

### 5. Test query_portfolio Tool
```powershell
$body = @{
    name = "query_portfolio"
    arguments = @{
        query = "accessibility and responsive design"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/call_tool" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 10
```

### 6. Test ask_interview_question Tool
```powershell
$body = @{
    name = "ask_interview_question"
    arguments = @{
        question = "What are your core technical skills?"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/call_tool" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 10
```

## ✅ Success Indicators

- `"success": true` in response
- `"result"` contains the tool output
- No `"error"` field

## 📊 Expected Results

### get_projects
Returns list of projects with titles, descriptions, actions, and results.

### get_skills
Returns categorized skills (frontend, backend, tools, practices).

### query_portfolio
Returns matches from portfolio based on query keywords.

### ask_interview_question
Returns portfolio context and relevant examples for interview answers.

## 🐛 Troubleshooting

### Connection Refused
- Ensure server is running in Terminal 1
- Check port 8001 is not in use: `Get-NetTCPConnection -LocalPort 8001`

### Empty Results
- Verify `data/profile.json` exists and has content
- Check server logs for errors

### Import Errors
- Ensure Python venv is activated
- Run: `pip install fastapi uvicorn requests pydantic`
