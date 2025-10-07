@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║           EntrénaTech - Iniciar Aplicaciones              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando Dashboard y Portal de Miembros...
echo.
echo 📊 Dashboard estará en: http://localhost:5173
echo 💪 Portal de Miembros estará en: http://localhost:3002
echo.
echo ⚠️  NO CIERRES ESTA VENTANA - Los servidores se ejecutan aquí
echo.

start "EntrénaTech Dashboard" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 3 /nobreak >nul
start "EntrénaTech Member Portal" cmd /k "cd /d "%~dp0" && npm run dev:portal"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 🌐 Abriendo launcher en tu navegador en 5 segundos...
timeout /t 5 /nobreak >nul

start "" "%~dp0launcher.html"

echo.
echo 💡 Presiona cualquier tecla para cerrar esta ventana (los servidores seguirán corriendo)
pause >nul
