@echo off
echo ============================================
echo     🚀 ENTRENATECH FLUTTER APK BUILDER
echo ============================================
echo.

:: Verificar si Flutter está instalado
echo 🔍 Verificando instalación de Flutter...
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Flutter no está instalado o no está en el PATH
    echo 💡 Por favor instala Flutter desde: https://flutter.dev/docs/get-started/install
    pause
    exit /b 1
)
echo ✅ Flutter encontrado

:: Cambiar al directorio de la app Flutter
echo 📁 Cambiando al directorio de la app Flutter...
cd "entrenatech_flutter_app"
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se encontró el directorio entrenatech_flutter_app
    pause
    exit /b 1
)
echo ✅ Directorio encontrado

:: Verificar si hay un dispositivo Android conectado o emulador
echo 📱 Verificando dispositivos Android...
flutter devices
echo.

:: Limpiar build anterior
echo 🧹 Limpiando build anterior...
flutter clean
if %errorlevel% neq 0 (
    echo ❌ ERROR limpiando el proyecto
    pause
    exit /b 1
)
echo ✅ Build limpiado

:: Obtener dependencias
echo 📦 Obteniendo dependencias...
flutter pub get
if %errorlevel% neq 0 (
    echo ❌ ERROR obteniendo dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias actualizadas

:: Verificar configuración de Android
echo 🔍 Verificando configuración de Android...
flutter doctor --android-licenses
echo.

:: Opciones de build
echo ============================================
echo     🏗️ OPCIONES DE BUILD
echo ============================================
echo.
echo 1. 📱 APK Debug (para testing)
echo 2. 📱 APK Release (para producción)
echo 3. 📦 App Bundle (para Google Play)
echo 4. 🔍 Verificar problemas antes de build
echo 5. 📱 Listar dispositivos conectados
echo 6. ❌ Salir
echo.

set /p choice="Selecciona una opción (1-6): "

if "%choice%"=="1" goto build_debug
if "%choice%"=="2" goto build_release
if "%choice%"=="3" goto build_appbundle
if "%choice%"=="4" goto check_issues
if "%choice%"=="5" goto list_devices
if "%choice%"=="6" goto end

echo ❌ Opción inválida
goto end

:build_debug
echo.
echo 🔨 Creando APK Debug...
flutter build apk --debug
if %errorlevel% neq 0 (
    echo ❌ ERROR creando APK Debug
    pause
    exit /b 1
)
echo ✅ APK Debug creado exitosamente
echo 📂 Ubicación: build\app\outputs\flutter-apk\app-debug.apk
goto end

:build_release
echo.
echo 🔨 Creando APK Release...
:: Verificar keystore para firma
if not exist "android\app\key.jks" (
    echo ⚠️ No se encontró keystore para firma
    echo 🔑 Creando keystore de demo...
    call :create_keystore
)

flutter build apk --release
if %errorlevel% neq 0 (
    echo ❌ ERROR creando APK Release
    pause
    exit /b 1
)
echo ✅ APK Release creado exitosamente
echo 📂 Ubicación: build\app\outputs\flutter-apk\app-release.apk
echo 💡 NOTA: Este APK está firmado con keystore de demo
goto end

:build_appbundle
echo.
echo 🔨 Creando App Bundle (AAB)...
if not exist "android\app\key.jks" (
    echo ⚠️ No se encontró keystore para firma
    echo 🔑 Creando keystore de demo...
    call :create_keystore
)

flutter build appbundle --release
if %errorlevel% neq 0 (
    echo ❌ ERROR creando App Bundle
    pause
    exit /b 1
)
echo ✅ App Bundle creado exitosamente
echo 📂 Ubicación: build\app\outputs\bundle\release\app-release.aab
echo 💡 NOTA: Sube este archivo a Google Play Console
goto end

:check_issues
echo.
echo 🔍 Analizando código en busca de problemas...
flutter analyze
if %errorlevel% neq 0 (
    echo ⚠️ Se encontraron problemas, pero continuando...
)
echo ✅ Análisis completado
goto start_menu

:list_devices
echo.
echo 📱 Dispositivos Android disponibles:
flutter devices
echo.
echo 💡 Si no ves dispositivos, conecta un teléfono USB
echo    o inicia un emulador de Android Studio
goto start_menu

:create_keystore
echo 🔑 Creando keystore de demo...
keytool -genkey -v -keystore android\app\key.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias key -dname "CN=EntrenaTech Demo, OU=Demo, O=EntrenaTech, L=Mexico City, ST=MX, C=MX" -storepass entrenatech -keypass entrenatech
if %errorlevel% neq 0 (
    echo ❌ ERROR creando keystore
    pause
    exit /b 1
)

:: Actualizar key.properties para firma
echo 📝 Actualizando configuración de firma...
echo storePassword=entrenatech > android\key.properties
echo keyPassword=entrenatech >> android\key.properties
echo keyAlias=key >> android\key.properties
echo storeFile=key.jks >> android\key.properties

echo ✅ Keystore creado exitosamente
goto :eof

:start_menu
echo.
echo ============================================
echo     ¿DESEAS REALIZAR OTRA OPERACIÓN?
echo ============================================
echo.
echo 1. 📱 Build APK Debug
echo 2. 📱 Build APK Release
echo 3. 📦 Build App Bundle
echo 4. ❌ Salir
echo.

set /p choice2="Selecciona una opción (1-4): "

if "%choice2%"=="1" goto build_debug
if "%choice2%"=="2" goto build_release
if "%choice2%"=="3" goto build_appbundle
if "%choice2%"=="4" goto end

echo ❌ Opción inválida
goto end

:end
echo.
echo ============================================
echo     ✅ BUILD COMPLETADO
echo ============================================
echo.
echo 📱 App Flutter EntrenaTech lista para deployment
echo.
echo 📂 Ubicación de archivos generados:
echo    - APK Debug: build\app\outputs\flutter-apk\app-debug.apk
echo    - APK Release: build\app\outputs\flutter-apk\app-release.apk
echo    - App Bundle: build\app\outputs\bundle\release\app-release.aab
echo.
echo 💡 Próximos pasos:
echo    1. Instala APK Debug en un dispositivo para testing
echo    2. Sube App Bundle a Google Play Console
echo    3. Configura Firebase para notificaciones push
echo    4. Testea el flujo WiFi Mikrotik
echo.
echo 🚀 ¡Listo para escalar tu negocio de gimnasios!
echo.

:: Preguntar si quiere abrir la carpeta de builds
set /p open_folder="¿Deseas abrir la carpeta de builds? (s/n): "
if /i "%open_folder%"=="s" (
    explorer "build\app\outputs"
)

pause