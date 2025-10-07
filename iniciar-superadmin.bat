@echo off
echo.
echo =============================================
echo   EntrenaTech SuperAdmin Dashboard
echo =============================================
echo.
echo Iniciando servidor de desarrollo...
echo URL: http://localhost:5174
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

cd /d "%~dp0"

npm run dev:superadmin

pause