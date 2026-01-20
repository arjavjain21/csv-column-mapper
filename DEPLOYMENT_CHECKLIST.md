# CSV Column Mapper - Deployment Checklist

**Use this checklist to ensure a smooth deployment process.**

---

## Pre-Deployment Checks

### Code & Build
- [x] **Build compiles successfully** - ✅ Verified
- [x] **No runtime blocking errors** - ✅ Fixed all critical issues
- [x] **Git status reviewed** - ✅ 9 modified files, 8 new files
- [ ] **All changes committed** - ⏳ Pending
- [ ] **Create deployment commit** - ⏳ Pending

### Environment Configuration
- [x] **Supabase configured** - ✅ Keys present in .env
- [x] **Stripe keys available** - ✅ Test keys present
- [ ] **Stripe products created** - ⚠️ Price IDs are placeholders
- [ ] **Database migration run** - ⚠️ Needs verification
- [ ] **Vercel project created** - ⏳ Pending

---

## Step 1: Prepare for Deployment

### 1.1 Review & Commit Changes
```bash
# Check current status
git status

# Review modified files
git diff --stat

# Add all changes
git add .

# Create deployment commit
git commit -m "fix: Resolve critical build issues and prepare for deployment

- Fixed import path errors in mappingCloudSync
- Updated Stripe API version to 2025-12-15.clover
- Added Database types to Supabase clients
- Fixed tier middleware type safety
- Changed 'enterprise' to 'lifetime' plan
- Fixed module-level Supabase initialization
- Added null checks for pricing fields

Build Status: ✅ PASSING
Tests: Pending
Deployment: Staging"
```

### 1.2 Create Git Tag (Optional)
```bash
git tag -a v0.1.0-mvp -m "MVP Release - Phase 1 Complete"
git push origin main --tags
```

---

## Step 2: Database Setup

### 2.1 Run Migration in Supabase
1. Go to: https://app.supabase.com/project/qxytijsztnxcnxwkwtjf/sql
2. Copy contents of: `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL
4. Verify tables created:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

### 2.2 Verify RLS Policies
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Should show true for: user_profiles, mappings, etc.
```

### 2.3 Test Database Connection
- Check if `.env` DATABASE_URL works
- Test: `psql $DATABASE_URL -c "SELECT 1"`

---

## Step 3: Stripe Configuration

### 3.1 Create Products & Prices
Go to: https://dashboard.stripe.com/test/products

Create the following products:

**Pro - Monthly**
- Name: "Pro (Monthly)"
- Price: $29.00 USD/month
- recurring: interval="month"
- Copy Price ID → `STRIPE_PRICE_PRO_MONTHLY`

**Pro - Yearly**
- Name: "Pro (Yearly)"
- Price: $290.00 USD/year
- recurring: interval="year"
- Copy Price ID → `STRIPE_PRICE_PRO_YEARLY`

**Business - Monthly**
- Name: "Business (Monthly)"
- Price: $99.00 USD/month
- recurring: interval="month"
- Copy Price ID → `STRIPE_PRICE_BUSINESS_MONTHLY`

**Business - Yearly**
- Name: "Business (Yearly)"
- Price: $990.00 USD/year
- recurring: interval="year"
- Copy Price ID → `STRIPE_PRICE_BUSINESS_YEARLY`

**Lifetime**
- Name: "Lifetime Access"
- Price: $199.00 USD (one-time)
- type: "one_time"
- Copy Price ID → `STRIPE_PRICE_LIFETIME`

### 3.2 Update Environment Variables
Replace placeholder price IDs in `.env`:
```bash
STRIPE_PRICE_PRO_MONTHLY=price_actual_id_from_stripe
STRIPE_PRICE_PRO_YEARLY=price_actual_id_from_stripe
STRIPE_PRICE_BUSINESS_MONTHLY=price_actual_id_from_stripe
STRIPE_PRICE_BUSINESS_YEARLY=price_actual_id_from_stripe
STRIPE_PRICE_LIFETIME=price_actual_id_from_stripe
```

---

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### 4.2 Login to Vercel
```bash
vercel login
```

### 4.3 Deploy Project
```bash
# Deploy to preview (staging)
vercel

# Answer prompts:
# - Set up and deploy? Y
# - Which scope? (Select your account)
# - Link to existing project? N (new project)
# - Project name: csv-column-mapper
# - Directory: ./ (current)
# - Override settings? N

# Wait for deployment...
# ✅ Preview URL will be provided
```

### 4.4 Configure Environment Variables in Vercel

**Option A: Via CLI**
```bash
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_PRO_MONTHLY
vercel env add STRIPE_PRICE_PRO_YEARLY
vercel env add STRIPE_PRICE_BUSINESS_MONTHLY
vercel env add STRIPE_PRICE_BUSINESS_YEARLY
vercel env add STRIPE_PRICE_LIFETIME
```

