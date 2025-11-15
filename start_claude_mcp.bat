@echo off
echo 🚀 Starting Digital Twin MCP Setup for Claude Desktop
echo.

echo 1. Starting MCP Server on port 3000...
start "MCP Server" powershell -Command "cd c:\Users\Admin\my-ai-app; python mcp\server.py"

timeout /t 3 /nobreak >nul

echo 2. Starting MCP Bridge on port 3001...
start "MCP Bridge" powershell -Command "cd c:\Users\Admin\my-ai-app; python mcp_bridge.py"

timeout /t 3 /nobreak >nul

echo 3. Starting MCP Remote for Claude Desktop...
start "MCP Remote" powershell -Command "cd c:\Users\Admin\my-ai-app; npx -y mcp-remote http://localhost:3001"

echo.
echo ✅ All services started!
echo ✅ You can now use Claude Desktop with your digital twin
echo.
echo 🔗 Test in Claude Desktop by asking:
echo    "What is my professional experience?"
echo    "Tell me about my projects"
echo    "Help me prepare for an interview"
echo.
echo ⚠️  Keep this window open while using Claude Desktop
echo.
pause