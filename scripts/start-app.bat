@echo off
echo ============================================================
echo   UIDAI Hackathon - Starting Full Stack Application
echo ============================================================
echo.

echo Starting Backend API Server (Python FastAPI)...
start "UIDAI API Server" cmd /k "cd /d %~dp0.. && python scripts\api_server.py"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend (Next.js)...
start "UIDAI Frontend" cmd /k "cd /d %~dp0..\uidai-code && npm run dev"

echo.
echo ============================================================
echo   Servers Starting...
echo ============================================================
echo   Backend API:  http://localhost:8000
echo   API Docs:     http://localhost:8000/docs
echo   Frontend:     http://localhost:3000
echo ============================================================
echo.
echo Press any key to stop all servers...
pause > nul

taskkill /FI "WINDOWTITLE eq UIDAI*" /F
echo.
echo All servers stopped.
