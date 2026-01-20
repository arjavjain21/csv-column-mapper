# CSV Column Mapper - Testing Guide

**Deployment Status:** ✅ Code Ready for Deployment
**Build Status:** ✅ PASSING
**Next Step:** Deploy to Vercel and Test

---

## Quick Start Deployment

Since Vercel CLI is not currently installed, here are your deployment options:

### Option 1: Install Vercel CLI & Deploy (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Run the deployment script
./deploy.sh

# Or deploy manually:
vercel
```

**The deployment script will:**
- ✅ Check if you're logged in
- ✅ Verify .env file exists
- ✅ Test build locally
- ✅ Deploy to Vercel staging
- ✅ Provide next steps

### Option 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Connect your GitHub account
   - Import repository: `csv-column-mapper`

2. **Configure Project**
   - Framework Preset: SvelteKit
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.svelte-kit/output`

3. **Add Environment Variables**
   In Vercel Project Settings → Environment Variables, add:
   ```
   PUBLIC_SUPABASE_URL
   PUBLIC_SUPABASE_ANON_KEY
   STRIPE_SECRET_KEY
   PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_WEBHOOK_SECRET
   STRIPE_PRICE_PRO_MONTHLY
   STRIPE_PRICE_PRO_YEARLY
   STRIPE_PRICE_BUSINESS_MONTHLY
   STRIPE_PRICE_BUSINESS_YEARLY
   STRIPE_PRICE_LIFETIME
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your staging URL: `https://csv-column-mapper.vercel.app`

### Option 3: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git remote -v  # Check remote
   git push origin main  # Push changes
   ```

2. **Connect in Vercel**
   - Go to: https://vercel.com/new
   - Select: Import Git Repository
   - Choose: `csv-column-mapper`
   - Configure as above in Option 2

---

## Post-Deployment Steps

### Step 1: Set Up Database

1. **Go to Supabase SQL Editor**
   - URL: https://app.supabase.com/project/qxytijsztnxcnxwkwtjf/sql

2. **Run Migration**
   - Open: `supabase/migrations/001_initial_schema.sql`
   - Copy entire file contents
   - Paste into Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter

3. **Verify Tables Created**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

   Expected tables:
   - `user_profiles`
   - `mappings`
   - `mapping_versions`
   - `templates`
   - `teams`
   - `team_members`

### Step 2: Create Stripe Products

1. **Go to Stripe Dashboard** (Test Mode)
   - URL: https://dashboard.stripe.com/test/products

2. **Create Products**

   **Product 1: Pro Monthly**
   - Name: `Pro (Monthly)`
   - Description: `Cloud sync, templates, email support`
   - Price: `$29.00 USD/month`
   - Click "Save Product"
   - Copy the Price ID (looks like `price_1234...`)
   - Add to Vercel env vars as `STRIPE_PRICE_PRO_MONTHLY`

   **Product 2: Pro Yearly**
   - Name: `Pro (Yearly)`
   - Description: `Cloud sync, templates, email support (Save 20%)`
   - Price: `$290.00 USD/year`
   - Copy Price ID → `STRIPE_PRICE_PRO_YEARLY`

   **Product 3: Business Monthly**
   - Name: `Business (Monthly)`
   - Description: `Team collaboration, API access, priority support`
   - Price: `$99.00 USD/month`
   - Copy Price ID → `STRIPE_PRICE_BUSINESS_MONTHLY`

   **Product 4: Business Yearly**
   - Name: `Business (Yearly)`
   - Description: `Team collaboration, API access, priority support (Save 20%)`
   - Price: `$990.00 USD/year`
   - Copy Price ID → `STRIPE_PRICE_BUSINESS_YEARLY`

   **Product 5: Lifetime**
   - Name: `Lifetime Access`
   - Description: `One-time payment for lifetime Pro access`
   - Price: `$199.00 USD` (one-time)
   - Copy Price ID → `STRIPE_PRICE_LIFETIME`

3. **Update Vercel Environment Variables**
   - Go to: Vercel Dashboard → Project → Settings → Environment Variables
   - Update each price ID with the actual values from Stripe
   - Redeploy after updating

### Step 3: Configure Stripe Webhooks

1. **Create Webhook Endpoint**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click: "Add endpoint"
   - Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Copy Webhook Secret**
   - After creating, click on the webhook
   - Click: "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_...`)

