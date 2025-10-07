@echo off
echo.
echo =============================================
echo   EntrenaTech - Sistema Completo
echo =============================================
echo.
echo Iniciando todas las aplicaciones...
echo.
echo 1. Dashboard Admin: http://localhost:5173
echo 2. Portal Miembros: http://localhost:3002
echo 3. SuperAdmin Dashboard: http://localhost:5174
echo.
echo Presiona cualquier tecla para continuar o Ctrl+C para cancelar
echo.

pause > nul

echo.
echo Iniciando servidores en paralelo...
echo.

cd /d "%~dp0"

start "Dashboard Admin" cmd /k "npm run dev"
timeout /t 2 > nul
start "Portal Miembros" cmd /k "npm run dev:portal"
timeout /t 2 > nul
start "SuperAdmin Dashboard" cmd /k "npm run dev:superadmin"

echo.
echo =============================================
echo   Servidores iniciados correctamente
echo =============================================
echo.
echo URLs disponibles:
echo - Dashboard Admin:     http://localhost:5173
echo - Portal Miembros:     http://localhost:3002
echo - SuperAdmin Dashboard: http://localhost:5174
echo.
echo Mantén esta ventana abierta para que los servidores sigan corriendo
echo Cierra las ventanas individuales para detener cada servidor
echo.

pause