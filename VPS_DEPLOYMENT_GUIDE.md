# 🚀 VPS Deployment Guide - CSV Column Mapper

Complete step-by-step guide to deploy CSV Column Mapper to your OVH Cloud VPS.

**VPS Details:**
- **Host:** hyperke-vps (OVH Cloud)
- **SSH Access:** `ssh hyperke-vps`
- **Domain:** Your custom domain (to be configured)

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] SSH access to your VPS (`hyperke-vps`)
- [ ] Domain name pointing to your VPS IP address
- [ ] Supabase project credentials (URL and anon key)
- [ ] Stripe account credentials (if using payments)
- [ ] Root or sudo access on the VPS

---

## Step 1: Connect to Your VPS

```bash
# From your local machine
ssh hyperke-vps

# If you need to specify a user:
ssh username@hyperke-vps
# or
ssh username@your-vps-ip-address
```

---

## Step 2: Update System and Install Prerequisites

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server/Reverse Proxy)
sudo apt install -y nginx

# Install Git (if not already installed)
sudo apt install -y git

# Install Certbot (for SSL certificates)
sudo apt install -y certbot python3-certbot-nginx
```

---

## Step 3: Prepare Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/csv-column-mapper
sudo chown -R $USER:$USER /var/www/csv-column-mapper

# Or use a directory in your home folder (recommended for easier access)
mkdir -p ~/apps/csv-column-mapper
cd ~/apps/csv-column-mapper
```

---

## Step 4: Transfer Files from Local Machine to VPS

### Option A: Using SCP (Recommended)

From your **local machine** (in a new terminal, keep VPS session open):

```bash
# Navigate to project directory
cd "/Users/arjavjain/Downloads/hyperke/Automations/Web Apps/csv-column-mapper"

# Transfer entire project (excluding node_modules)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  --exclude 'build' --exclude '.svelte-kit' \
  ./ hyperke-vps:~/apps/csv-column-mapper/

# Or using SCP (slower but simpler)
scp -r \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'build' \
  --exclude '.svelte-kit' \
  ./* hyperke-vps:~/apps/csv-column-mapper/
```

### Option B: Using Git (If repo is on GitHub)

On your **VPS**:

```bash
cd ~/apps
git clone https://github.com/your-username/csv-column-mapper.git
cd csv-column-mapper
```

### Option C: Manual Transfer with tar

On your **local machine**:

```bash
cd "/Users/arjavjain/Downloads/hyperke/Automations/Web Apps/csv-column-mapper"
tar --exclude='node_modules' --exclude='.git' --exclude='build' \
  --exclude='.svelte-kit' -czf ../csv-column-mapper.tar.gz .
scp ../csv-column-mapper.tar.gz hyperke-vps:~/apps/
```

On your **VPS**:

```bash
cd ~/apps
mkdir -p csv-column-mapper
cd csv-column-mapper
tar -xzf ../csv-column-mapper.tar.gz
rm ../csv-column-mapper.tar.gz
```

---

## Step 5: Install Node.js Adapter for SvelteKit

On your **VPS**:

```bash
cd ~/apps/csv-column-mapper

# Install adapter-node (required for VPS deployment)
npm install --save-dev @sveltejs/adapter-node
```

---

## Step 6: Update SvelteKit Configuration

On your **VPS**, edit `svelte.config.js`:

```bash
nano svelte.config.js
```

Replace the content with:

```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true,
			envPrefix: ''
		})
	}
};

export default config;
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 7: Configure Environment Variables

On your **VPS**:

```bash
cd ~/apps/csv-column-mapper

# Create .env file
nano .env
```

Add the following environment variables (replace with your actual values):

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs (if using subscriptions)
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_LIFETIME=price_xxxxxxxxxxxxx

# Application URL (your domain)
PUBLIC_APP_URL=https://your-domain.com

# Resend API Key (if using email)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Node Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

**Important Notes:**
- Replace `your-domain.com` with your actual domain name
- Use your production Supabase credentials (not test keys)
- Use your production Stripe keys (not test keys) if going live
- The `PORT` and `HOST` are for the Node.js server (PM2 will use these)

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 8: Install Dependencies and Build

On your **VPS**:

```bash
cd ~/apps/csv-column-mapper

# Install all dependencies
npm install

# Build the application for production
npm run build

# Verify build was successful
ls -la build/
# You should see: client/, server/, and other files
```

If the build fails, check for any missing dependencies or configuration issues.

---

## Step 9: Create PM2 Ecosystem File

On your **VPS**:

```bash
cd ~/apps/csv-column-mapper

