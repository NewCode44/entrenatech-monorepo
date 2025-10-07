# Script de configuración SSH para despliegue con GitHub Actions (PowerShell)
# Este script te ayudará a configurar la autenticación por clave SSH

Write-Host "🔑 Configurando autenticación SSH para GitHub Actions..." -ForegroundColor Green
Write-Host ""

# Datos del VPS
$VPS_IP = "5.161.196.136"
$VPS_USER = "root"
$VPS_PORT = "22"

Write-Host "Datos del VPS:" -ForegroundColor Yellow
Write-Host "IP: $VPS_IP"
Write-Host "Usuario: $VPS_USER"
Write-Host "Puerto: $VPS_PORT"
Write-Host ""

# Clave pública para agregar a authorized_keys
$PUBLIC_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJyJdmXgFaU9PG2m3MuABWQcaUJy81jOYeX/sz3HAMDe GitHub Actions"

Write-Host "📋 Clave pública para agregar:" -ForegroundColor Cyan
Write-Host $PUBLIC_KEY
Write-Host ""

Write-Host "🔧 Instrucciones para configurar autenticación SSH:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Como no tienes contraseña para el VPS, tienes dos opciones:"
Write-Host ""
Write-Host "Opción 1: Si tienes acceso SSH por otros medios:" -ForegroundColor Green
Write-Host "  ssh root@$VPS_IP 'echo `"$PUBLIC_KEY`" >> ~/.ssh/authorized_keys'"
Write-Host ""
Write-Host "Opción 2: Si puedes acceder a la consola del VPS directamente:" -ForegroundColor Green
Write-Host "  1. Entra a la consola de tu VPS (vía panel del proveedor)"
Write-Host "  2. Ejecuta estos comandos:"
Write-Host "     mkdir -p ~/.ssh"
Write-Host "     chmod 700 ~/.ssh"
Write-Host "     echo `"$PUBLIC_KEY`" >> ~/.ssh/authorized_keys"
Write-Host "     chmod 600 ~/.ssh/authorized_keys"
Write-Host ""
Write-Host "✅ Después de agregar la clave pública a tu VPS:" -ForegroundColor Green
Write-Host "1. Ve a tu repositorio de GitHub"
Write-Host "2. Settings > Secrets and variables > Actions"
Write-Host "3. Agrega nuevo secreto llamado 'SSH_KEY'"
Write-Host "4. Pega la clave PRIVADA (no la pública)"
Write-Host "5. Asegúrate de que todos los secretos estén configurados:"
Write-Host "   - HOST: 5.161.196.136"
Write-Host "   - USERNAME: root"
Write-Host "   - SSH_KEY: (contenido de la clave privada)"
Write-Host "   - PORT: 22"
Write-Host ""

Write-Host "🚀 ¡Entonces puedes probar el despliegue subiendo a la rama main!" -ForegroundColor Green
Write-Host ""

# Función para probar conexión SSH
function Test-SSHConnection {
    Write-Host "🔍 Probando conexión SSH..." -ForegroundColor Yellow
    try {
        $result = ssh -o ConnectTimeout=10 -o BatchMode=yes root@$VPS_IP "echo 'Conexión SSH exitosa'" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ ¡Prueba de conexión SSH exitosa!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ La prueba de conexión SSH falló. Por favor completa la configuración anterior." -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ La prueba de conexión SSH falló. Por favor completa la configuración anterior." -ForegroundColor Red
        return $false
    }
}

# Descomenta la siguiente línea para probar conexión SSH después de la configuración
# Test-SSHConnection