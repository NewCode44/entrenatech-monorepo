# 🚀 Deployment Guide - EntrenaTech Monorepo

## 📋 Prerequisites

### GitHub Repository
- ✅ Repository: `https://github.com/NewCode44/entrenatech-monorepo`
- ✅ GitHub Actions configured
- ✅ SSH keys generated

### VPS Requirements
- Ubuntu 20.04+ or Debian 10+
- Node.js 18+
- Nginx
- SSL Certificates (via Certbot)

## 🔧 GitHub Actions Configuration

### Required Secrets in GitHub
Go to your repository `Settings > Secrets and variables > Actions` and add:

1. **HOST**
   ```
   147.182.172.208
   ```

2. **USERNAME**
   ```
   root
   ```

3. **SSH_KEY**
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [Your private key content here]
   -----END OPENSSH PRIVATE KEY-----
   ```

4. **PORT**
   ```
   22
   ```

### Workflows Configured

#### 1. **Deploy to VPS** (`.github/workflows/deploy.yml`)
- Triggers: Push to main branch
- Builds applications
- Deploys to VPS via SSH
- Health check

#### 2. **Preview Build** (`.github/workflows/preview.yml`)
- Triggers: Pull requests
- Creates build artifacts
- Comments on PR with status

#### 3. **Lint and Test** (`.github/workflows/lint.yml`)
- Type checking
- ESLint
- Build validation

## 🚀 Deployment Process

### Automatic Deployment (Recommended)
1. Push to `main` branch
2. GitHub Actions automatically:
   - ✅ Builds applications
   - ✅ Deploys to VPS
   - ✅ Restarts Nginx
   - ✅ Runs health checks

### Manual Deployment
```bash
# On VPS
sudo /var/www/deploy.sh
```

## 🌐 URLs After Deployment

- **SuperAdmin Dashboard**: `https://admin.entrenatech.com`
- **Member Portal**: `https://portal.entrenatech.com`

## 🔧 VPS Configuration

### Directory Structure
```
/var/www/entrenatech-monorepo/
├── apps/
│   ├── entrenatech-dashboard/
│   │   └── dist/           # Built admin dashboard
│   ├── member-portal/
│   │   └── dist/           # Built member portal
│   └── superadmin-dashboard/
│       └── dist/           # Built superadmin dashboard
├── deploy.sh                 # Deployment script
└── .git/                   # Git repository
```

### Nginx Configuration
```nginx
# SuperAdmin Dashboard
server {
    listen 80;
    server_name admin.entrenatech.com;
    root /var/www/entrenatech-monorepo/apps/superadmin-dashboard/dist;
    location / { try_files $uri $uri/ /index.html; }
}

# Member Portal
server {
    listen 80;
    server_name portal.entrenatech.com;
    root /var/www/entrenatech-monorepo/apps/member-portal/dist;
    location / { try_files $uri $uri/ /index.html; }
}
```

### SSL Configuration
```bash
sudo certbot --nginx -d admin.entrenatech.com -d portal.entrenatech.com
```

## 🔄 CI/CD Pipeline

### 1. Developer pushes code
```
git add .
git commit -m "feat: new feature"
git push origin main
```

### 2. GitHub Actions triggers
```
┌─────────────────┐
│  GitHub Actions  │
│  ┌─────────────┐ │
│  │ Lint & Test │ │
│  └─────────────┘ │
│  ┌─────────────┐ │
│  │   Build     │ │
│  └─────────────┘ │
│  ┌─────────────┐ │
│  │   Deploy    │ │
│  └─────────────┘ │
└─────────────────┘
```

### 3. Deployment Steps
1. **SSH Connection**: Connect to VPS
2. **Pull Latest**: `git pull origin main`
3. **Install Dependencies**: `npm ci --legacy-peer-deps`
4. **Build Apps**: `npm run build:superadmin && npm run build:portal`
5. **Copy Files**: Copy to Nginx directories
6. **Restart Services**: `systemctl restart nginx`
7. **Health Check**: Verify sites are responding

## 🚨 Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
```bash
# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa
chmod 700 ~/.ssh
```

#### 2. Build Failed
```bash
# Check logs
sudo tail -f /var/log/nginx/error.log
cd /var/www/entrenatech-monorepo
npm run build:superadmin
```

#### 3. Sites Not Responding
```bash
# Check Nginx status
sudo systemctl status nginx

# Check sites enabled
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/entrenatech-monorepo
sudo chmod -R 755 /var/www/entrenatech-monorepo/apps/*/dist
```

### Monitoring
```bash
# System resources
htop

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
journalctl -u nginx -f
```

## 📊 Performance Optimization

### Nginx Optimization
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build Optimization
- **Code Splitting**: Already configured with Vite
- **Tree Shaking**: Automatic with ES modules
- **Minification**: Automatic in production builds

## 🔒 Security Considerations

### 1. SSH Security
```bash
# Disable root login (after setup)
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

### 2. Firewall
```bash
# UFW configuration
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

### 3. SSL Configuration
- Auto-renewal configured via cron
- Modern TLS protocols
- HSTS headers

## 📱 Monitoring and Maintenance

### Health Check Script
```bash
#!/bin/bash
# /var/www/health-check.sh

# Check websites
if curl -f https://admin.entrenatech.com; then
    echo "✅ SuperAdmin OK"
else
    echo "❌ SuperAdmin DOWN"
fi

if curl -f https://portal.entrenatech.com; then
    echo "✅ Member Portal OK"
else
    echo "❌ Member Portal DOWN"
fi
```

### Cron Jobs
```bash
# Auto-renew SSL
0 12 * * * /usr/bin/certbot renew --quiet

# Health check
*/5 * * * * /var/www/health-check.sh
```

## 🚀 Next Steps

### 1. **Database Integration**
- Connect to real database
- Add migrations
- Implement backup strategy

### 2. **Advanced Monitoring**
- Set up monitoring dashboard
- Configure alerts
- Add performance metrics

### 3. **Scaling**
- Load balancer configuration
- Multiple server setup
- CDN integration

### 4. **Additional Features**
- API rate limiting
- Advanced caching
- CDN for static assets

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Check VPS logs
4. Verify domain DNS settings

---

## 🎉 Deployment Complete!

Your EntrenaTech platform is now live with:
- ✅ Automatic CI/CD pipeline
- ✅ SSL certificates
- ✅ Health monitoring
- ✅ Production optimizations
- ✅ Security best practices