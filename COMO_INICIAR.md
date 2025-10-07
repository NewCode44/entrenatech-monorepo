# 🏋️ EntrénaTech - Guía de Inicio Rápido

## 🚀 Formas de Iniciar las Aplicaciones

### Opción 1: Iniciar Todo Automáticamente (Recomendado)
Simplemente haz **doble clic** en:
```
iniciar-todo.bat
```
Esto iniciará:
- 📊 Dashboard en `http://localhost:5173`
- 💪 Portal de Miembros en `http://localhost:3002`
- 🌐 Abrirá el launcher HTML en tu navegador

### Opción 2: Iniciar Aplicaciones por Separado
**Para el Dashboard:**
```
doble clic en: iniciar-dashboard.bat
```

**Para el Portal de Miembros:**
```
doble clic en: iniciar-portal.bat
```

### Opción 3: Línea de Comandos (Avanzado)
Abre dos terminales en la carpeta del proyecto:

**Terminal 1 - Dashboard:**
```bash
npm run dev
```

**Terminal 2 - Portal de Miembros:**
```bash
npm run dev:portal
```

---

## 📱 Aplicaciones Disponibles

### 📊 Dashboard (Administradores/Entrenadores)
- **URL:** http://localhost:5173
- **Para:** Entrenadores, administradores del gimnasio
- **Funciones:**
  - Gestión de miembros
  - Crear y asignar rutinas
  - Administrar clases
  - Ver analíticas
  - Gestión de entrenadores
  - Editor de contenido del portal
  - Transmisión en vivo

### 💪 Portal de Miembros
- **URL:** http://localhost:3002
- **Para:** Miembros del gimnasio
- **Funciones:**
  - Ver rutinas asignadas
  - Seguimiento de progreso
  - Plan de nutrición con IA
  - Reservar clases
  - Tienda de productos
  - Reproductor de música durante entrenamientos
  - Generador de rutinas con IA

---

## 🔧 Cambios Recientes Completados

### ✅ Mejoras de UI/UX (Último commit)
Se corrigieron conflictos de z-index entre componentes:

1. **Modales de IA** (`AIRoutineGenerator` y `AINutritionistGenerator`)
   - z-index aumentado de `50` a `100`
   - Mejoras en scroll y responsividad
   - Layout optimizado con flexbox

2. **Reproductor de Música** (`MusicPlayer`)
   - z-index reducido de `30` a `20`
   - Eliminado z-index inline innecesario
   - Ahora se mantiene correctamente debajo de los modales

**Resultado:** Los modales de IA ahora siempre aparecen sobre el reproductor de música, evitando superposiciones visuales.

---

## 📦 Estructura del Proyecto

```
entrenatech dashboard/
├── apps/
│   ├── entrenatech-dashboard/    # Dashboard de administración
│   └── member-portal/             # Portal para miembros
├── libs/
│   └── ui/                        # Componentes compartidos
├── iniciar-todo.bat               # ⭐ Inicia ambas apps
├── iniciar-dashboard.bat          # Inicia solo dashboard
├── iniciar-portal.bat             # Inicia solo portal
├── launcher.html                  # 🌐 Página de acceso rápido
└── package.json                   # Configuración monorepo
```

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
- Node.js (v18 o superior)
- npm (viene con Node.js)

Si es la primera vez, ejecuta:
```bash
npm install
```

---

## 💡 Consejos

1. **Mantén las ventanas de terminal abiertas** mientras uses las aplicaciones
2. **No cierres las ventanas de cmd** que se abren automáticamente con los .bat
3. **Usa el launcher.html** para verificar el estado de los servidores
4. **Abre launcher.html directamente** si ya tienes los servidores corriendo

---

## 🐛 Solución de Problemas

### Los puertos están ocupados
Si ves error de puerto ocupado:
1. Cierra todas las ventanas de cmd/terminal abiertas
2. Reinicia los servidores

### Las dependencias no se encuentran
```bash
npm install
```

### Los cambios no se reflejan
- Presiona `Ctrl + R` para recargar el navegador
- Verifica que el servidor esté corriendo

---

## 📞 Soporte

Si necesitas ayuda:
1. Revisa este archivo
2. Verifica que los servidores estén corriendo
3. Revisa la consola del navegador (F12) para errores

---

¡Listo para entrenar! 💪🏋️‍♀️
