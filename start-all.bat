@echo off
title Toram Online Fullstack Suite Launcher
color 0B
cd /d "%~dp0"

echo =================================================
echo   Launching Toram Online Web Application Suite
echo =================================================
echo.

echo [1/3] Starting Backend API (Port 5000)...
start "Toram Backend API" /d "%~dp0backend" cmd /k "node server.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Next.js Frontend (Port 3000)...
start "Toram Next.js Frontend" /d "%~dp0frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Ngrok Tunnel...
start "Toram Ngrok Tunnel" /d "%~dp0" cmd /k "node scripts/start-tunnel.js"

echo.
echo =================================================
echo  Services started successfully!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo =================================================
echo.
pause
