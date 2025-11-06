# 🚀 Guía de Despliegue - EntrenaTech Platform

## 📋 Requisitos Previos

1. **Firebase CLI instalado:**
```bash
npm install -g firebase-tools
```

2. **Iniciar sesión en Firebase:**
```bash
firebase login
```

## 🚀 Comandos de Despliegue

### 1. Desplegar Functions (WiFi Portal)
```bash
firebase deploy --only functions
```

### 2. Desplegar Hosting
```bash
firebase deploy --only hosting
```

### 3. Desplegar Todo
```bash
firebase deploy
```

## 📶 URLs de Producción

### Portal WiFi
- **URL:** https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal
- **Ejemplo:** https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal?mac=DE:MO:MA:CA:DD:RE&ip=192.168.1.100

### App Principal
- **URL:** https://entrenapp-2025.web.app

## 🎯 Testing del Portal WiFi

### 1. URL Directa
```
https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal?mac=DE:MO:MA:CA:DD:RE&ip=192.168.1.100
```

### 2. Con Branding
```
https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal?gym=powergym&mac=DE:MO:MA:CA:DD:RE&ip=192.168.1.100
```

## 📱 Credenciales de Demo
- **Email:** test@demo.com
- **Password:** password123

## 🎉 ¡Listo para Producción!

Una vez desplegado, el sistema estará disponible en:
- **App:** https://entrenapp-2025.web.app
- **Portal WiFi:** https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal

