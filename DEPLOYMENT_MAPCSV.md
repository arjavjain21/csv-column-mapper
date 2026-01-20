# Secure Deployment Guide for mapcsv.com

This guide covers deploying CSV Column Mapper securely with SSL on mapcsv.com.

## Prerequisites

- Domain: `mapcsv.com` (or subdomain like `app.mapcsv.com`)
- Server: VPS (recommended: DigitalOcean, AWS EC2, OVH Cloud) or Vercel
- SSL Certificate: Let's Encrypt (free) or commercial certificate
- DNS access for domain configuration

---

## Option 1: Vercel Deployment (Recommended for MVP)

### Step 1: Domain Setup

1. **Add Domain to Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add `mapcsv.com` and `www.mapcsv.com`
   - Follow DNS configuration instructions

2. **Configure DNS Records**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for current IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL via Let's Encrypt
   - Wait 24-48 hours for DNS propagation and SSL activation
   - Verify SSL at: https://www.ssllabs.com/ssltest/analyze.html?d=mapcsv.com

### Step 2: Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-production-key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-production-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_PRO_MONTHLY=price_your-pro-monthly-id
STRIPE_PRICE_PRO_YEARLY=price_your-pro-yearly-id
STRIPE_PRICE_BUSINESS_MONTHLY=price_your-business-monthly-id
STRIPE_PRICE_BUSINESS_YEARLY=price_your-business-yearly-id
STRIPE_PRICE_LIFETIME=price_your-lifetime-id

# Email Configuration (Resend)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@mapcsv.com

# App Configuration
PUBLIC_APP_URL=https://mapcsv.com
```

### Step 3: Database Migration

1. **Run Supabase Migration**
   ```bash
   # Connect to Supabase SQL Editor
   # Copy contents of: supabase/migrations/001_initial_schema.sql
   # Paste and execute in Supabase SQL Editor
   # Repeat for: supabase/migrations/002_subscription_usage.sql
   ```

2. **Verify Tables Created**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   -- Should show: user_profiles, mappings, mapping_versions, templates, teams, team_members
   ```

3. **Verify RLS Policies**
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   -- Should show 22+ policies
   ```

### Step 4: Stripe Configuration

1. **Create Products in Stripe Dashboard**
   - Switch to **Live Mode** (not test mode)
   - Create 5 products:
     - Pro Monthly: $29/month
     - Pro Yearly: $290/year
     - Business Monthly: $99/month
     - Business Yearly: $990/year
     - Lifetime: $199 one-time

2. **Copy Price IDs**
   - Copy each Price ID (starts with `price_`)
   - Add to Vercel environment variables

3. **Configure Webhook**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://mapcsv.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook signing secret
   - Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 5: Email Configuration (Resend)

1. **Create Resend Account**
   - Sign up at https://resend.com
   - Verify domain: `mapcsv.com`
   - Add DNS records (SPF, DKIM, DMARC) as instructed

2. **Get API Key**
   - Copy API key from Resend dashboard
   - Add to Vercel as `RESEND_API_KEY`

3. **Configure From Address**
   - Set `EMAIL_FROM=noreply@mapcsv.com` in Vercel

### Step 6: Deploy

1. **Connect Repository**
   ```bash
   # If not already connected:
   # Vercel Dashboard → Import Project → Connect GitHub/GitLab
   ```

2. **Deploy**
   ```bash
   # Automatic deployment on git push, or:
   vercel --prod
   ```

3. **Verify Deployment**
   - Visit https://mapcsv.com
   - Check SSL certificate (should show valid)
   - Test authentication flow
   - Test CSV mapping

---

## Option 2: VPS Deployment (Full Control)

### Step 1: Server Setup

**Recommended: Ubuntu 22.04 LTS**

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
```

### Step 2: Domain & DNS Configuration

1. **Point Domain to Server**
   ```
   Type: A
   Name: @
   Value: YOUR_SERVER_IP
   
   Type: A
   Name: www
   Value: YOUR_SERVER_IP
   ```

2. **Verify DNS Propagation**
   ```bash
   dig mapcsv.com
   # Should return your server IP
   ```

### Step 3: SSL Certificate (Let's Encrypt)

