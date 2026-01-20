# Deployment Checklist for csvmap.com

Use this checklist to ensure secure deployment with SSL.

## Pre-Deployment

### Domain & DNS
- [ ] Domain `csvmap.com` registered
- [ ] DNS A record pointing to server IP (or Vercel)
- [ ] DNS CNAME for www.csvmap.com
- [ ] DNS propagation verified (`dig csvmap.com`)

### Infrastructure Choice
- [ ] **Option A: Vercel** (Easiest, auto-SSL)
- [ ] **Option B: VPS** (Full control, manual SSL)

---

## Step 1: SSL Certificate

### Vercel (Automatic)
- [ ] Domain added to Vercel project
- [ ] DNS records configured per Vercel instructions
- [ ] SSL certificate auto-provisioned (wait 24-48h)
- [ ] SSL verified: https://www.ssllabs.com/ssltest/analyze.html?d=csvmap.com

### VPS (Let's Encrypt)
- [ ] Certbot installed: `sudo apt install certbot python3-certbot-nginx`
- [ ] SSL certificate obtained: `sudo certbot --nginx -d csvmap.com -d www.csvmap.com`
- [ ] Auto-renewal tested: `sudo certbot renew --dry-run`
- [ ] SSL verified: https://www.ssllabs.com/ssltest/analyze.html?d=csvmap.com

---

## Step 2: Environment Variables

### Required Variables (Production)
- [ ] `PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `STRIPE_SECRET_KEY` - Stripe **LIVE** secret key (`sk_live_...`)
- [ ] `PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe **LIVE** publishable key (`pk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- [ ] `STRIPE_PRICE_PRO_MONTHLY` - Price ID
- [ ] `STRIPE_PRICE_PRO_YEARLY` - Price ID
- [ ] `STRIPE_PRICE_BUSINESS_MONTHLY` - Price ID
- [ ] `STRIPE_PRICE_BUSINESS_YEARLY` - Price ID
- [ ] `STRIPE_PRICE_LIFETIME` - Price ID
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `EMAIL_FROM` - `noreply@csvmap.com`
- [ ] `PUBLIC_APP_URL` - `https://csvmap.com`

### Security Check
- [ ] All variables use **production** keys (not test keys)
- [ ] No secrets committed to git
- [ ] `.env` file excluded from repository
- [ ] Environment variables stored securely

---

## Step 3: Database Setup

### Supabase Migration
- [ ] Run `001_initial_schema.sql` in Supabase SQL Editor
- [ ] Run `002_subscription_usage.sql` in Supabase SQL Editor
- [ ] Verify tables created:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
- [ ] Verify RLS policies active:
  ```sql
  SELECT tablename, policyname FROM pg_policies 
  WHERE schemaname = 'public';
  ```

### Database Security
- [ ] RLS enabled on all tables
- [ ] Service role key never exposed to client
- [ ] Database connection uses SSL
- [ ] Backup strategy configured in Supabase

---

## Step 4: Stripe Configuration

### Products Setup (Live Mode)
- [ ] Switch Stripe Dashboard to **Live Mode**
- [ ] Create product: "Pro Monthly" ($29/month)
- [ ] Create product: "Pro Yearly" ($290/year)
- [ ] Create product: "Business Monthly" ($99/month)
- [ ] Create product: "Business Yearly" ($990/year)
- [ ] Create product: "Lifetime" ($199 one-time)
- [ ] Copy all Price IDs (start with `price_`)
- [ ] Add Price IDs to environment variables

### Webhook Configuration
- [ ] Create webhook endpoint: `https://csvmap.com/api/stripe/webhook`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Copy webhook signing secret
- [ ] Add to environment variables as `STRIPE_WEBHOOK_SECRET`
- [ ] Test webhook with Stripe CLI or dashboard

---

## Step 5: Email Configuration (Resend)

### Domain Verification
- [ ] Create Resend account
- [ ] Add domain: `csvmap.com`
- [ ] Add DNS records (SPF, DKIM, DMARC) as instructed
- [ ] Verify domain in Resend dashboard

### API Setup
- [ ] Generate API key in Resend
- [ ] Add to environment variables as `RESEND_API_KEY`
- [ ] Set `EMAIL_FROM=noreply@csvmap.com`
- [ ] Test email sending

---

## Step 6: Application Deployment

### Vercel Deployment
- [ ] Repository connected to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] Deployed to production
- [ ] Custom domain configured