3. **Update Environment Variable**
   - In Vercel: Add/Update `STRIPE_WEBHOOK_SECRET`
   - Value: The webhook secret you copied
   - Redeploy

---

## Testing Checklist

### Critical Flows (Must Test)

#### 1. Homepage & Marketing

**Test:** Visit homepage
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Navigation links work
- [ ] "Get Started Free" button works
- [ ] Responsive on mobile
- [ ] Dark mode toggle works

**URL:** `https://your-domain.vercel.app/`

---

#### 2. User Authentication

**Test:** Sign up new user
- [ ] Click "Get Started" or go to `/auth`
- [ ] Enter email address
- [ ] Click "Send Magic Link"
- [ ] Check email for magic link
- [ ] Click magic link in email
- [ ] Redirected to dashboard
- [ ] Profile created in Supabase

**URL:** `https://your-domain.vercel.app/auth`

**Verify in Supabase:**
```sql
SELECT id, email, full_name, subscription_tier, created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;
```

---

#### 3. CSV Upload & Mapping

**Test:** Upload and map CSV files
- [ ] Navigate to `/app`
- [ ] Upload schema file (CSV with target structure)
- [ ] Upload data file (CSV with source data)
- [ ] Both files parse successfully
- [ ] Columns display with types
- [ ] Can drag source columns to target columns
- [ ] Can select columns from dropdown
- [ ] Preview updates in real-time
- [ ] "Review Mapping" shows summary
- [ ] "Download CSV" generates file
- [ ] Downloaded CSV has correct structure

**Test Files:**
Create 2 simple CSV files for testing:

**schema.csv** (target structure):
```csv
FirstName,LastName,Email,Phone
John,Doe,john@example.com,555-1234
```

**data.csv** (source data):
```csv
first_name,last_name,email_address,phone_number
Jane,Smith,jane@test.com,555-5678
Bob,Jones,bob@test.com,555-9012
```

**URL:** `https://your-domain.vercel.app/app`

---

#### 4. Save & Load Mapping (Local)

**Test:** Local storage persistence
- [ ] Complete a mapping
- [ ] Click "Save Mapping"
- [ ] Enter mapping name
- [ ] Refresh page
- [ ] Mapping still available
- [ ] Can load saved mapping
- [ ] Can export mapping to JSON
- [ ] Can import mapping from JSON

---

#### 5. Stripe Checkout

**Test:** Upgrade to Pro
- [ ] Go to `/pricing`
- [ ] Click "Upgrade to Pro" (Monthly)
- [ ] Redirected to Stripe checkout
- [ ] See product details: Pro Monthly - $29
- [ ] Fill in card details (use Stripe test card: 4242 4242 4242 4242)
- [ ] Complete payment
- [ ] Redirected back to app
- [ ] Show "Payment Successful" message
- [ ] User tier updated to "pro"
- [ ] Can now access premium features

**Stripe Test Card:**
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**URL:** `https://your-domain.vercel.app/pricing`

**Verify in Database:**
```sql
SELECT email, subscription_tier, stripe_customer_id, stripe_subscription_id
FROM user_profiles
WHERE email = 'your-test-email@example.com';
```

**Verify in Stripe:**
- Go to: https://dashboard.stripe.com/test/customers
- Find your test customer
- Check subscription is active

---

#### 6. Cloud Features

**Test:** Save mapping to cloud (requires Pro tier)
- [ ] After upgrading to Pro, go to `/app`
- [ ] Complete a mapping
- [ ] Click "Save to Cloud"
- [ ] Enter mapping name and description
- [ ] Click "Save"
- [ ] Success message appears
- [ ] Go to dashboard
- [ ] See saved mapping in list

**URL:** `https://your-domain.vercel.app/dashboard`

**Verify in Supabase:**
```sql
SELECT id, user_id, name, description, created_at
FROM mappings
ORDER BY created_at DESC
LIMIT 5;
```

---

#### 7. Dashboard & Analytics

