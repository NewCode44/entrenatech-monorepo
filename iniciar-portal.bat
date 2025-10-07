@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║           EntrénaTech - Portal de Miembros                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando Portal de Miembros...
echo 💪 URL: http://localhost:3002
echo.

cd /d "%~dp0"
npm run dev:portal

pause
