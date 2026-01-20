# Complete VPS Deployment Guide for mapcsv.com

This is your **complete guide** for deploying CSV Column Mapper on your VPS. Everything you need is here.

---

## 🎯 Quick Comparison: VPS vs Vercel

### VPS Deployment (Your Choice)
**Pros:**
- ✅ Full control over server
- ✅ No function execution limits
- ✅ Predictable costs (fixed monthly)
- ✅ Can run background jobs
- ✅ No vendor lock-in
- ✅ Better for long-term scaling

**Cons:**
- ⚠️ You manage updates & maintenance
- ⚠️ You handle SSL renewal
- ⚠️ You monitor uptime
- ⚠️ You handle security patches
- ⚠️ Requires server knowledge

**Cost:** $5-20/month (DigitalOcean, OVH, AWS)

### Vercel Deployment
**Pros:**
- ✅ Zero maintenance
- ✅ Auto SSL renewal
- ✅ Auto deployments
- ✅ Built-in CDN
- ✅ Free tier available

**Cons:**
- ⚠️ Function execution limits (100/day free)
- ⚠️ Less control
- ⚠️ Vendor lock-in
- ⚠️ Can get expensive at scale

**Cost:** $0/month (free) or $20/month (pro)

---

## 📋 VPS Deployment Process

### Step 1: Server Setup (One-Time)

#### 1.1 Choose Your VPS Provider

**Recommended Options:**

1. **DigitalOcean** ($6/month)
   - 1GB RAM, 1 vCPU, 25GB SSD
   - Great documentation
   - Easy to use

2. **OVH Cloud** ($4-8/month)
   - Good European option
   - Competitive pricing

3. **AWS EC2** (Free tier available)
   - t2.micro free for 12 months
   - Then ~$8/month

4. **Linode** ($5/month)
   - Simple pricing
   - Good performance

**Recommendation:** Start with DigitalOcean ($6/month) - easiest to use.

#### 1.2 Create VPS Instance

```bash
# Choose:
- OS: Ubuntu 22.04 LTS
- Size: 1GB RAM minimum (2GB recommended)
- Region: Closest to your users
- SSH Key: Add your public key
```

#### 1.3 Initial Server Setup

```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create non-root user (recommended)
adduser deploy
usermod -aG sudo deploy
su - deploy

# Install essential tools
sudo apt install -y curl wget git ufw
```

---

### Step 2: Install Required Software

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install -y nginx

# Install Certbot (SSL Certificates)
sudo apt install -y certbot python3-certbot-nginx

# Install PostgreSQL client (for database access if needed)
sudo apt install -y postgresql-client
```

---

### Step 3: Application Setup

#### 3.1 Clone Repository

```bash
# Create application directory
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone https://github.com/your-username/csv-column-mapper.git
cd csv-column-mapper

# Or upload files via SCP from your local machine:
# scp -r /path/to/local/project deploy@your-server-ip:~/apps/csv-column-mapper
```

#### 3.2 Install Dependencies

```bash
cd ~/apps/csv-column-mapper

# Install Node.js dependencies
npm install

# Build the application
npm run build

# Verify build succeeded
ls -la build/  # Should see index.js and other files
```

#### 3.3 Create Environment File

```bash
# Create .env file
nano .env
```

**Paste this content (update with your values):**

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration (Production)
STRIPE_SECRET_KEY=sk_live_your-production-key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-production-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxx
STRIPE_PRICE_LIFETIME=price_xxx

# Email Configuration (Resend)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@mapcsv.com

# App Configuration
PUBLIC_APP_URL=https://mapcsv.com
NODE_ENV=production
PORT=3000
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

#### 3.4 Test Application Locally

```bash
# Start application with PM2
pm2 start build/index.js --name csv-mapper

# Check if it's running
pm2 status

# View logs
pm2 logs csv-mapper

# Test locally (in another terminal)
curl http://localhost:3000

# If it works, stop it for now
pm2 stop csv-mapper
```

---

### Step 4: Configure Nginx

#### 4.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/mapcsv.com
```

**Paste this configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name mapcsv.com www.mapcsv.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name mapcsv.com www.mapcsv.com;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/mapcsv.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/mapcsv.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy to Node.js application
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Max upload size (for CSV files)
    client_max_body_size 50M;
}
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

#### 4.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/mapcsv.com /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

### Step 5: Configure Domain & DNS

