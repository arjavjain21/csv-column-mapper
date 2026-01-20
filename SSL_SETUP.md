# SSL Setup for mapcsv.com

## Prerequisites

- ✅ DNS A records configured (mapcsv.com → 137.74.43.93)
- ✅ DNS propagation verified
- ✅ Nginx configured for mapcsv.com
- ✅ Application running on port 3006

## Step 1: Verify DNS is Working

```bash
# Check DNS resolution
dig mapcsv.com +short
# Should show: 137.74.43.93

# Or
nslookup mapcsv.com
# Should show: 137.74.43.93
```

**If DNS doesn't show your IP, wait longer or check your DNS settings.**

## Step 2: Obtain SSL Certificate

Run Certbot to get SSL certificate:

```bash
sudo certbot --nginx -d mapcsv.com -d www.mapcsv.com
```

**What Certbot will do:**
1. Verify domain ownership (via DNS/HTTP challenge)
2. Obtain SSL certificate from Let's Encrypt
3. Automatically update Nginx configuration
4. Set up auto-renewal

**Follow the prompts:**
- Enter email for renewal notices
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

## Step 3: Verify SSL is Working

After Certbot completes:

```bash
# Test HTTPS
curl -I https://mapcsv.com

# Check certificate
openssl ssl_client -connect mapcsv.com:443 -showcerts

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=mapcsv.com
```

## Step 4: Test Auto-Renewal

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check renewal status
sudo certbot certificates
```

## Troubleshooting

### If Certbot fails:

1. **DNS not propagated:**
   - Wait longer (can take up to 48 hours)
   - Check DNS: `dig mapcsv.com`
   - Verify A records in your registrar

2. **Port 80 not accessible:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

3. **Nginx not running:**
   ```bash
   sudo systemctl status nginx
   sudo systemctl start nginx
   ```

4. **Domain already has certificate:**
   - Certbot will offer to renew/replace
   - Follow prompts

## After SSL is Configured

Your site will be accessible at:
- ✅ https://mapcsv.com
- ✅ https://www.mapcsv.com
- ✅ HTTP will redirect to HTTPS (if you chose that option)

## Verify Everything Works

```bash
# Test homepage
curl https://mapcsv.com

# Test API endpoint
curl https://mapcsv.com/api/auth/session

# Check SSL certificate
curl -vI https://mapcsv.com 2>&1 | grep -i ssl
```

## Next Steps

After SSL is working:
1. Test user signup/login
2. Test CSV upload
3. Test column mapping
4. Verify data saves to Supabase
5. Test all export formats

---

**Your application is now production-ready! 🚀**
