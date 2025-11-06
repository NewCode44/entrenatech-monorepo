# 🎵 Guía para Generar APK de EntrenaTech Member

## 📱 **PROYECTO ANDROID CONFIGURADO**

✅ **Capacitor instalado y configurado**
✅ **Plataforma Android añadida**
✅ **Permisos de Spotify y audio configurados**
✅ **Optimizaciones para app de música**
✅ **Build sincronizado con proyecto web**

## 🛠️ **REQUISITOS PREVIOS**

### Opción 1: Usando Android Studio (Recomendado)
1. **Android Studio** (última versión)
   - Descargar desde: https://developer.android.com/studio
   - Incluye Java JDK automáticamente

### Opción 2: Línea de comandos
1. **Java JDK 17+**
2. **Android SDK**
3. **Gradle** (incluido en el proyecto)

## 🚀 **MÉTODO 1: ANDROID STUDIO (RECOMENDADO)**

### Paso 1: Abrir el proyecto
```bash
# Navegar al directorio del proyecto Android
cd "C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android"

# Abrir con Android Studio
# O desde Android Studio: File → Open → Seleccionar la carpeta "android"
```

### Paso 2: Configurar el proyecto
1. Android Studio detectará automáticamente el proyecto Gradle
2. Espera a que descargue las dependencias (puede tomar varios minutos)
3. Asegúrate de que el SDK de Android esté actualizado

### Paso 3: Generar APK Debug
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera a que termine el build
3. La APK aparecerá en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Paso 4: Generar APK Release (para distribución)
1. **Build → Generate Signed Bundle / APK**
2. Seleccionar **APK**
3. **Create new...** para generar un keystore:
   ```
   Key store path: entrenatech-member.jks
   Password: [tu contraseña]
   Alias: entrenatech
   Key Password: [tu contraseña]
   Validity: 25 años
   First and Last Name: EntrenaTech
   Organizational Unit: Development
   Organization: EntrenaTech
   City: [tu ciudad]
   State: [tu estado]
   Country Code: US
   ```
4. **Next → Finish**
5. La APK Release aparecerá en: `android/app/build/outputs/apk/release/app-release.apk`

## 📋 **MÉTODO 2: LÍNEA DE COMANDOS**

### Si tienes Android Studio instalado:
```bash
# Configurar JAVA_HOME (ajusta la ruta según tu instalación)
set JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"

# Navegar al directorio del proyecto
cd "C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android"

# Generar APK Debug
./gradlew assembleDebug

# Generar APK Release
./gradlew assembleRelease
```

### Ubicación de las APKs generadas:
- **Debug**: `app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `app/build/outputs/apk/release/app-release.apk`

## ⚙️ **CONFIGURACIONES ESPECIALES INCLUIDAS**

### ✅ Permisos configurados:
- ✅ INTERNET (Spotify Web SDK)
- ✅ ACCESS_NETWORK_STATE
- ✅ MODIFY_AUDIO_SETTINGS (controles de música)
- ✅ WAKE_LOCK (reproducción en background)
- ✅ FOREGROUND_SERVICE (servicios en primer plano)
- ✅ BLUETOOTH (Spotify Connect)
- ✅ READ/WRITE_EXTERNAL_STORAGE (caching)
- ✅ POST_NOTIFICATIONS (notificaciones)
- ✅ REQUEST_IGNORE_BATTERY_OPTIMIZATIONS

### ✅ Optimizaciones:
- **minSdkVersion**: 21 (Android 5.0+)
- **targetSdkVersion**: 34 (Android 14)
- **multiDexEnabled**: true
- **WebView mejorado**
- **Media support**
- **Debugging habilitado**

### ✅ Características de Capacitor:
- **HTTPS scheme** para Spotify
- **Mixed content** permitido
- **Fullscreen support**
- **StatusBar oscura**
- **Splash screen personalizado**

## 📱 **INSTALACIÓN DE LA APK**

### Para probar la APK Debug:
1. Transfiere el archivo `app-debug.apk` a tu dispositivo Android
2. Habilita "Fuentes desconocidas" en Ajustes → Seguridad
3. Instala la APK

### Para distribución:
1. Usa la APK `app-release.apk`
2. Está lista para subir a Google Play Store

## 🎯 **CARACTERÍSTICAS DE LA APP**

- **Nombre**: EntrenaTech Member
- **Package**: com.entrenatech.member
- **Versión**: 1.0.0
- **URL de producción**: https://entrenapp-2025.web.app/member
- **Tema**: Oscuro tipo Spotify
- **Música**: Integración completa con Spotify Premium

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### Gradle sync falla:
- Revisa la conexión a internet
- Actualiza Android SDK en Android Studio

### Build falla:
- Limpia el proyecto: `./gradlew clean`
- Rebuild: `./gradlew build`

### Spotify no funciona:
- Verifica que la URL sea: `https://entrenapp-2025.web.app/member`
- Requiere Spotify Premium

## ✨ **RESULTADO FINAL**

Obtendrás una aplicación Android nativa con:
- Interfaz tipo Spotify con visualizer
- Controles completos de reproducción
- Búsqueda de canciones y playlists
- Modo fullscreen inmersivo
- Sistema de cola de reproducción
- Integración completa con Spotify Premium

¡Listo para que los clientes del gym disfruten de música profesional durante sus entrenamientos! 🎶💪