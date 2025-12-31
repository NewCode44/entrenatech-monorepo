@echo off
echo ============================================
echo     📱 INSTALAR APK ENTRENATECH FLUTTER
echo ============================================
echo.

cd "entrenatech_flutter_app"

echo 🔍 Verificando APK creado...
if not exist "build\app\outputs\flutter-apk\app-debug.apk" (
    echo ❌ ERROR: APK no encontrado. Ejecuta BUILD_FLUTTER_APK.bat primero.
    pause
    exit /b 1
)

echo ✅ APK encontrado correctamente
echo 📱 Ubicación: build\app\outputs\flutter-apk\app-debug.apk
echo 📏 Tamaño:
for %%F in ("build\app\outputs\flutter-apk\app-debug.apk") do echo %%~zF bytes
echo.

echo.
echo ============================================
echo     OPCIONES DE INSTALACIÓN
echo ============================================
echo.
echo 1. 📱 Instalar en dispositivo Android conectado (ADB)
echo 2. 📁 Abrir carpeta del APK para instalación manual
echo 3. 🔄 Ejecutar app directamente (si está conectado)
echo 4. 📊 Verificar información del APK
echo 5. ❌ Salir
echo.

set /p choice="Selecciona una opción (1-5): "

if "%choice%"=="1" goto install_adb
if "%choice%"=="2" goto open_folder
if "%choice%"=="3" goto run_app
if "%choice%"=="4" goto apk_info
if "%choice%"=="5" goto end

echo ❌ Opción inválida
goto end

:install_adb
echo.
echo 📱 Verificando dispositivos Android conectados...
adb devices

echo.
echo 🚀 Instalando APK en dispositivo...
adb install "build\app\outputs\flutter-apk\app-debug.apk"

if %errorlevel% equ 0 (
    echo ✅ APK instalado exitosamente!
    echo.
    echo 💡 Para abrir la app, usa:
    echo    adb shell am start -n com.entrenatech.entrenatech_flutter_app/.MainActivity
) else (
    echo ❌ Error instalando APK
    echo 💡 Asegúrate de tener un dispositivo Android conectado con depuración USB activada
)
echo.
pause
goto end

:open_folder
echo.
echo 📁 Abriendo carpeta del APK...
explorer "build\app\outputs\flutter-apk"
echo.
echo 💡 Arrastra el archivo app-debug.apk a tu dispositivo Android y abrelo para instalar
pause
goto end

:run_app
echo.
echo 🔄 Ejecutando app directamente...
flutter run
goto end

:apk_info
echo.
echo 📊 INFORMACIÓN DEL APK:
echo ============================================
echo 📱 Nombre: app-debug.apk
echo 📏 Tamaño:
for %%F in ("build\app\outputs\flutter-apk\app-debug.apk") do echo    %%~zF bytes (%%~z1 KB / %%~z2 MB)
echo.
echo 📦 Paquete: com.entrenatech.entrenatech_flutter_app
echo 🔤 Version: Debug
echo 📅 Fecha: %date% %time%
echo.
echo 📋 Características principales:
echo    ✅ Detección WiFi inteligente
echo    ✅ Sistema de pagos simulado
echo    ✅ UI/UX premium con gradientes
echo    ✅ Responsive design
echo    ✅ Animaciones suaves
echo    ✅ Demostración completa del modelo de negocio
echo.
echo 🎯 Uso recomendado:
echo    - Demostración a dueños de gimnasios
echo    - Presentación a inversores
echo    - Testing de funcionalidades
echo    - Validación del concepto MVP
echo.
pause
goto end

:end
echo.
echo ============================================
echo     ✅ LISTO PARA PROBAR ENTRENATECH!
echo ============================================
echo.
echo 🎯 Próximos pasos:
echo    1. Instala el APK en tu dispositivo
echo    2. Abre la app y explora sus características
echo    3. Prueba el flujo de detección WiFi
echo    4. Simula el proceso de suscripción
echo    5. Demuéstralo a clientes potenciales
echo.
echo 🚀 ¡Tu app Flutter está lista para impresionar!
echo.

pause