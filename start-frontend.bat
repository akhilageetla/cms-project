@echo off
echo ============================================
echo  CMS Portal - Starting React Frontend
echo ============================================
echo.
cd /d "%~dp0frontend"
echo Installing packages (first time only)...
call npm install
echo.
echo Starting frontend on http://localhost:3000
echo Press Ctrl+C to stop.
echo.
call npm start
pause
