# EntrenaTech Flutter App

Aplicación móvil para miembros de EntrenaTech, construida con Flutter.

## Requisitos Previos

- [Flutter SDK](https://docs.flutter.dev/get-started/install) instalado y configurado.
- Un dispositivo conectado (Android/iOS) o un emulador habilitado.
- Para ejecutar en Windows, necesitas Visual Studio con las cargas de trabajo de C++.

## Cómo Ejecutar

1. **Abrir una terminal** en esta carpeta:
   ```bash
   cd entrenatech_flutter_app
   ```

2. **Obtener las dependencias**:
   ```bash
   flutter pub get
   ```

3. **Ejecutar la aplicación**:
   
   Para ejecutar en **Windows** (recomendado para desarrollo rápido):
   ```bash
   flutter run -d windows
   ```

   Para ejecutar en **Chrome**:
   ```bash
   flutter run -d chrome
   ```

   Para ejecutar en un **Emulador Android**:
   Asegúrate de tener un emulador corriendo y ejecuta:
   ```bash
   flutter run
   ```

## Estructura del Proyecto

- `lib/features`: Módulos principales (Auth, Home, WiFi, Profile).
- `lib/core`: Servicios y configuraciones globales.
- `lib/shared`: Widgets reutilizables.
