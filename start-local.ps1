$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = Get-Location }

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  🎮 Launching Toram Localhost (Frontend + Backend) " -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Start Backend
Write-Host "`n[1/2] Starting Backend API on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\backend'; npm run dev"

Start-Sleep -Seconds 2

# 2. Start Frontend
Write-Host "[2/2] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; npm run dev"

Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "`n🌐 Opening Browser at http://localhost:3000..." -ForegroundColor Magenta
Start-Process "http://localhost:3000"

Write-Host "`nAll localhost services launched successfully!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
