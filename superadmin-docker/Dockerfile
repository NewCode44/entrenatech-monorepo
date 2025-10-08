# Construir la imagen del SuperAdmin Dashboard
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY apps/superadmin-dashboard/package*.json ./apps/superadmin-dashboard/

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
WORKDIR /app/apps/superadmin-dashboard
RUN npm run build

# Imagen de producción
FROM nginx:alpine

# Copiar el build de la aplicación
COPY --from=builder /app/apps/superadmin-dashboard/dist /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY nginx-superadmin.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]