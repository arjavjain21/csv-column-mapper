# Stripe Setup Guide

## Step 1: Create Products in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product" for each pricing tier

### Product 1: Pro Plan - Monthly
- **Name**: CSV Column Mapper - Pro (Monthly)
- **Description**: Cloud sync, unlimited mappings, templates library, email support
- **Pricing**:
  - Price: $12/month
  - Currency: USD
  - Billing: Recurring monthly
- **Copy the Price ID** → Paste in `.env` as `STRIPE_PRICE_PRO_MONTHLY`

### Product 2: Pro Plan - Yearly (20% discount)
- **Name**: CSV Column Mapper - Pro (Yearly)
- **Description**: Cloud sync, unlimited mappings, templates library, email support (Save 20%)
- **Pricing**:
  - Price: $115/year (was $144)
  - Currency: USD
  - Billing: Recurring yearly
- **Copy the Price ID** → Paste in `.env` as `STRIPE_PRICE_PRO_YEARLY`

### Product 3: Business Plan - Monthly
- **Name**: CSV Column Mapper - Business (Monthly)
- **Description**: Team collaboration (5 users), API access, priority support, custom branding
- **Pricing**:
  - Price: $39/month
  - Currency: USD
  - Billing: Recurring monthly
- **Copy the Price ID** → Paste in `.env` as `STRIPE_PRICE_BUSINESS_MONTHLY`

### Product 4: Business Plan - Yearly (20% discount)
- **Name**: CSV Column Mapper - Business (Yearly)
- **Description**: Team collaboration (5 users), API access, priority support (Save 20%)
- **Pricing**:
  - Price: $374/year (was $468)
  - Currency: USD
  - Billing: Recurring yearly
- **Copy the Price ID** → Paste in `.env` as `STRIPE_PRICE_BUSINESS_YEARLY`

### Product 5: Lifetime Access
- **Name**: CSV Column Mapper - Lifetime
- **Description**: One-time payment, lifetime access to all Pro features
- **Pricing**:
  - Price: $199 (one-time)
  - Currency: USD
  - Billing: One-time
- **Copy the Price ID** → Paste in `.env` as `STRIPE_PRICE_LIFETIME`

## Step 2: Setup Webhook

1. In Stripe dashboard, go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - For local testing: Use `stripe listen --forward-to localhost:5173/api/stripe/webhook`
4. **Events to send** (select these):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the Webhook Secret** (starts with `whsec_`)
7. Paste in `.env` as `STRIPE_WEBHOOK_SECRET`

## Step 3: Update .env File

After creating products, update your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sb_secret_BFBzird5amQ4XuM6YUATRw_4MNywRPM
PUBLIC_STRIPE_PUBLISHABLE_KEY=sb_publishable_-1HS_4JYQAjdQMeiEta8-g_3rJgyNjZ
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# Stripe Price IDs (update with actual IDs from Stripe)
STRIPE_PRICE_PRO_MONTHLY=price_xxx_from_stripe
STRIPE_PRICE_PRO_YEARLY=price_xxx_from_stripe
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx_from_stripe
STRIPE_PRICE_BUSINESS_YEARLY=price_xxx_from_stripe
STRIPE_PRICE_LIFETIME=price_xxx_from_stripe
```

## Step 4: Test Your Setup

Once configured, the app will:
1. ✅ Allow users to subscribe via Stripe Checkout
2. ✅ Automatically sync subscription status
3. ✅ Grant access to paid features
4. ✅ Handle subscription changes/cancellations
5. ✅ Update user tier in database

## Pricing Tiers Summary

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Client-side only, localStorage, unlimited mappings |
| **Pro Monthly** | $12/mo | Cloud sync, templates, email support |
| **Pro Yearly** | $115/yr | Save 20%, all Pro features |
| **Business Monthly** | $39/mo | 5 users, API access, priority support |
| **Business Yearly** | $374/yr | Save 20%, all Business features |
| **Lifetime** | $199 once | All Pro features forever |

---

**After setup, let me know and I'll test the integration!**
