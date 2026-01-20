# 🚀 VPS Deployment Quick Start

Quick reference guide for deploying to OVH Cloud VPS.

## Prerequisites

```bash
# On VPS - One-time setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx
sudo npm install -g pm2
```

## Initial Deployment

### 1. Transfer Files
```bash
# From local machine
cd "/Users/arjavjain/Downloads/hyperke/Automations/Web Apps/csv-column-mapper"
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'build' \
  --exclude '.svelte-kit' ./ hyperke-vps:~/apps/csv-column-mapper/
```

### 2. On VPS - Setup
```bash
ssh hyperke-vps
cd ~/apps/csv-column-mapper

# Install adapter-node
npm install --save-dev @sveltejs/adapter-node

# Update svelte.config.js (see full guide)

# Create .env file with your credentials
nano .env

# Install dependencies
npm install

# Build
npm run build
```

### 3. Configure PM2
```bash
# Create ecosystem.config.js (see full guide)
nano ecosystem.config.js

# Start app
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions
```

### 4. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/csv-column-mapper
# Add configuration (see full guide)

sudo ln -s /etc/nginx/sites-available/csv-column-mapper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Updates

```bash
# From local machine - use helper script
./vps-deploy.sh

# Or manually:
rsync -avz --exclude 'node_modules' --exclude '.git' \
  --exclude 'build' --exclude '.svelte-kit' \
  ./ hyperke-vps:~/apps/csv-column-mapper/

# On VPS
ssh hyperke-vps
cd ~/apps/csv-column-mapper
npm install
npm run build
pm2 restart csv-column-mapper
```

## Useful Commands

```bash
# Check app status
pm2 status
pm2 logs csv-column-mapper

# Restart app
pm2 restart csv-column-mapper

# Nginx
sudo nginx -t
sudo systemctl reload nginx

# Check logs
pm2 logs csv-column-mapper --lines 50
sudo tail -f /var/log/nginx/error.log
```

## Environment Variables Required

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

## Troubleshooting

- **502 Bad Gateway**: Check `pm2 status` and `pm2 logs`
- **App won't start**: Check `.env` file and build output
- **SSL issues**: Run `sudo certbot renew`
- **Port in use**: `sudo lsof -i :3000`

For detailed instructions, see `VPS_DEPLOYMENT_GUIDE.md`