#### 5.1 Point Domain to Server

In your domain registrar (where you bought mapcsv.com):

```
Type: A
Name: @
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600

Type: A
Name: www
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600
```

#### 5.2 Verify DNS Propagation

```bash
# Check DNS (from your local machine)
dig mapcsv.com
nslookup mapcsv.com

# Should return your server IP address
# Wait 5-30 minutes for DNS to propagate
```

---

### Step 6: Get SSL Certificate

#### 6.1 Obtain Certificate

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d mapcsv.com -d www.mapcsv.com

# Certbot will:
# 1. Verify domain ownership
# 2. Install certificate
# 3. Update Nginx config automatically
# 4. Set up auto-renewal
```

**Follow prompts:**
- Enter email: your-email@example.com
- Agree to terms: Y
- Share email: N (optional)
- Redirect HTTP to HTTPS: 2 (recommended)

#### 6.2 Verify SSL

```bash
# Test certificate
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run

# Visit your site
# https://mapcsv.com (should show green lock)
```

---

### Step 7: Start Application

#### 7.1 Start with PM2

```bash
cd ~/apps/csv-column-mapper

# Start application
pm2 start build/index.js --name csv-mapper

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually: sudo env PATH=... pm2 startup systemd -u deploy --hp /home/deploy)
```

#### 7.2 Verify Everything Works

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs csv-mapper

# Check Nginx
sudo systemctl status nginx

# Test from browser
# Visit: https://mapcsv.com
```

---

### Step 8: Configure Firewall

```bash
# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔄 Updates & Maintenance

### How Updates Work

#### Option 1: Manual Updates (Recommended for VPS)

```bash
# SSH into your server
ssh deploy@your-server-ip

# Navigate to app directory
cd ~/apps/csv-column-mapper

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart csv-mapper

# Check logs
pm2 logs csv-mapper
```

**Time:** ~5 minutes per update

#### Option 2: Automated Updates (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/apps/csv-column-mapper
            git pull origin main
            npm install
            npm run build
            pm2 restart csv-mapper
```

**Setup:** 10 minutes, then updates are automatic

---

### Who Takes Care of Maintenance?

**You are responsible for:**

1. **Application Updates** (Monthly)
   - Pull code changes
   - Rebuild and restart
   - Test functionality

2. **System Updates** (Monthly)
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **SSL Certificate Renewal** (Automatic, but verify)
   ```bash
   # Certbot auto-renews, but check:
   sudo certbot renew --dry-run
   ```

4. **Monitoring** (Daily/Weekly)
   - Check application is running: `pm2 status`
   - Check logs: `pm2 logs csv-mapper`
   - Monitor disk space: `df -h`
   - Monitor memory: `free -h`

5. **Backups** (Weekly)
   - Database: Supabase handles this
   - Code: Git repository
   - Environment variables: Store securely

6. **Security Patches** (As needed)
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## ⚠️ Important Caveats & Things to Keep in Mind

### 1. Server Management

**You're responsible for:**
- ✅ Server uptime (if server goes down, site goes down)
- ✅ Security patches (keep system updated)
- ✅ Monitoring (check logs regularly)
- ✅ Backups (code is in Git, database in Supabase)

**Mitigation:**
- Use PM2 for auto-restart on crashes
- Set up monitoring (UptimeRobot - free)
- Enable automatic security updates

### 2. SSL Certificate Renewal

**Issue:** Certificates expire every 90 days

**Solution:** Certbot auto-renews, but verify:
```bash
# Add to crontab (check monthly)
sudo crontab -e
# Add: 0 0 1 * * certbot renew --quiet
```

### 3. Server Resources

**Limitations:**
- 1GB RAM: Can handle ~50-100 concurrent users
- 2GB RAM: Can handle ~200-500 concurrent users
- Disk space: Monitor with `df -h`

**Upgrade when:**
- High memory usage (>80%)
- Slow response times
- Frequent crashes

### 4. Application Crashes

**PM2 handles:**
- Auto-restart on crash
- Logs errors
- Process management

**Monitor with:**
```bash
pm2 monit  # Real-time monitoring
pm2 logs csv-mapper --lines 100  # View recent logs
```

### 5. Database Connection

**Supabase handles:**
- Database hosting
- Backups
- Scaling

**You handle:**
- Connection string (in .env)
- API keys security

### 6. Domain & DNS