**Test:** View user dashboard
- [ ] Go to `/dashboard`
- [ ] See welcome message with user email
- [ ] Current plan displayed correctly
- [ ] Usage statistics show (or 0 for new user)
- [ ] Recent mappings list appears
- [ ] Upgrade buttons visible if on free tier

**URL:** `https://your-domain.vercel.app/dashboard`

---

#### 8. Profile Management

**Test:** Update user profile
- [ ] Go to `/profile`
- [ ] Update full name
- [ ] Click "Save Changes"
- [ ] Success message appears
- [ ] Name updated in database
- [ ] Can change plan
- [ ] Can manage subscription

**URL:** `https://your-domain.vercel.app/profile`

---

#### 9. Templates (Pro Feature)

**Test:** Access template library
- [ ] Upgrade to Pro tier
- [ ] Go to `/templates`
- [ ] See list of templates
- [ ] Click on a template
- [ ] Template loads and applies
- [ ] Can save template as new mapping

**URL:** `https://your-domain.vercel.app/templates`

---

#### 10. Session Persistence

**Test:** Login persists across sessions
- [ ] Login to account
- [ ] Close browser tab
- [ ] Open new tab and go to app
- [ ] Still logged in
- [ ] Can access protected routes
- [ ] Session refreshes if expired

---

## Edge Cases to Test

### Large Files
- [ ] Upload CSV with 1000+ rows
- [ ] Upload CSV with 50+ columns
- [ ] Performance is acceptable
- [ ] Memory usage is reasonable

### Special Characters
- [ ] CSV with commas in values
- [ ] CSV with quotes in values
- [ ] CSV with newlines in values
- [ ] CSV with emojis
- [ ] CSV with non-ASCII characters

### Empty Data
- [ ] CSV with empty rows
- [ ] CSV with missing values
- [ ] CSV with all empty columns
- [ ] Handles gracefully without errors

### Mobile
- [ ] Homepage loads on mobile
- [ ] Can upload files on mobile
- [ ] Mapping interface works on mobile
- [ ] Can complete flow on mobile
- [ ] Responsive design works

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Common Issues & Solutions

### Issue: Magic link not received

**Solution:**
1. Check spam folder
2. Verify Resend API key is correct
3. Check Supabase logs: https://app.supabase.com/project/qxytijsztnxcnxwkwtjf/logs

### Issue: Stripe checkout fails

**Solution:**
1. Verify Stripe keys are in test mode
2. Check webhook secret is correct
3. Verify price IDs match products
4. Check Stripe webhook logs: https://dashboard.stripe.com/test/webhooks

### Issue: Mapping doesn't save to cloud

**Solution:**
1. Verify user has Pro tier or higher
2. Check Supabase RLS policies
3. Check browser console for errors
4. Verify database tables exist

### Issue: Page shows 404

**Solution:**
1. Check deployment completed successfully
2. Clear browser cache
3. Try incognito mode
4. Check Vercel deployment logs

---

## Performance Benchmarks

Target metrics (use Chrome DevTools → Lighthouse):

### Desktop
- **Performance:** >90
- **Accessibility:** >90
- **Best Practices:** >90
- **SEO:** >90

### Mobile
- **Performance:** >80
- **Accessibility:** >85
- **Best Practices:** >85
- **SEO:** >90

### Load Times
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3.5s
- **Largest Contentful Paint:** <2.5s

---

## Success Criteria

✅ **Deployment Successful When:**
- Homepage loads without errors
- Authentication flow works end-to-end
- CSV upload and mapping works
- Stripe checkout completes
- Webhooks process correctly
- Cloud features unlock with Pro tier
- All critical tests pass

✅ **Ready for Production When:**
- All staging tests pass
- No critical bugs found
- Performance metrics met
- Security checklist complete
- Monitoring configured
- Support documentation ready

---

## Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Add error tracking** (Sentry)
3. **Add analytics** (Posthog/Google Analytics)
4. **Complete remaining features** (Phase 2)
5. **Gather user feedback**
6. **Iterate on UX**

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **SvelteKit Docs:** https://kit.svelte.dev/docs

---

**Happy Testing! 🚀**

If you find any bugs, please open an issue on GitHub or email: support@csvmapper.com
