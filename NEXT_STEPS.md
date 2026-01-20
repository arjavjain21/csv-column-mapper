# Next Steps After Database Migration

## ✅ Step 1: Verify Migration (DONE)

You've run the SQL migration. Let's verify it worked:

### Quick Verification

Run this in Supabase SQL Editor to check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles',
    'mappings',
    'mapping_versions',
    'templates',
    'teams',
    'team_members',
    'subscription_periods',
    'usage_records',
    'sales_leads'
)
ORDER BY table_name;
```

**Expected:** Should return 9 rows (all table names)

---

## 🔄 Step 2: Configure DNS (REQUIRED)

Your application is running on port **3006**, but it needs DNS to be accessible via `csvmap.com`.

### DNS Configuration

1. **Go to your domain registrar** (where you bought csvmap.com)
2. **Add TWO A Records:**
   - **Record 1:** `@` → `137.74.43.93` (root domain)
   - **Record 2:** `www` → `137.74.43.93` (www subdomain)
3. **Wait 15-60 minutes** for DNS propagation
4. **Verify DNS:**
   ```bash
   dig csvmap.com
   # Should show: 137.74.43.93
   ```

**See `DNS_SETUP_GUIDE.md` for detailed instructions.**

---

## 🔒 Step 3: Setup SSL Certificate (After DNS)

Once DNS propagates, run:

```bash
sudo certbot --nginx -d csvmap.com -d www.csvmap.com
```

This will:
- Obtain SSL certificate from Let's Encrypt
- Automatically configure Nginx for HTTPS
- Set up auto-renewal

**Note:** Certbot requires DNS to be working first.

---

## ✅ Step 4: Verify Application is Running

Check current status:

```bash
# Check PM2 status
pm2 status | grep csvmap

# Check if app responds
curl http://localhost:3006

# Check Nginx config
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx
```

---

## 🧪 Step 5: Test Application

After DNS and SSL are configured:

1. **Visit:** https://csvmap.com
2. **Test Authentication:**
   - Try signing up with email
   - Check if magic link works
   - Verify user profile is created in Supabase
3. **Test Core Features:**
   - Upload CSV file
   - Map columns
   - Apply transformations
   - Export data
4. **Check Database:**
   - Verify user appears in `user_profiles` table
   - Verify mappings are saved in `mappings` table

---

## 📋 Current Status Checklist

- [x] Application built and running on port 3006
- [x] PM2 configured and monitoring
- [x] Nginx configured (waiting for DNS)
- [x] Database migrations completed
- [ ] DNS configured (csvmap.com → 137.74.43.93)
- [ ] SSL certificate obtained
- [ ] Application accessible via HTTPS
- [ ] Authentication tested
- [ ] Core features tested

---

## 🚨 Troubleshooting

### If migration had errors:
- Check Supabase logs for specific error messages
- Some errors are OK (like "already exists" if you ran it twice)
- Verify tables exist using the verification query above

### If DNS not working:
- Wait longer (can take up to 48 hours, usually 15-60 min)
- Check DNS propagation: https://www.whatsmydns.net/#A/csvmap.com
- Verify A records are correct in your registrar

### If SSL fails:
- DNS must be working first
- Port 80 must be open (for Let's Encrypt verification)
- Check: `sudo ufw status` (should allow 80/tcp and 443/tcp)

---

## 🎯 Quick Commands Reference

```bash
# Check application status
pm2 status csvmap
pm2 logs csvmap

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check DNS (after configuring)
dig csvmap.com
nslookup csvmap.com

# Setup SSL (after DNS works)
sudo certbot --nginx -d csvmap.com -d www.csvmap.com

# Test application
curl https://csvmap.com
curl https://csvmap.com/api/auth/session
```

---

## 📝 What's Already Done

✅ Git repository initialized and pushed to GitHub  
✅ Application built successfully  
✅ Running on free port 3006 (no conflicts)  
✅ PM2 configured with auto-restart  
✅ Nginx configured and ready  
✅ Database migrations completed  
✅ Security headers configured  
✅ Rate limiting implemented  
✅ Unit tests created  

**You're almost there! Just need DNS and SSL.** 🚀
