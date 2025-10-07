#!/bin/bash

# Script de configuración SSH para despliegue con GitHub Actions
# Este script te ayudará a configurar la autenticación por clave SSH

echo "🔑 Configurando autenticación SSH para GitHub Actions..."
echo ""

# Datos del VPS
VPS_IP="5.161.196.136"
VPS_USER="root"
VPS_PORT="22"

echo "Datos del VPS:"
echo "IP: $VPS_IP"
echo "Usuario: $VPS_USER"
echo "Puerto: $VPS_PORT"
echo ""

# Clave pública para agregar a authorized_keys
PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJyJdmXgFaU9PG2m3MuABWQcaUJy81jOYeX/sz3HAMDe GitHub Actions"

echo "📋 Clave pública para agregar:"
echo "$PUBLIC_KEY"
echo ""

echo "🔧 Instrucciones para configurar autenticación SSH:"
echo ""
echo "Como no tienes contraseña para el VPS, tienes dos opciones:"
echo ""
echo "Opción 1: Si tienes acceso SSH por otros medios (como agente SSH u otra clave):"
echo "  ssh root@$VPS_IP 'echo \"$PUBLIC_KEY\" >> ~/.ssh/authorized_keys'"
echo ""
echo "Opción 2: Si puedes acceder a la consola del VPS directamente (vía panel del proveedor):"
echo "  1. Entra a la consola de tu VPS"
echo "  2. Ejecuta estos comandos:"
echo "     mkdir -p ~/.ssh"
echo "     chmod 700 ~/.ssh"
echo "     echo \"$PUBLIC_KEY\" >> ~/.ssh/authorized_keys"
echo "     chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "Opción 3: Si tienes acceso temporal con contraseña:"
echo "  ssh-copy-id -i ~/.ssh/id_ed25519.pub root@$VPS_IP"
echo ""

echo "✅ Después de agregar la clave pública a tu VPS:"
echo "1. Ve a tu repositorio de GitHub"
echo "2. Settings > Secrets and variables > Actions"
echo "3. Agrega nuevo secreto llamado 'SSH_KEY'"
echo "4. Pega la clave PRIVADA (no la pública)"
echo "5. Asegúrate de que todos los secretos estén configurados:"
echo "   - HOST: 5.161.196.136"
echo "   - USERNAME: root"
echo "   - SSH_KEY: (contenido de la clave privada)"
echo "   - PORT: 22"
echo ""

echo "🚀 ¡Entonces puedes probar el despliegue subiendo a la rama main!"
echo ""

# Función para probar conexión SSH
test_ssh_connection() {
    echo "🔍 Probando conexión SSH..."
    if ssh -o ConnectTimeout=10 -o BatchMode=yes root@$VPS_IP "echo 'Conexión SSH exitosa'" 2>/dev/null; then
        echo "✅ ¡Prueba de conexión SSH exitosa!"
        return 0
    else
        echo "❌ La prueba de conexión SSH falló. Por favor completa la configuración anterior."
        return 1
    fi
}

# Descomenta la siguiente línea para probar conexión SSH después de la configuración
# test_ssh_connection