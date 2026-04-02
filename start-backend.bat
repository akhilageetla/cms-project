@echo off
echo ============================================
echo  CMS Portal - Starting Spring Boot Backend
echo ============================================
echo.
cd /d "%~dp0backend"
echo Building project...
call mvn clean install -DskipTests -q
echo.
echo Starting server on http://localhost:8080
echo Press Ctrl+C to stop.
echo.
call mvn spring-boot:run
pause
