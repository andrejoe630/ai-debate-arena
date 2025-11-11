@echo off
echo Starting AI Debate Arena...
echo.
echo This will open two command windows:
echo 1. Backend Server (Port 5050)
echo 2. Frontend UI (Port 5173)
echo.

cd /d "%~dp0"

echo Starting Backend Server...
start "AI Debate Backend" cmd /k "npm run serve"

timeout /t 3 /nobreak >nul

echo Starting Frontend UI...
cd debate-ui
start "AI Debate Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting!
echo.
echo Backend:  http://localhost:5050
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)...
pause >nul
