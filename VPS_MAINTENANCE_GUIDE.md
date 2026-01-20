# VPS Maintenance Guide - Who Does What?

## 🎯 Quick Answer: Maintenance Responsibilities

### You Handle (VPS Owner)
- ✅ Application updates (pull code, rebuild, restart)
- ✅ System updates (security patches)
- ✅ Monitoring (check logs, uptime)
- ✅ SSL certificate verification (auto-renewal, but verify)
- ✅ Firewall configuration
- ✅ Backups (code in Git, database in Supabase)

### Automated (No Action Needed)
- ✅ SSL certificate renewal (Certbot auto-renews)
- ✅ PM2 auto-restart (if app crashes)
- ✅ Database backups (Supabase handles)

### Third-Party Services Handle
- ✅ Database hosting & scaling (Supabase)
- ✅ Payment processing (Stripe)
- ✅ Email delivery (Resend)
- ✅ Domain DNS (Your registrar)

---

## 📅 Maintenance Schedule

### Daily (2 minutes) - Optional
```bash
# Quick health check
pm2 status
# Should show: csv-mapper | online
```

### Weekly (5 minutes) - Recommended
```bash
# Check for errors in logs
pm2 logs csv-mapper --lines 20

# Check disk space
df -h
# Should show <80% usage

# Check if site is up
curl -I https://mapcsv.com
# Should return 200 OK
```

### Monthly (30 minutes) - Required
```bash
# 1. System updates
sudo apt update && sudo apt upgrade -y

# 2. Application updates
cd ~/apps/csv-column-mapper
git pull origin main
npm install
npm run build
pm2 restart csv-mapper

# 3. Verify SSL renewal
sudo certbot renew --dry-run
# Should say: "Cert not due for renewal"

# 4. Check logs for issues
pm2 logs csv-mapper --lines 50
```

### Quarterly (1 hour) - Recommended
- Review security patches
- Update Node.js if new LTS available
- Review application performance
- Check for dependency updates

---

## 🔄 Update Process (Step-by-Step)

### When You Want to Update the Application

**Step 1: SSH into Server**
```bash
ssh deploy@your-server-ip
```

**Step 2: Navigate to App**
```bash
cd ~/apps/csv-column-mapper
```

**Step 3: Pull Latest Code**
```bash
git pull origin main
```

**Step 4: Install Dependencies**
```bash
npm install
```

**Step 5: Rebuild**
```bash
npm run build
```

**Step 6: Restart**
```bash
pm2 restart csv-mapper
```

**Step 7: Verify**
```bash
pm2 logs csv-mapper --lines 20
# Check for errors

# Test in browser
# Visit: https://mapcsv.com
```

**Total Time:** ~5 minutes

---

## 🤖 Automated Updates (Optional)

### Set Up GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Auto Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
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
            pm2 logs csv-mapper --lines 10
```

**Setup:**
1. Go to GitHub → Settings → Secrets → Actions
2. Add secrets:
   - `VPS_HOST`: your-server-ip
   - `VPS_USER`: deploy
   - `VPS_SSH_KEY`: your private SSH key

**Result:** Every `git push` automatically deploys!

---

## 🛡️ Security Maintenance

### Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades
# Select: Yes

# Verify
sudo systemctl status unattended-upgrades
```

**Result:** Security patches install automatically!

### Firewall Configuration

```bash
# Check status
sudo ufw status

# Should show:
# Status: active
# 22/tcp    ALLOW
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

---

## 📊 Monitoring Setup (Free)

### Option 1: UptimeRobot (Recommended)

1. Sign up: https://uptimerobot.com (free)
2. Add monitor:
   - URL: https://mapcsv.com
   - Type: HTTP(s)
   - Interval: 5 minutes
3. Get email alerts if site goes down

### Option 2: PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Shows:
# - CPU usage
# - Memory usage
# - Logs
# - Process status
```

### Option 3: Simple Health Check Script

Create `~/check-health.sh`:

```bash
#!/bin/bash
if ! curl -f https://mapcsv.com/api/auth/session > /dev/null 2>&1; then
    echo "Site is down! Restarting..."
    pm2 restart csv-mapper
    # Optional: Send email alert
fi
```

Add to crontab (check every 5 minutes):
```bash
crontab -e
# Add: */5 * * * * /home/deploy/check-health.sh
```

---

## 💾 Backup Strategy

### Code Backup
**Status:** ✅ Automatic (Git repository)
- Code is in Git
- Every commit is a backup
- No action needed

### Database Backup
**Status:** ✅ Automatic (Supabase)
- Supabase handles backups
- Can restore from dashboard
- No action needed

### Environment Variables Backup
**Status:** ⚠️ Manual (You handle)

**Store securely:**
- Password manager (1Password, LastPass)
- Encrypted file
- Never commit to Git!

**Backup command:**
```bash
# Encrypt and backup .env
tar -czf env-backup-$(date +%Y%m%d).tar.gz .env
# Store securely (not on server!)
```

---

## 🚨 Emergency Procedures

### Site is Down

**Step 1: Check PM2**
```bash
pm2 status
# If stopped, restart:
pm2 restart csv-mapper
```

**Step 2: Check Logs**
```bash
pm2 logs csv-mapper --lines 50
# Look for errors
```

**Step 3: Check Nginx**
```bash
sudo systemctl status nginx
# If stopped, restart:
sudo systemctl restart nginx
```

**Step 4: Check Disk Space**
```bash
df -h
# If full, clean up:
sudo apt autoremove
sudo apt autoclean
```

**Step 5: Check Memory**
```bash
free -h
# If low, restart app:
pm2 restart csv-mapper
```

### SSL Certificate Expired

**Check:**
```bash
sudo certbot certificates
```

**Renew:**
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Application Crashes Frequently

**Check logs:**
```bash
pm2 logs csv-mapper --lines 100
```

**Common causes:**
- Out of memory → Upgrade VPS
- Database connection issues → Check Supabase
- Environment variables missing → Check .env file

---

## 📈 Scaling Considerations

### When to Upgrade VPS

**Upgrade when:**
- Memory usage consistently >80%
- CPU usage consistently >80%
- Slow response times
- Frequent crashes

**Upgrade options:**
- 1GB → 2GB RAM (+$6/month)
- 2GB → 4GB RAM (+$12/month)

**How to upgrade:**
1. Create snapshot (backup)
2. Resize VPS in dashboard
3. Reboot server
4. Verify everything works

---

## ✅ Maintenance Checklist

### Daily (Optional)
- [ ] Quick PM2 status check

### Weekly
- [ ] Check application logs
- [ ] Check disk space
- [ ] Verify site is accessible

### Monthly
- [ ] System updates
- [ ] Application updates
- [ ] SSL certificate check
- [ ] Review logs for errors

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Dependency updates
- [ ] Backup verification

---

## 🎓 Learning Resources

- **PM2:** https://pm2.keymetrics.io/docs/
- **Nginx:** https://nginx.org/en/docs/
- **Certbot:** https://certbot.eff.org/docs/
- **Ubuntu Server:** https://ubuntu.com/server/docs

---

## 💡 Pro Tips

1. **Use SSH keys** (not passwords) for security
2. **Set up monitoring** (UptimeRobot - free)
3. **Enable auto-updates** for security patches
4. **Keep .env file secure** (never commit to Git)
5. **Document everything** (passwords, IPs, etc.)
6. **Test updates** on staging before production
7. **Monitor logs regularly** (catch issues early)

---

**Remember:** VPS gives you full control, but requires ~30 minutes/month maintenance. It's worth it for the flexibility and cost savings!
