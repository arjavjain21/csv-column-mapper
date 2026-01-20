# Deployment Steps for csvmap.com

## Prerequisites
- Domain: csvmap.com (pointed to VPS IP)
- VPS: Ubuntu 22.04+ with root/sudo access
- Supabase project configured
- GitHub repository: https://github.com/arjavjain21/csv-column-mapper

## Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install Git
sudo apt install -y git

# Install UFW firewall
sudo apt install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 2: Clone and Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/csvmap
sudo chown $USER:$USER /var/www/csvmap

# Clone repository
cd /var/www/csvmap
git clone https://github.com/arjavjain21/csv-column-mapper.git .

# Install dependencies
npm install

# Build application
npm run build
```

## Step 3: Configure Environment Variables

```bash
# Copy production example
cp .env.production.example .env.production

# Edit environment file
nano .env.production
```

Set these values:
```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_APP_URL=https://csvmap.com
NODE_ENV=production
PORT=3000
```

## Step 4: Run Supabase Migrations

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project (you'll need your project reference)
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Or manually run SQL from `supabase/migrations/001_initial_schema.sql` and `002_subscription_usage.sql` in Supabase dashboard.

## Step 5: Configure PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'csvmap',
    script: 'build/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

## Step 6: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/csvmap.com
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name csvmap.com www.csvmap.com;

    # Redirect to HTTPS (will be enabled after SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/csvmap.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Configure DNS

In your domain registrar (where you bought csvmap.com):
1. Add A record: `csvmap.com` → Your VPS IP
2. Add A record: `www.csvmap.com` → Your VPS IP

Wait for DNS propagation (can take up to 48 hours, usually < 1 hour).

Verify:
```bash
dig csvmap.com
nslookup csvmap.com
```

## Step 8: Setup SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d csvmap.com -d www.csvmap.com

# Certbot will automatically update Nginx config
# Verify SSL
curl -I https://csvmap.com
```

## Step 9: Verify Deployment

```bash
# Check application is running
pm2 status
pm2 logs csvmap

# Check Nginx
sudo systemctl status nginx

# Test endpoints
curl https://csvmap.com
curl https://csvmap.com/api/auth/session
```

## Step 10: Post-Deployment Checklist

- [ ] Application accessible at https://csvmap.com
- [ ] SSL certificate valid (green lock in browser)
- [ ] Authentication working (magic link login)
- [ ] File upload working
- [ ] Column mapping functional
- [ ] Export working (CSV, Excel, JSON, SQL)
- [ ] PM2 auto-restart on reboot
- [ ] Logs accessible (`pm2 logs csvmap`)
- [ ] Supabase connection working
- [ ] Rate limiting active

## Maintenance

### Update Application
```bash
cd /var/www/csvmap
git pull origin main
npm install
npm run build
pm2 restart csvmap
```

### View Logs
```bash
pm2 logs csvmap
# Or
tail -f logs/pm2-out.log
tail -f logs/pm2-error.log
```

### Monitor
```bash
pm2 monit
```

## Troubleshooting

### Application not starting
```bash
pm2 logs csvmap --lines 100
pm2 restart csvmap
```

### Nginx errors
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL issues
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### Port conflicts
```bash
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000
```
