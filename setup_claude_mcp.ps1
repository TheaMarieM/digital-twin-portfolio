# Digital Twin MCP Setup for Claude Desktop
# This script starts all required services

Write-Host "🚀 Digital Twin MCP Setup for Claude Desktop" -ForegroundColor Green
Write-Host ""

# Check if MCP server is already running
$mcpProcess = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*mcp*server*"}

if (-not $mcpProcess) {
    Write-Host "1. Starting MCP Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoProfile", "-Command", "cd 'c:\Users\Admin\my-ai-app'; python mcp\server.py" -WindowStyle Minimized
    Start-Sleep 3
} else {
    Write-Host "1. ✅ MCP Server already running" -ForegroundColor Green
}

Write-Host "2. Testing MCP Server connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "   ✅ MCP Server responding: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ MCP Server not responding" -ForegroundColor Red
    Write-Host "   Please check if port 3000 is available" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Claude Desktop Configuration:" -ForegroundColor Cyan
Write-Host "   Server Name: digital-twin-portfolio" -ForegroundColor White
Write-Host "   Status: Active" -ForegroundColor Green
Write-Host ""
Write-Host "🔥 Test Commands for Claude Desktop:" -ForegroundColor Cyan
Write-Host "   'What is my professional experience?'" -ForegroundColor White
Write-Host "   'Tell me about my key projects'" -ForegroundColor White
Write-Host "   'Help me prepare for an interview'" -ForegroundColor White
Write-Host "   'What are my technical skills?'" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "   - Keep VS Code open (MCP server running)" -ForegroundColor White
Write-Host "   - Restart Claude Desktop if you don't see the tools" -ForegroundColor White
Write-Host "   - Your digital twin has 7 specialized tools available" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")