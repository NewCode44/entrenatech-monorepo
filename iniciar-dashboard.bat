@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║              EntrénaTech - Dashboard                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando Dashboard...
echo 📊 URL: http://localhost:5173
echo.

cd /d "%~dp0"
npm run dev

pause
