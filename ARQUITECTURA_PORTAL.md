# 🏗️ ARQUITECTURA: Dashboard vs Portal de Miembros

## 📊 SEPARACIÓN DE RESPONSABILIDADES

### **Dashboard Admin (Puerto 3005)**
🎯 **Para:** Dueño del gimnasio, entrenadores, administradores

**Funcionalidades:**
- ✅ Gestión de miembros (crear, editar, suspender)
- ✅ Gestión de entrenadores
- ✅ Creación y asignación de rutinas
- ✅ Creación de planes nutricionales
- ✅ Analytics del negocio (métricas, ingresos, churn)
- ✅ Editor de portal cautivo (personalización visual)
- ✅ Gestión de clases grupales
- ✅ Facturación y pagos
- ✅ Configuración del gimnasio

**Acceso:**
```bash
npm run dev
# Abre: http://localhost:3005/
```

---

### **Portal de Miembros (Puerto 3006)** 💪
🎯 **Para:** Clientes/miembros del gimnasio

**Funcionalidades:**
- ✅ **Inicio:** Dashboard personal con stats y accesos rápidos
- ✅ **Mi Progreso:**
  - Sistema de gamificación (nivel, puntos, logros)
  - Seguimiento de peso y medidas
  - Récords personales
  - Leaderboard
- ✅ **Mis Rutinas:**
  - Ver rutinas asignadas por el entrenador
  - Workout del día
  - Historial de entrenamientos
  - Marcar ejercicios como completados
- ✅ **Nutrición:**
  - Plan nutricional personalizado
  - Macros diarios
  - Lista de compras
  - Seguimiento de hidratación
- ✅ **Clases:**
  - Horario semanal de clases grupales
  - Reservar/cancelar clases
  - Ver clases reservadas
- ✅ **Chat IA:** Asistente personal disponible en todas las páginas

**Acceso:**
```bash
npm run dev:portal
# Abre: http://localhost:3006/
```

**Características PWA:**
- 📱 Instalable como app móvil
- 🔄 Funciona offline
- 🔔 Notificaciones push
- 📲 Optimizado para pantalla táctil

---

## 🔄 FLUJO DE DATOS

```
┌─────────────────────────────────────────┐
│         DASHBOARD ADMIN                 │
│                                         │
│  Entrenador crea rutina                │
│  Nutriólogo crea plan                  │
│  Admin gestiona miembros               │
└──────────────┬──────────────────────────┘
               │
               │ API / Backend
               │
               ▼
┌─────────────────────────────────────────┐
│      BASE DE DATOS (Futuro)             │
│                                         │
│  Rutinas, Planes, Miembros, Analytics  │
└──────────────┬──────────────────────────┘
               │
               │ API / Backend
               │
               ▼
┌─────────────────────────────────────────┐
│       PORTAL DE MIEMBROS                │
│                                         │
│  Miembro ve su rutina                  │
│  Miembro sigue su plan                 │
│  Miembro reserva clases                │
└─────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
entrenatech/
├── apps/
│   ├── entrenatech-dashboard/    # 🎛️ Dashboard Admin
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Members.tsx
│   │   │   ├── Trainers.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Routines.tsx
│   │   │   └── RoutineCreator.tsx
│   │   ├── components/
│   │   ├── services/ai/
│   │   │   ├── routineGenerator.ts
│   │   │   └── predictiveAnalytics.ts
│   │   └── App.tsx
│   │
│   └── member-portal/             # 💪 Portal de Miembros (PWA)
│       ├── pages/
│       │   ├── HomePage.tsx       # Inicio
│       │   ├── ProgressPage.tsx   # Gamificación y progreso
│       │   ├── RoutinesPage.tsx   # Mis rutinas
│       │   ├── NutritionPage.tsx  # Mi nutrición
│       │   └── ClassesPage.tsx    # Clases grupales
│       ├── components/
│       │   ├── member/
│       │   │   └── MemberLayout.tsx
│       │   └── AIChatWidget.tsx
│       ├── services/ai/
│       │   ├── gamificationAI.ts
│       │   └── nutritionAI.ts
│       ├── vite.config.ts         # Configuración PWA
│       └── App.tsx
│
└── package.json
```

---

## 🚀 VENTAJAS DE ESTA ARQUITECTURA

### 1. **Separación de Concerns**
- Dashboard: Complejidad de gestión administrativa
- Portal: UX simple y enfocada en el usuario final

### 2. **Performance**
- Cada app tiene su bundle separado
- Portal de miembros es más liviano (no carga código admin)
- PWA permite caching y offline

### 3. **Escalabilidad**
- Puedes desplegar cada app en dominios diferentes:
  - `admin.entrenatech.com` → Dashboard
  - `app.entrenatech.com` → Portal de miembros

### 4. **Seguridad**
- Autenticación separada por rol
- Admin no expone endpoints de gestión al cliente
- Portal de miembros solo accede a SUS datos

### 5. **UX Optimizada**
- Dashboard: Desktop-first, teclado + mouse
- Portal: Mobile-first, táctil, gestos

---

## 🎨 FEATURES DE IA POR APP

### Dashboard Admin
- ✅ Analytics Predictivos (churn, insights)
- ✅ Generador de Rutinas con IA
- ❌ NO tiene gamificación visible
- ❌ NO tiene chat IA (no necesario)

### Portal de Miembros
- ✅ Gamificación completa (logros, desafíos, ranking)
- ✅ Chat IA personal
- ✅ Recomendaciones nutricionales personalizadas
- ✅ Seguimiento de progreso con IA
- ❌ NO puede crear rutinas (solo verlas)
- ❌ NO ve analytics del negocio

---

## 🔐 AUTENTICACIÓN (Próximo paso)

### Dashboard
```typescript
// Login admin/entrenador
{
  email: "admin@entrenatech.com",
  password: "****",
  role: "admin" | "trainer"
}
```

### Portal de Miembros
```typescript
// Login miembro
{
  email: "juan@gmail.com",
  password: "****",
  memberId: "123456"
}
```

---

## 📱 INSTALACIÓN COMO PWA

El portal de miembros puede instalarse como app móvil:

1. Abre `http://localhost:3006/` en Chrome móvil
2. Click en "Agregar a pantalla de inicio"
3. Ahora funciona como app nativa:
   - Ícono en home screen
   - Funciona offline
   - Notificaciones push

---

## 🚀 COMANDOS ÚTILES

```bash
# Dashboard Admin
npm run dev                    # Correr dashboard
npm run build                  # Build dashboard

# Portal de Miembros
npm run dev:portal             # Correr portal
npm run build:portal           # Build portal

# Instalar dependencias
npm install --legacy-peer-deps
```

---

## 🎯 PRÓXIMOS PASOS

### Corto Plazo
1. ⬜ Implementar autenticación real
2. ⬜ Conectar backend/API
3. ⬜ Agregar notificaciones push
4. ⬜ Implementar check-in con QR

### Mediano Plazo
1. ⬜ Computer Vision para análisis de forma
2. ⬜ Facial Recognition para check-in
3. ⬜ Integración con wearables (Apple Watch, Fitbit)
4. ⬜ Sistema de pagos

---

## 📊 PUERTOS UTILIZADOS

| Aplicación | Puerto | URL |
|------------|--------|-----|
| Dashboard Admin | 3005 | http://localhost:3005/ |
| Portal de Miembros | 3006 | http://localhost:3006/ |

---

**¡Ahora tienes 2 apps completamente funcionales!** 🎉

- **Dashboard:** Para gestionar tu negocio
- **Portal:** Para que tus clientes entrenen con IA