**You handle:**
- Domain renewal (yearly)
- DNS configuration
- DNS propagation delays (can take 24-48h)

### 7. Security

**You must:**
- Keep system updated
- Use strong passwords
- Configure firewall (UFW)
- Keep secrets secure (.env file)
- Regular security audits

**Recommended:**
```bash
# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoring & Maintenance Schedule

### Daily (5 minutes)
```bash
# Quick health check
pm2 status
curl https://mapcsv.com/api/auth/session
```

### Weekly (15 minutes)
```bash
# Check logs for errors
pm2 logs csv-mapper --lines 50

# Check disk space
df -h

# Check memory usage
free -h

# Check SSL certificate
sudo certbot certificates
```

### Monthly (30 minutes)
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Application updates
cd ~/apps/csv-column-mapper
git pull origin main
npm install
npm run build
pm2 restart csv-mapper

# Test SSL renewal
sudo certbot renew --dry-run
```

### Quarterly (1 hour)
- Review security logs
- Check for security patches
- Review application performance
- Update dependencies if needed

---

## 🆓 Free Plans Available

### VPS Providers with Free Tiers

1. **AWS EC2** (12 months free)
   - t2.micro instance
   - 750 hours/month
   - 1GB RAM
   - Perfect for testing

2. **Google Cloud Platform** (Free tier)
   - e2-micro instance
   - 1GB RAM
   - 30GB disk
   - $300 credit for 90 days

3. **Oracle Cloud** (Always free)
   - 2 AMD VMs
   - 1GB RAM each
   - 10TB egress/month
   - Best free tier!

**Recommendation:** Start with AWS free tier, then move to DigitalOcean ($6/month) when ready.

---

## 🚀 Quick Start Checklist

### Pre-Deployment
- [ ] VPS server created (Ubuntu 22.04)
- [ ] Domain registered (mapcsv.com)
- [ ] Supabase project created
- [ ] Stripe account created
- [ ] Resend account created

### Deployment Steps
- [ ] Install Node.js, PM2, Nginx, Certbot
- [ ] Clone repository to server
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env` file with all variables
- [ ] Build application (`npm run build`)
- [ ] Configure Nginx
- [ ] Point DNS to server IP
- [ ] Get SSL certificate (`certbot`)
- [ ] Start application (`pm2 start`)
- [ ] Configure firewall
- [ ] Test everything works

### Post-Deployment
- [ ] Run Supabase migrations
- [ ] Configure Stripe products
- [ ] Set up Resend domain
- [ ] Test authentication
- [ ] Test CSV mapping
- [ ] Set up monitoring
- [ ] Document credentials securely

---

## 📚 Complete Command Reference

### Application Management
```bash
# Start
pm2 start build/index.js --name csv-mapper

# Stop
pm2 stop csv-mapper

# Restart
pm2 restart csv-mapper

# View logs
pm2 logs csv-mapper

# Monitor
pm2 monit

# Status
pm2 status

# Save configuration
pm2 save
```

### System Management
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep node

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Management
```bash
# Check certificates
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Firewall Management
```bash
# Check status
sudo ufw status

# Allow port
sudo ufw allow 443/tcp

# Enable/disable
sudo ufw enable
sudo ufw disable
```

---

## 🆘 Troubleshooting

### Application Not Starting
```bash
# Check logs
pm2 logs csv-mapper --lines 100

# Check if port is in use
sudo netstat -tlnp | grep 3000

# Restart PM2
pm2 restart csv-mapper
```

### SSL Certificate Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check Nginx config
sudo nginx -t
```

### High Memory Usage
```bash
# Check memory
free -h

# Check what's using memory
ps aux --sort=-%mem | head

# Restart application
pm2 restart csv-mapper
```

### Database Connection Issues
```bash
# Check environment variables
cat .env | grep SUPABASE

# Test connection (from app)
curl https://mapcsv.com/api/auth/session
```

---

## 📞 Support Resources

- **PM2 Docs:** https://pm2.keymetrics.io/docs/
- **Nginx Docs:** https://nginx.org/en/docs/
- **Certbot Docs:** https://certbot.eff.org/docs/
- **DigitalOcean Tutorials:** https://www.digitalocean.com/community/tutorials

---

**You're all set!** Follow this guide step-by-step and you'll have your application running on your VPS in about 1-2 hours.

**Remember:** Maintenance is your responsibility, but it's only ~30 minutes/month once set up.
