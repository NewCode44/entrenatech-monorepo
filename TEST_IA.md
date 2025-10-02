# 🔍 TEST DE IA - Diagnóstico

## ✅ Paso 1: Verifica que el servidor está corriendo

Abre tu navegador en: **http://localhost:3001/**

Si ves el dashboard de Entrenatech, continúa al siguiente paso.

---

## ✅ Paso 2: Abre la Consola del Navegador

1. Presiona **F12** en tu navegador
2. Ve a la pestaña **Console**
3. Mira si hay errores en ROJO

**Si ves errores, cópialos y pásamelos.**

---

## ✅ Paso 3: Busca el Chat IA Flotante

### 🔎 **¿Dónde debería estar?**
- **Esquina inferior DERECHA** de la pantalla
- **Botón circular morado/azul** con ícono de mensaje
- **SIEMPRE visible** en todas las páginas

### 🎯 **Cómo identificarlo:**
- Tiene un badge pequeño que dice "IA"
- Tiene animación de pulso
- Se ve algo así:
```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│                      ● │ ← Este botón (esquina inferior derecha)
└─────────────────────────┘
```

### ❌ **Si NO lo ves:**
- Scroll hasta abajo de la página
- Mira si hay ALGÚN botón flotante
- Toma screenshot y pásamelo

---

## ✅ Paso 4: Ve a la página de Analytics

1. Click en **"Analíticas"** en el menú lateral izquierdo
2. Espera que cargue

### 🔎 **¿Qué deberías ver?**

Después del header principal, ANTES de los gráficos normales, deberías ver:

#### A. **Card "Health Score IA"**
- Fondo con gradiente morado-azul
- Ícono de cerebro 🧠
- Calificación grande (A, B, C, etc.)
- 4 barras de progreso horizontales

#### B. **Sección "Insights Predictivos IA"**
- Título con ícono ✨
- Botón "Actualizar" a la derecha
- Grid de 6 tarjetas de colores:
  - Verdes = Oportunidades
  - Amarillas = Warnings
  - Azules = Info

#### C. **Card "Predicción de Churn (IA)"**
- Ícono de advertencia ⚠️ rojo
- Lista de 3 miembros con porcentajes de riesgo
- Cada uno con "Razones" y "Acciones sugeridas"

### ❌ **Si NO ves NADA de esto:**
La página se ve igual que antes, solo con los gráficos normales.

---

## ✅ Paso 5: Ve a Members (Miembros)

1. Click en **"Miembros"** en el menú lateral
2. Busca en el header superior (donde dice "Gestión de Miembros")

### 🔎 **¿Qué deberías ver?**
- Dos botones en la esquina superior derecha:
  - **Botón VERDE**: "Plan Nutricional IA" 🍎
  - **Botón AZUL**: "Añadir Miembro"

### ❌ **Si solo ves el botón azul:**
No se agregó el botón de nutrición.

---

## ✅ Paso 6: Ve a Dashboard

1. Click en **"Dashboard"** (primera opción del menú)
2. Scroll un poco hacia abajo

### 🔎 **¿Qué deberías ver?**
Después del header, antes de las estadísticas, debería haber:
- **Botón morado-rosado** que dice "Mostrar Gamificación" 🏆

### ❌ **Si NO lo ves:**
La gamificación no se agregó.

---

## ✅ Paso 7: Ve a Rutinas → Crear Rutina

1. Click en **"Rutinas"**
2. Click en **"Crear Nueva Rutina"**
3. Deberías estar en Step 1 (Información Principal)

### 🔎 **¿Qué deberías ver?**
En la **columna DERECHA**, después de la configuración (Nivel de Dificultad, Duración), debería haber:

**Card "Generador con IA":**
- Fondo con gradiente morado-azul brillante
- Ícono de cerebro 🧠
- Texto: "Deja que la IA genere automáticamente..."
- Botón grande: "Generar con IA" ✨

### ❌ **Si en vez de eso ves:**
Una card que dice "Sugerencias IA" con texto estático, entonces NO se aplicó el cambio.

---

## 📊 RESULTADOS

### ✅ TODO FUNCIONA si ves:
- [ ] Chat flotante en esquina inferior derecha
- [ ] Analytics: Health Score + Insights + Churn
- [ ] Members: Botón verde "Plan Nutricional IA"
- [ ] Dashboard: Botón "Mostrar Gamificación"
- [ ] Rutinas: Card "Generador con IA" con botón

### ❌ NADA FUNCIONA si:
- [ ] No hay chat flotante
- [ ] Analytics se ve igual que antes
- [ ] Members solo tiene botón azul
- [ ] Dashboard no tiene botón de gamificación
- [ ] Rutinas tiene card estática de sugerencias

---

## 🐛 Debugging

### Si NADA se ve, verifica:

1. **¿Hiciste hard refresh?**
   - Presiona **Ctrl + Shift + R**
   - O **Ctrl + F5**

2. **¿Estás en el puerto correcto?**
   - Debe ser: http://localhost:3001/
   - NO: http://localhost:3000/

3. **¿Limpiaste caché?**
   - Abre en **modo incógnito** (Ctrl + Shift + N)
   - Prueba de nuevo

4. **¿Hay errores en la consola?**
   - F12 → Console
   - Copia TODOS los errores en rojo
   - Pásamelos

---

## 📞 Si sigues sin ver nada

**Dime específicamente qué VES en cada página:**
1. Dashboard → ¿Qué botones hay después del header?
2. Analytics → ¿Qué hay ANTES de los gráficos?
3. Members → ¿Qué botones hay arriba a la derecha?
4. Rutinas → Crear Nueva → ¿Qué hay en columna derecha?
5. Esquina inferior derecha → ¿Hay ALGÚN botón flotante?

**Y pásame:**
- Screenshot de la página completa
- Errores de la consola (F12)