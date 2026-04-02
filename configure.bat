@echo off
echo ============================================
echo  CMS Portal - Quick Configuration Helper
echo ============================================
echo.
echo This will help you set your credentials.
echo.

set /p MYSQL_PASS=Enter your MySQL root password: 
set /p GMAIL=Enter your Gmail address: 
set /p GMAIL_APP_PASS=Enter your Gmail App Password (16 chars, no spaces): 
set /p ANTHROPIC_KEY=Enter your Anthropic API Key (sk-ant-...): 

set PROPS_FILE=%~dp0backend\src\main\resources\application.properties

powershell -Command "(gc '%PROPS_FILE%') -replace 'YOUR_MYSQL_PASSWORD', '%MYSQL_PASS%' | Set-Content '%PROPS_FILE%'"
powershell -Command "(gc '%PROPS_FILE%') -replace 'YOUR_GMAIL_ADDRESS@gmail.com', '%GMAIL%' | Set-Content '%PROPS_FILE%'"
powershell -Command "(gc '%PROPS_FILE%') -replace 'YOUR_GMAIL_APP_PASSWORD', '%GMAIL_APP_PASS%' | Set-Content '%PROPS_FILE%'"
powershell -Command "(gc '%PROPS_FILE%') -replace 'YOUR_ANTHROPIC_API_KEY', '%ANTHROPIC_KEY%' | Set-Content '%PROPS_FILE%'"

echo.
echo ============================================
echo  Configuration saved to application.properties
echo  Now run:  start-backend.bat
echo ============================================
pause
