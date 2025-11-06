# 🎵 GUÍA PASO A PASO - GENERAR APK DE ENTRENATECH

## 📋 **REQUISITOS - INSTALA PRIMERO**

### ✅ **Opción 1: Android Studio (Recomendado)**
1. **Descargar Android Studio**:
   - Ir a: https://developer.android.com/studio
   - Descargar la versión para Windows
   - Instalar con las opciones por defecto

2. **Verificar instalación**:
   - Abre Android Studio
   - Asegúrate de que no aparezcan errores

### ✅ **Opción 2: JDK + Android SDK Manual**
1. **Descargar JDK 17+**:
   - Ir a: https://adoptium.net/
   - Descargar Temurin JDK 17 (LTS)
   - Instalar en: `C:\Program Files\Eclipse Adoptium\`

2. **Descargar Android SDK**:
   - Ir a: https://developer.android.com/studio/releases
   - Descargar "Command line tools only"
   - Extraer en: `C:\Android\SDK\`

## 🚀 **PASO A PASO PARA GENERAR LA APK**

### **PASO 1: ABRIR ANDROID STUDIO**
- Ejecutar Android Studio desde el menú de Windows
- Esperar a que cargue completamente

### **PASO 2: ABRIR EL PROYECTO**
1. Click en **File → Open**
2. Navegar a esta ruta exacta:
   ```
   C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android
   ```
3. Seleccionar la carpeta **android** y click en **OK**

### **PASO 3: ESPERAR CONFIGURACIÓN**
- Android Studio detectará automáticamente el proyecto Gradle
- Espera a que descargue todas las dependencias (puede tardar 5-10 minutos)
- No interrumpas el proceso

### **PASO 4: VERIFICAR CONFIGURACIÓN**
- Asegúrate de que en la parte inferior aparezca: "Gradle sync finished"
- No debería haber errores en rojo

### **PASO 5: GENERAR APK DEBUG**
1. En el menú superior: **Build → Build Bundle(s) / APK(s)**
2. Seleccionar **Build APK(s)**
3. Esperar a que termine el proceso (1-3 minutos)

### **PASO 6: UBICAR LA APK**
La APK generada estará en:
```
C:\Users\Ramiro\Desktop\modulos de servicios tu portal te conecta\entrenatech\entrenatech dashboard\apps\member-portal\android\app\build\outputs\apk\debug\app-debug.apk
```

### **PASO 7: OPCIONAL - APK PARA DISTRIBUCIÓN**
1. **Build → Generate Signed Bundle / APK**
2. Seleccionar **APK**
3. **Create new...** para generar keystore:
   ```
   Key store path: entrenatech-member.jks
   Password: [crear una contraseña segura]
   Alias: entrenatech
   Key Password: [misma contraseña]
   Validity: 25 años
   ```
4. Completar los datos del certificado y continuar

## 📱 **INSTALACIÓN DE LA APK**

### **En dispositivo Android:**
1. Transfiere el archivo `app-debug.apk` al dispositivo
2. Habilita "Fuentes desconocidas":
   - Ajustes → Seguridad → Permitir instalación de apps desconocidas
3. Instala la APK

### **Verificar la app:**
1. Abre la app "EntrenaTech Member"
2. Debería cargar la URL: `https://entrenapp-2025.web.app/member`
3. Conecta tu cuenta de Spotify Premium
4. ¡Disfruta del reproductor profesional!

## 🎯 **CARACTERÍSTICAS DE LA APP FINAL**

### ✅ **Funcionalidades Completas:**
- **Reproductor tipo Spotify** con visualizer animado
- **3 modos de visualización**: Minimizado, Normal, Fullscreen
- **Integración completa** con Spotify Premium
- **Búsqueda avanzada** de canciones y artistas
- **Sistema de cola** con gestión completa
- **Controles profesionales**: Repeat, Shuffle, Like, etc.
- **Interfaz oscura** tipo Spotify con acentos verdes

### 📱 **Especificaciones Técnicas:**
- **Nombre**: EntrenaTech Member
- **Package**: com.entrenatech.member
- **Versión**: 1.0.0
- **URL**: https://entrenapp-2025.web.app/member
- **PWA nativa** con Capacitor
- **Android 5.0+ compatible** (minSdkVersion 21)

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Gradle sync falla:**
- Revisa tu conexión a internet
- En Android Studio: File → Invalidate Caches / Restart
- Asegúrate de tener suficiente espacio en disco

### **Build falla:**
- Build → Clean Project
- Vuelve a intentar Build → Build APK(s)

### **La app no carga la URL:**
- Verifica que tengas conexión a internet
- Intenta recargar la app (deslizar hacia abajo)
- Revisa que la URL `https://entrenapp-2025.web.app/member` esté activa

### **Spotify no funciona:**
- Se requiere cuenta Spotify Premium
- Verifica que tengas conexión estable a internet
- Intenta reconectar tu cuenta en la app

## ✨ **RESULTADO FINAL**

¡Felicidades! Ahora tienes una aplicación Android nativa de EntrenaTech con:
- 🎵 **Reproductor profesional tipo Spotify**
- 🎧 **Integración completa con Spotify Premium**
- 📱 **Experiencia nativa optimizada**
- 🎯 **Funcionalidades completas de música**
- 💪 **Perfecta para entrenamientos de gym**

**La APK está lista para distribuirla entre tus clientes del gym!** 🎶💪✨

---

**Nota**: Si tienes problemas durante el proceso, no dudes en consultar la guía completa `APK_BUILD_GUIDE.md` para más detalles técnicos.