#!/bin/bash

# Script para aplicar configuración corregida de Nginx y reconstruir aplicaciones

echo "🔧 Aplicando configuración corregida de Nginx..."

# Copiar configuración corregida
sudo cp /var/www/entrenatech-monorepo/nginx-fixed.conf /etc/nginx/sites-available/entrenatech-platform

# Crear enlace simbólico si no existe
if [ ! -f /etc/nginx/sites-enabled/entrenatech-platform ]; then
    sudo ln -s /etc/nginx/sites-available/entrenatech-platform /etc/nginx/sites-enabled/
fi

# Eliminar configuración por defecto si existe
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración de Nginx
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuración de Nginx válida"

    # Reiniciar Nginx
    sudo systemctl restart nginx

    echo "🔄 Reconstruyendo aplicaciones con configuraciones corregidas..."

    # Cambiar al directorio del proyecto
    cd /var/www/entrenatech-monorepo

    # Limpiar builds anteriores
    rm -rf apps/*/dist

    # Reconstruir todas las aplicaciones
    npm run build:login
    npm run build
    npm run build:superadmin
    npm run build:portal

    # Fix permissions
    sudo chown -R www-data:www-data /var/www/entrenatech-monorepo
    sudo chmod -R 755 /var/www/entrenatech-monorepo/apps/*/dist

    echo "✅ Aplicaciones reconstruidas correctamente"
    echo "🌐 URLs de acceso:"
    echo "   - Login Principal: http://5.161.196.136"
    echo "   - SuperAdmin: http://5.161.196.136/admin/"
    echo "   - Dashboard: http://5.161.196.136/dashboard/"
    echo "   - Portal: http://5.161.196.136/portal/"

else
    echo "❌ Error en configuración de Nginx"
    exit 1
fi