### VPS Deployment
- [ ] Code cloned/pushed to server
- [ ] Dependencies installed: `npm install`
- [ ] Application built: `npm run build`
- [ ] PM2 process started: `pm2 start build/index.js --name csv-mapper`
- [ ] PM2 auto-start configured: `pm2 save && pm2 startup`
- [ ] Nginx configured and running
- [ ] Firewall configured (ports 80, 443 open)

---

## Step 7: Security Hardening

### SSL/TLS
- [ ] HTTPS redirect configured (HTTP → HTTPS)
- [ ] TLS 1.2+ enforced
- [ ] HSTS header enabled
- [ ] Certificate auto-renewal configured
- [ ] SSL Labs rating: A or A+

### Security Headers
- [ ] `Strict-Transport-Security` header set
- [ ] `X-Frame-Options` header set
- [ ] `X-Content-Type-Options` header set
- [ ] `X-XSS-Protection` header set
- [ ] `Referrer-Policy` header set

### Application Security
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS protection in place

---

## Step 8: Post-Deployment Verification

### Basic Functionality
- [ ] Homepage loads: https://csvmap.com
- [ ] SSL certificate valid (green lock icon)
- [ ] No mixed content warnings
- [ ] All pages accessible

### Authentication
- [ ] Sign up flow works
- [ ] Magic link email received
- [ ] Login works
- [ ] Session persists
- [ ] Logout works

### Core Features
- [ ] CSV file upload works
- [ ] Column mapping interface works
- [ ] Preview displays correctly
- [ ] Export/download works
- [ ] Transformations work (if implemented)
- [ ] Validation works (if implemented)

### Payments
- [ ] Pricing page displays
- [ ] Stripe checkout opens
- [ ] Test payment succeeds (use test card: 4242 4242 4242 4242)
- [ ] Webhook receives events
- [ ] User tier updates after payment

### Email
- [ ] Welcome email sent on signup
- [ ] Processing complete email sent
- [ ] Error email sent on failures

### Performance
- [ ] Lighthouse score: 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] Page load time < 3 seconds
- [ ] No console errors

---

## Step 9: Monitoring & Maintenance

### Monitoring Setup
- [ ] Error tracking configured (Sentry recommended)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Application logs monitored
- [ ] SSL certificate expiration alerts

### Backup Strategy
- [ ] Database backups enabled (Supabase)
- [ ] Code backed up in Git repository
- [ ] Environment variables backed up securely
- [ ] Backup restoration tested

### Maintenance Plan
- [ ] SSL renewal automated
- [ ] Application update process documented
- [ ] Rollback plan documented
- [ ] Emergency contact information available

---

## Quick Verification Commands

### SSL Check
```bash
# Check certificate
openssl ssl_client -connect csvmap.com:443 -showcerts

# Online test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=csvmap.com
```

### Application Health
```bash
# Test API
curl https://csvmap.com/api/auth/session

# Check response headers
curl -I https://csvmap.com
```

### Performance Test
```bash
# Lighthouse (online)
# Visit: https://pagespeed.web.dev/
# Enter: https://csvmap.com
```

---

## Troubleshooting

### SSL Issues
- Check certificate: `sudo certbot certificates`
- Renew manually: `sudo certbot renew`
- Check Nginx config: `sudo nginx -t`

### Application Not Starting
- Check PM2 logs: `pm2 logs csv-mapper`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check port: `sudo netstat -tlnp | grep 3000`

### Database Connection
- Verify Supabase URL and keys
- Check Supabase project status
- Verify RLS policies

### Email Not Sending
- Check Resend dashboard logs
- Verify DNS records (SPF, DKIM)
- Test API key validity

---

## Final Checklist

Before going live:
- [ ] All environment variables set
- [ ] SSL certificate valid
- [ ] Database migrated
- [ ] Stripe products created (live mode)
- [ ] Webhook configured
- [ ] Email domain verified
- [ ] Security headers configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated

---

**Status**: ⏳ Ready for deployment
**Last Updated**: 2025-01-19
