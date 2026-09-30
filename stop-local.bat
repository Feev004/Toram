@echo off
title Toram Online - Stop Localhost Services
color 0C
cd /d "%~dp0"

echo =======================================================
echo     Stopping Toram Localhost Services...
echo =======================================================
echo.

echo Searching and terminating processes on Port 3000 and 5000...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [Frontend] Found Process PID: %%a - Terminating...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo [Backend] Found Process PID: %%a - Terminating...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo =======================================================
echo   All Localhost services stopped successfully!
echo =======================================================
echo.
pause
