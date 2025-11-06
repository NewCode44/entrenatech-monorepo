@echo off
echo 🎵 ENTRENATECH - CONFIGURACIÓN ANDROID STUDIO
echo ================================================
echo.
echo Este script te ayudará a descargar y configurar Android Studio
echo para generar la APK de la app EntrenaTech Member.
echo.
echo Presiona cualquier tecla para continuar o cierra esta ventana para cancelar...
pause > nul

echo.
echo 📥 Abriendo página de descarga de Android Studio...
echo Por favor, descarga la versión para Windows.
echo.

start https://developer.android.com/studio

echo.
echo ⚠️  IMPORTANTE: Después de descargar Android Studio:
echo.
echo 1. Instala Android Studio con las opciones por defecto
echo 2. Cuando te pida configurar el SDK, selecciona:
echo    - Android SDK (última versión)
echo    - Android Virtual Device
echo    - Performance (Intel® HAXM installer)
echo 3. Una vez instalado, ejecuta el script GENERATE_APK.bat
echo.

echo 📋 INSTRUCCIONES POST-INSTALACIÓN:
echo.
echo 1. Abre Android Studio
echo 2. File → Open
echo 3. Selecciona esta carpeta:
echo    C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android
echo 4. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo 5. ¡Tu APK estará lista en la carpeta app/build/outputs/apk/debug/!
echo.
echo.
echo ✅ Proceso completado. Ahora puedes cerrar esta ventana.
echo.
pause