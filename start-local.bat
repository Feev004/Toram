@echo off
title Toram Online Localhost Launcher
color 0B
cd /d "%~dp0"

echo =======================================================
echo     Toram Online - Localhost Fullstack Launcher
echo =======================================================
echo.

echo [1/2] Starting Backend API (Port 5000)...
start "Toram Backend API" /d "%~dp0backend" cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (Port 3000)...
start "Toram Frontend" /d "%~dp0frontend" cmd /k "npm run dev"

echo.
echo Waiting for services to initialize (3 seconds)...
timeout /t 3 /nobreak >nul

echo.
echo Opening http://localhost:3000 in your default browser...
start http://localhost:3000

echo.
echo =======================================================
echo   Services started successfully!
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo =======================================================
echo.
pause