**Option B: Via Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select: csv-column-mapper project
3. Go to: Settings → Environment Variables
4. Add each variable with production value
5. Select: **Production**, **Preview**, **Development** environments

### 4.5 Deploy to Production
```bash
# Production deployment
vercel --prod

# Or push to main branch if auto-deploy is enabled
git push origin main
```

---

## Step 5: Post-Deployment Configuration

### 5.1 Configure Stripe Webhook
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click: "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook secret: `whsec_...`
6. Update Vercel environment variable: `STRIPE_WEBHOOK_SECRET`
7. Redeploy: `vercel --prod`

### 5.2 Update Environment Variables
```bash
# Update app URL
vercel env add PUBLIC_APP_URL production
# Value: https://your-domain.vercel.app
```

---

## Step 6: Verify Deployment

### 6.1 Smoke Test
- [ ] Homepage loads: `https://your-domain.vercel.app/`
- [ ] Marketing pages accessible
- [ ] No console errors
- [ ] Assets loading correctly
- [ ] Responsive design works

### 6.2 Authentication Test
- [ ] Sign up page accessible
- [ ] Magic link email sends
- [ ] Login works
- [ ] Session persists
- [ ] Protected routes redirect correctly

### 6.3 Core Functionality Test
- [ ] Upload schema CSV
- [ ] Upload data CSV
- [ ] Columns parse correctly
- [ ] Mapping interface works
- [ ] Preview generates
- [ ] CSV downloads successfully

### 6.4 Stripe Test
- [ ] Pricing page loads
- [ ] Upgrade buttons work
- [ ] Redirects to Stripe checkout
- [ ] Payment completes (test mode)
- [ ] Webhook receives event
- [ ] User tier updates in database
- [ ] Premium features unlock

### 6.5 Cloud Features Test
- [ ] Can save mapping to cloud
- [ ] Can load saved mapping
- [ ] Dashboard shows analytics
- [ ] Templates accessible

---

## Step 7: Monitoring Setup

### 7.1 Vercel Analytics
- Go to: Vercel Dashboard → Analytics
- Enable: Web Vitals, Deployment Monitoring

### 7.2 Supabase Logs
- Go to: https://app.supabase.com/project/qxytijsztnxcnxwkwtjf/logs
- Monitor: Database queries, Auth events

### 7.3 Stripe Dashboard
- Go to: https://dashboard.stripe.com/test/dashboard
- Monitor: Payment events, webhook failures

---

## Step 8: Documentation

### 8.1 Update README
- [ ] Add deployed URL
- [ ] Update environment setup instructions
- [ ] Add known issues/limitations
- [ ] Document deployment process

### 8.2 Create Operations Runbook
- [ ] Document rollback procedure
- [ ] Document database backup process
- [ ] List common issues and solutions
- [ ] Create troubleshooting guide

---

## Step 9: Security Checklist

### 9.1 Secrets Management
- [ ] No secrets in code (✅ Verified)
- [ ] All secrets in environment variables
- [ ] .env in .gitignore (✅ Verified)
- [ ] Production secrets differ from dev
- [ ] Webhook secret configured
- [ ] API keys have appropriate permissions

### 9.2 Database Security
- [ ] RLS policies enabled
- [ ] Service role key not exposed
- [ ] Anon key has limited permissions
- [ ] Backups enabled
- [ ] No public access to sensitive tables

### 9.3 Stripe Security
- [ ] Using test keys for staging
- [ ] Webhook signature verified
- [ ] Webhook endpoint is HTTPS only
- [ ] Price IDs are not hardcoded in frontend

---

## Step 10: Launch Preparation

### 10.1 Pre-Launch (Before Production)
- [ ] All critical tests pass
- [ ] Performance is acceptable
- [ ] Mobile experience tested
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Posthog/GA)
- [ ] Backup process documented
- [ ] Support email configured

### 10.2 Launch Day
- [ ] Final deployment to production
- [ ] Live payment keys configured
- [ ] Webhooks reconfigured for production
- [ ] DNS/SSL verified
- [ ] Monitoring active
- [ ] Team on standby

---

## Rollback Procedure

If critical issues are found:

### Quick Rollback
```bash
vercel rollback [deployment-url]
```

### Full Rollback
```bash
# Revert to previous commit
git revert HEAD

# Redeploy
vercel --prod
```

### Database Rollback
- Supabase has point-in-time recovery
- Contact: https://app.supabase.com/project/qxytijsztnxcnxwkwtjf/support

---

## Support Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://stripe.com/support

---

## Notes

- This deployment is for **STAGING/TESTING**
- Do NOT promote to production without thorough testing
- All payment keys are currently in **TEST MODE**
- Switch to live keys only after successful staging test

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Deployment URL:** _____________
**Status:** _____________
