Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Launching Toram Online Web Application Suite   " -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Start Backend in new window
Write-Host "[1/3] Starting Backend API on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node server.js"

Start-Sleep -Seconds 2

# 2. Start Frontend in new window
Write-Host "[2/3] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 3

# 3. Start Ngrok Tunnel in new window
Write-Host "[3/3] Starting Ngrok Tunnel with Authtoken..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node scripts/start-tunnel.js"

Write-Host "`nAll services have been launched!" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "Ngrok Tunnel: Check the Ngrok terminal window for your public HTTPS URL" -ForegroundColor Yellow