# Create PM2 configuration file
nano ecosystem.config.js
```

Add the following content:

```javascript
export default {
  apps: [{
    name: 'csv-column-mapper',
    script: './build/index.js',
    cwd: '/home/your-username/apps/csv-column-mapper',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

**Important:** Replace `your-username` with your actual VPS username.

Save and exit.

Create logs directory:

```bash
mkdir -p logs
```

---

## Step 10: Start Application with PM2

On your **VPS**:

```bash
cd ~/apps/csv-column-mapper

# Start the application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs csv-column-mapper

# Save PM2 configuration to start on boot
pm2 save
pm2 startup
# Follow the instructions shown (usually involves running a sudo command)
```

The application should now be running on `http://localhost:3000` (or your VPS IP:3000).

---

## Step 11: Configure Nginx as Reverse Proxy

On your **VPS**:

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/csv-column-mapper
```

Add the following configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # Uncomment after Step 12
    # return 301 https://$server_name$request_uri;

    # For now, proxy to Node.js app
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

    # Increase timeouts for large file uploads
    client_max_body_size 50M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}
```

Save and exit.

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/csv-column-mapper /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 12: Configure SSL Certificate with Let's Encrypt

On your **VPS**:

```bash
# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically update your Nginx configuration.

**Verify SSL:**

```bash
# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

SSL certificates auto-renew, but you can verify renewal is set up:

```bash
# Check if renewal cron job exists
sudo systemctl status certbot.timer
```

---

## Step 13: Update Nginx Configuration for HTTPS

After SSL setup, Certbot should have updated your config. Verify:

```bash
sudo nano /etc/nginx/sites-available/csv-column-mapper
```

It should now include SSL configuration. If not, update it to:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

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

    client_max_body_size 50M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 14: Verify Database Connection

On your **VPS**, test the Supabase connection:

```bash
cd ~/apps/csv-column-mapper

# Check if environment variables are loaded
node -e "console.log(process.env.PUBLIC_SUPABASE_URL)"

# Test database connection (create a simple test script)
cat > test-db.js << 'EOF'
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

supabase.from('templates').select('count').then(({ data, error }) => {
  if (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  } else {
    console.log('✅ Database connection successful!');
    process.exit(0);
  }
});
EOF

# Install dotenv if needed
npm install dotenv

# Run test
node test-db.js
```

---

## Step 15: Run Database Migrations (if needed)

If you haven't run migrations yet, do so via Supabase Dashboard:

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run in SQL Editor
5. Repeat for `002_subscription_usage.sql` if it exists

---

## Step 16: Configure Firewall (if applicable)

On your **VPS**:

```bash
# Check if UFW is active
sudo ufw status

# If UFW is active, ensure these ports are open:
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Node.js (optional, only if accessing directly)

# Reload firewall
sudo ufw reload
```

---

## Step 17: Test the Deployment

1. **Visit your domain:** `https://your-domain.com`
2. **Check application status:**
   ```bash
   pm2 status
   pm2 logs csv-column-mapper --lines 50
   ```
3. **Test key features:**
   - Homepage loads
   - Authentication works
   - File upload works
   - Database queries work

---

## Step 18: Set Up Monitoring and Maintenance

### PM2 Monitoring

```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Check Script

Create a simple health check:

```bash
cd ~/apps/csv-column-mapper
nano health-check.sh
```

Add:

```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $response -eq 200 ]; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application returned status code: $response"
    pm2 restart csv-column-mapper
    exit 1
fi
```

Make executable:

```bash
chmod +x health-check.sh
```

Add to crontab (check every 5 minutes):

```bash
crontab -e
# Add this line:
*/5 * * * * /home/your-username/apps/csv-column-mapper/health-check.sh >> /home/your-username/apps/csv-column-mapper/logs/health-check.log 2>&1
```

---

## 🔄 Updating the Application

When you need to update the application:

```bash
# SSH into VPS
ssh hyperke-vps

# Navigate to app directory
cd ~/apps/csv-column-mapper

# Pull latest changes (if using Git)
git pull origin main

# Or transfer new files using rsync/scp from local machine

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2
pm2 restart csv-column-mapper

# Check logs
pm2 logs csv-column-mapper --lines 50
```

---

## 🐛 Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs csv-column-mapper --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart csv-column-mapper
```

### Nginx 502 Bad Gateway

```bash
# Check if Node.js app is running
pm2 status

# Check Node.js logs
pm2 logs csv-column-mapper

# Verify app is listening on port 3000
curl http://localhost:3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Issues

```bash
# Verify environment variables
cd ~/apps/csv-column-mapper
cat .env | grep SUPABASE

# Test connection manually
node test-db.js

# Check Supabase project status
# Visit: https://app.supabase.com
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process (replace PID)
sudo kill -9 PID

# Or change port in .env and ecosystem.config.js
```

---

## 📊 Useful Commands Reference

```bash
# PM2 Commands
pm2 status                    # Check app status
pm2 logs csv-column-mapper    # View logs
pm2 restart csv-column-mapper # Restart app
pm2 stop csv-column-mapper    # Stop app
pm2 delete csv-column-mapper  # Remove from PM2
pm2 monit                     # Monitor resources

# Nginx Commands
sudo nginx -t                 # Test configuration
sudo systemctl reload nginx   # Reload configuration
sudo systemctl restart nginx  # Restart Nginx
sudo systemctl status nginx   # Check status

# Application Commands
cd ~/apps/csv-column-mapper
npm run build                 # Build application
npm run preview               # Preview build locally
pm2 restart csv-column-mapper # Restart after changes
```

---

## ✅ Deployment Checklist

- [ ] VPS access confirmed
- [ ] Node.js 20.x installed
- [ ] PM2 installed and configured
- [ ] Nginx installed and configured
- [ ] Files transferred to VPS
- [ ] `@sveltejs/adapter-node` installed
- [ ] `svelte.config.js` updated
- [ ] `.env` file created with all variables
- [ ] Dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] PM2 ecosystem file created
- [ ] Application running via PM2
- [ ] Nginx reverse proxy configured
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] Database connection verified
- [ ] Database migrations run
- [ ] Application tested end-to-end
- [ ] PM2 startup configured
- [ ] Firewall configured
- [ ] Monitoring set up

---

## 🎉 Success!

Your CSV Column Mapper application should now be live at:
**https://your-domain.com**

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs csv-column-mapper`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure database credentials are correct
5. Check domain DNS propagation: `dig your-domain.com`

---

**Last Updated:** 2025-01-20
**Version:** 1.0
