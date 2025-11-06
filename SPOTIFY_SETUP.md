# 🎵 Configuración de Spotify API para EntrenaTech

## 📋 **Requisitos Previos**

1. **Cuenta Spotify Premium** - El Web Playback SDK requiere cuenta Premium
2. **Cuenta Spotify Developer** - Gratis en https://developer.spotify.com/

---

## 🔧 **Pasos de Configuración**

### **1. Crear App en Spotify Developer Dashboard**

1. Ve a: https://developer.spotify.com/dashboard/
2. Haz clic en "Create an App"
3. Completa los datos:
   - **App name**: "EntrenaTech Fitness Platform"
   - **App description**: "Plataforma de gimnasios inteligentes con integración musical"
   - **Website**: "https://entrenapp-2025.web.app"
   - **Redirect URI**: "https://entrenapp-2025.web.app/member/spotify-callback"

4. Acepta los términos y crea la app

### **2. Obtener Credenciales**

Una vez creada la app, anota:
- **Client ID**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Client Secret**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### **3. Configurar Scopes (Permisos)**

En la configuración de tu app, agrega estos scopes:
```
user-read-private
user-read-email
user-read-playback-state
user-modify-playback-state
user-read-currently-playing
playlist-read-private
playlist-read-collaborative
streaming
```

### **4. Configurar la App en EntrenaTech**

Edita el archivo `apps/member-portal/components/SpotifyAuth.tsx`:

```typescript
// Reemplaza esta línea con tu Client ID real
const CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // ← CAMBIA ESTO
```

### **5. Deploy Actualizado**

El sistema ya está configurado con:
- ✅ **Autenticación OAuth 2.0**
- ✅ **Web Playback SDK integrado**
- ✅ **Control completo del reproductor**
- ✅ **Playlists personalizadas**
- ✅ **Sincronización en tiempo real**

---

## 🚀 **Funcionalidades Implementadas**

### **🎧 Control de Música Real**
- Play/Pause con Spotify
- Siguiente/Anterior track
- Control de volumen
- Seek (moverse en la canción)
- Shuffle y Repeat

### **📱 Integración Completa**
- Album art dinámico
- Información de track en tiempo real
- Progreso de reproducción
- Estado de conexión
- Autenticación persistente

### **🏋️‍♂️ Características Fitness**
- Conexión automática al entrenamiento
- Playlists de entrenamiento sugeridas
- Música adaptada a la intensidad
- Control sin salir de la app

---

## 🌐 **URLs Importantes**

### **Producción**
- **App Principal**: https://entrenapp-2025.web.app/member
- **API Functions**: https://us-central1-entrenapp-2025.cloudfunctions.net/api
- **Callback URL**: https://entrenapp-2025.web.app/member/spotify-callback

### **Development**
- **Local**: http://localhost:5173/member
- **Callback Local**: http://localhost:5173/member/spotify-callback

---

## 🔐 **Seguridad**

- **OAuth 2.0** con state verification
- **Tokens almacenados** en localStorage (encrypted)
- **Scopes mínimos** necesarios
- **Redirect URI validado**

---

## 💡 **Notas Importantes**

1. **Cuenta Premium Requerida**: El Web Playback SDK solo funciona con Spotify Premium
2. **Dominios**: Asegúrate de configurar los dominios correctos en Spotify Developer Console
3. **CORS**: Las APIs ya están configuradas para el dominio de producción
4. **Rate Limits**: Spotify tiene límites de uso - implementamos caché local

---

## 🎯 **Testing**

1. **Test Local**: Ejecuta `npm run dev` y prueba en http://localhost:5173/member
2. **Test Production**: Ve a https://entrenapp-2025.web.app/member
3. **Autenticación**: Haz clic en "Conectar Cuenta" y sigue el flujo OAuth
4. **Control**: Prueba play/pause, siguiente, volumen, etc.

---

## 🔄 **Flujo de Autenticación**

1. **Usuario** hace clic en "Conectar Spotify"
2. **Popup** abre auth de Spotify
3. **Usuario** autoriza el acceso
4. **Callback** procesa el token
5. **Player** se inicializa automáticamente
6. **Control** completo disponible

---

## 🛠️ **Troubleshooting**

### **Error: "No hay token de acceso"**
- Verifica tu Client ID en el código
- Asegúrate que la Redirect URI coincida
- Revisa que tu app esté aprobada en Spotify

### **Error: "Premium required"**
- El Web Playback SDK requiere Spotify Premium
- Ofrece enlace para upgrade en el modal

### **Error: "Initialization failed"**
- Revisa conexión a internet
- Verifica que Spotify esté disponible
- Intenta refrescar la página

---

## ✅ **Estado Actual**

- **Spotify Web SDK**: ✅ Integrado
- **OAuth 2.0**: ✅ Implementado
- **Player Controls**: ✅ Funcionales
- **Real-time Sync**: ✅ Activo
- **PWA Compatible**: ✅ Optimizado
- **Production Ready**: ✅ Desplegado

**🎉 La integración musical está lista para uso en producción!**