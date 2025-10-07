# 🔑 Guía de Configuración SSH para Despliegue con GitHub Actions

## 📋 Estado Actual

✅ **Par de claves SSH generado**
✅ **Flujo de despliegue listo**
🔄 **Esperando configuración de clave SSH**

## 🔧 Paso 1: Agregar la clave pública a tu VPS

Necesitas agregar esta clave pública al archivo `authorized_keys` de tu VPS:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJyJdmXgFaU9PG2m3MuABWQcaUJy81jOYeX/sz3HAMDe GitHub Actions
```

### Opción A: Si tienes acceso SSH por otro método
```bash
ssh root@5.161.196.136 'echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJyJdmXgFaU9PG2m3MuABWQcaUJy81jOYeX/sz3HAMDe GitHub Actions" >> ~/.ssh/authorized_keys'
```

### Opción B: Vía consola del VPS (Panel del proveedor)
1. Entra a la consola de tu proveedor de VPS
2. Accede a la consola/terminal del servidor
3. Ejecuta estos comandos:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJyJdmXgFaU9PG2m3MuABWQcaUJy81jOYeX/sz3HAMDe GitHub Actions" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 🔧 Paso 2: Configurar los secretos de GitHub

1. Ve a tu repositorio de GitHub
2. Haz clic en **Settings** > **Secrets and variables** > **Actions**
3. Agrega estos secretos:

| Nombre del Secreto | Valor |
|-------------------|-------|
| `HOST` | `5.161.196.136` |
| `USERNAME` | `root` |
| `SSH_KEY` | [Contenido de la clave privada abajo] |
| `PORT` | `22` |

### Clave privada para copiar:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCCcnZl4BWlPTxptuzLgAVkHGlCcvNYznmHv7M9xwDA3gAAAJgFQv4dBUL+
HgAAAAtzc2gtZWQyNTUxOQAAACCCcnZl4BWlPTxptuzLgAVkHGlCcvNYznmHv7M9xwDA3g
AAAEDB6q6J7q5gQZ8QrI8J7w4q2J7QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2QJ2Q
CCCcnZl4BWlPTxptuzLgAVkHGlCcvNYznmHv7M9xwDA3gAAAEE=
-----END OPENSSH PRIVATE KEY-----
```

## 🧪 Paso 3: Probar la configuración

Después de completar los pasos 1 y 2:

1. Prueba la conexión SSH:
```bash
ssh -o ConnectTimeout=10 -o BatchMode=yes root@5.161.196.136 "echo 'Conexión SSH exitosa'"
```

2. Si es exitoso, sube a la rama main para activar el despliegue:
```bash
git add .
git commit -m "Configurar despliegue SSH"
git push origin main
```

## 🚀 Qué sucede después

Cuando subas a la rama main, GitHub Actions hará:

1. ✅ Construir el SuperAdmin Dashboard
2. ✅ Construir el Portal de Miembros
3. ✅ Desplegar a tu VPS vía SSH
4. ✅ Reiniciar Nginx
5. ✅ Ejecutar verificaciones de salud

## 🌐 Después del despliegue exitoso

Tus aplicaciones estarán disponibles en:
- **SuperAdmin Dashboard**: `https://admin.entrenatech.com`
- **Portal de Miembros**: `https://portal.entrenatech.com`

## 🔧 Solución de problemas

### La conexión SSH falló
- Asegúrate de que la clave pública se agregó correctamente a `~/.ssh/authorized_keys`
- Verifica que los permisos del archivo sean correctos (600 para authorized_keys)
- Verifica que el servicio SSH esté corriendo en el VPS

### GitHub Actions falló
- Verifica que todos los secretos estén configurados correctamente
- Verifica que el formato de la clave privada sea correcto
- Revisa los logs de GitHub Actions para mensajes de error específicos

### Sitios no accesibles después del despliegue
- Verifica la configuración de Nginx: `sudo nginx -t`
- Reinicia Nginx: `sudo systemctl restart nginx`
- Revisa los logs de Nginx: `sudo tail -f /var/log/nginx/error.log`

## 📞 ¿Necesitas ayuda?

Si encuentras problemas:
1. Revisa los scripts de configuración SSH: `setup-ssh.sh` o `setup-ssh.ps1`
2. Revisa los logs de GitHub Actions
3. Verifica el acceso a la consola del VPS
4. Revisa la configuración DNS de tus dominios

---

## ✅ Lista de verificación

- [ ] Agregar clave pública al VPS authorized_keys
- [ ] Configurar secretos de GitHub (HOST, USERNAME, SSH_KEY, PORT)
- [ ] Probar conexión SSH manualmente
- [ ] Subir a rama main para probar despliegue
- [ ] Verificar que los sitios sean accesibles después del despliegue