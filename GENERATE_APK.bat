@echo off
echo 🎵 ENTRENATECH - GENERADOR DE APK
echo ================================
echo.
echo Este script automatiza la generación de la APK de EntrenaTech Member.
echo Asegúrate de tener Android Studio instalado antes de continuar.
echo.

:: Verificar si Android Studio está instalado
set "AS_PATH=C:\Program Files\Android\Android Studio"
if not exist "%AS_PATH%" (
    set "AS_PATH=C:\Program Files (x86)\Android\Android Studio"
    if not exist "%AS_PATH%" (
        echo ❌ ERROR: No se encuentra Android Studio instalado.
        echo.
        echo Por favor, ejecuta primero SETUP_ANDROID_STUDIO.bat
        echo para descargar e instalar Android Studio.
        echo.
        pause
        exit /b 1
    )
)

echo ✅ Android Studio encontrado en: %AS_PATH%
echo.

:: Verificar si el proyecto Android existe
set "PROJECT_PATH=C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android"
if not exist "%PROJECT_PATH%" (
    echo ❌ ERROR: No se encuentra el proyecto Android.
    echo.
    echo El proyecto debería estar en:
    echo %PROJECT_PATH%
    echo.
    pause
    exit /b 1
)

echo ✅ Proyecto Android encontrado
echo.

:: Intentar encontrar Gradlew
set "GRADLEW=%PROJECT_PATH%\gradlew.bat"
if exist "%GRADLEW%" (
    echo ✅ Gradle wrapper encontrado
    echo.

    echo 🔄 Generando APK con Gradle...
    echo Esto puede tardar varios minutos...
    echo.

    cd /d "%PROJECT_PATH%"

    echo Ejecutando: gradlew assembleDebug
    call gradlew assembleDebug

    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ APK generada exitosamente!
        echo.
        echo 📱 Ubicación de la APK:
        echo %PROJECT_PATH%\app\build\outputs\apk\debug\app-debug.apk
        echo.
        echo 📂 Abriendo la carpeta de salida...
        explorer "%PROJECT_PATH%\app\build\outputs\apk\debug\"

        echo.
        echo 🎯 LISTO PARA INSTALAR!
        echo Transfiere el archivo app-debug.apk a tu dispositivo Android
        echo y sigue las instrucciones en GENERATE_APK_STEP_BY_STEP.md
        echo.
    ) else (
        echo.
        echo ❌ ERROR: Falló la generación de la APK
        echo Revisa los mensajes de error arriba.
        echo.
    )

) else (
    echo ❌ ERROR: No se encuentra gradlew.bat
    echo.
    echo El proyecto Android puede estar corrupto.
    echo Considera regenerar el proyecto con Capacitor.
    echo.
)

echo.
echo 🏁 Proceso completado.
pause