```bash
# Obtain SSL certificate
sudo certbot --nginx -d mapcsv.com -d www.mapcsv.com

# Certbot will:
# 1. Verify domain ownership
# 2. Install certificate
# 3. Configure Nginx automatically
# 4. Set up auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 4: Nginx Configuration

Create `/etc/nginx/sites-available/mapcsv.com`:

```nginx
server {
    listen 80;
    server_name mapcsv.com www.mapcsv.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mapcsv.com www.mapcsv.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/mapcsv.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mapcsv.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Proxy to Node.js app
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

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/mapcsv.com /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### Step 5: Application Setup

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/csv-column-mapper.git
cd csv-column-mapper

# Install dependencies
npm install

# Create .env file
sudo nano .env
# Paste all environment variables (see Step 2 above)

# Build application
npm run build

# Start with PM2
pm2 start build/index.js --name csv-mapper
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot
```

### Step 6: Environment Variables

Create `/var/www/csv-column-mapper/.env`:

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_your-production-key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-production-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Prices
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxx
STRIPE_PRICE_LIFETIME=price_xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@mapcsv.com

# App
PUBLIC_APP_URL=https://mapcsv.com
NODE_ENV=production
PORT=3000
```

### Step 7: Database Migration

Same as Option 1, Step 3.

### Step 8: Stripe & Email Setup

Same as Option 1, Steps 4-5.

---

## Security Checklist

### ✅ SSL/TLS
- [ ] SSL certificate installed and valid
- [ ] HTTPS redirect configured (HTTP → HTTPS)
- [ ] TLS 1.2+ enforced
- [ ] HSTS header enabled
- [ ] Certificate auto-renewal configured

### ✅ Environment Variables
- [ ] All secrets stored in environment variables (not in code)
- [ ] `.env` file excluded from git (check `.gitignore`)
- [ ] Production keys different from development keys
- [ ] No API keys committed to repository

### ✅ Database Security
- [ ] Supabase RLS policies enabled
- [ ] Database connection uses SSL
- [ ] Anon key is public-safe (RLS protects data)
- [ ] Service role key never exposed to client

### ✅ Application Security
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (via Nginx or Vercel)
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS protection headers set

### ✅ Monitoring & Logging
- [ ] Error tracking configured (Sentry recommended)
- [ ] Application logs monitored
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] SSL certificate expiration alerts

---

## Post-Deployment Verification

### 1. SSL Test
```bash
# Check SSL certificate
openssl ssl_client -connect mapcsv.com:443 -showcerts

# Online SSL test
https://www.ssllabs.com/ssltest/analyze.html?d=mapcsv.com
# Should get A or A+ rating
```

### 2. Application Tests
- [ ] Homepage loads: https://mapcsv.com
- [ ] SSL certificate shows as valid (green lock)
- [ ] Authentication works (signup/login)
- [ ] CSV upload works
- [ ] Column mapping works
- [ ] Export works
- [ ] Stripe checkout works (test with test card)
- [ ] Email notifications work

### 3. API Tests
```bash
# Test API endpoint
curl https://mapcsv.com/api/auth/session

# Test health endpoint (if exists)
curl https://mapcsv.com/api/health
```

### 4. Performance Test
```bash
# Lighthouse test
# Visit: https://pagespeed.web.dev/
# Enter: https://mapcsv.com
# Should score 90+ on all metrics
```

---

## Maintenance

### SSL Certificate Renewal
```bash
# Automatic (Vercel): Handled automatically
# Manual (VPS): Certbot auto-renewal runs daily
# Check renewal: sudo certbot renew --dry-run
```

### Application Updates
```bash
# Vercel: Automatic on git push
# VPS:
cd /var/www/csv-column-mapper
git pull
npm install
npm run build
pm2 restart csv-mapper
```

### Backup Strategy
- **Database**: Supabase automatic backups (enable in dashboard)
- **Code**: Git repository
- **Environment**: Store `.env` securely (password manager, secrets manager)

---

## Troubleshooting

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs csv-mapper

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application port
sudo netstat -tlnp | grep 3000
```

### Database Connection Issues
- Verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify RLS policies allow access

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for delivery logs
- Verify domain DNS records (SPF, DKIM)

---

## Quick Start Commands

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add PUBLIC_SUPABASE_URL production
# Repeat for all variables
```

### VPS Deployment
```bash
# Initial setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# SSL setup
sudo certbot --nginx -d mapcsv.com -d www.mapcsv.com

# Deploy app
cd /var/www/csv-column-mapper
npm install
npm run build
pm2 start build/index.js --name csv-mapper
pm2 save
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs

---

**Last Updated**: 2025-01-19
**Status**: Production Ready
