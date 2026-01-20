# Stripe Setup Guide - CSV Column Mapper

**Quick Setup Guide for Stripe Payments**

---

## 🎯 What You Need to Set Up

1. **5 Products/Prices** in Stripe (Test Mode)
2. **Update environment variables** in Vercel
3. **Test the checkout flow**

---

## Step 1: Create Stripe Products (Test Mode)

### Go to Stripe Dashboard
```
https://dashboard.stripe.com/test/products
```

Make sure you're in **TEST MODE** (toggle in top-left corner)

---

## Step 2: Create Products

### Product 1: Pro Monthly
1. Click **"+ Add product"**
2. **Name:** `Pro (Monthly)`
3. **Description:** `Cloud sync, unlimited mappings, templates library, email support`
4. **Pricing:**
   - **Price:** `29.00`
   - **Currency:** `USD`
   - **Interval:** `Month`
   - **Billing scheme:** Per unit
5. **Click "Save product"**
6. **Copy the Price ID** (looks like `price_1234567890abcdef`)
   - Found in the "Pricing" tab of the product
   - Click the price to see the ID
   - Copy it!

### Product 2: Pro Yearly (Save 20%)
1. Click **"+ Add product"**
2. **Name:** `Pro (Yearly)`
3. **Description:** `Cloud sync, unlimited mappings, templates library, email support (Save 20%)`
4. **Pricing:**
   - **Price:** `290.00`
   - **Currency:** `USD`
   - **Interval:** `Year`
   - **Billing scheme:** Per unit
5. **Click "Save product"**
6. **Copy the Price ID**

### Product 3: Business Monthly
1. Click **"+ Add product"**
2. **Name:** `Business (Monthly)`
3. **Description:** `Team collaboration (5 users), API access, priority support`
4. **Pricing:**
   - **Price:** `99.00`
   - **Currency:** `USD`
   - **Interval:** `Month`
   - **Billing scheme:** Per unit
5. **Click "Save product"**
6. **Copy the Price ID**

### Product 4: Business Yearly (Save 20%)
1. Click **"+ Add product"**
2. **Name:** `Business (Yearly)`
3. **Description:** `Team collaboration (5 users), API access, priority support (Save 20%)`
4. **Pricing:**
   - **Price:** `990.00`
   - **Currency:** `USD`
   - **Interval:** `Year`
   - **Billing scheme:** Per unit
5. **Click "Save product"**
6. **Copy the Price ID**

### Product 5: Lifetime (One-time payment)
1. Click **"+ Add product"**
2. **Name:** `Lifetime Access`
3. **Description:** `One-time payment for lifetime Pro access - all features forever`
4. **Pricing:**
   - **Price:** `199.00`
   - **Currency:** `USD`
   - **Payment model:** **One-time** (not recurring!)
5. **Click "Save product"**
6. **Copy the Price ID**

---

## Step 3: Update Environment Variables in Vercel

### Go to Vercel Environment Variables
```
https://vercel.com/avjay21s-projects/csv-column-mapper/settings/environment-variables
```

### Add/Update These Variables:

For each price ID you copied:

**STRIPE_PRICE_PRO_MONTHLY**
- Value: `price_XXXXX...` (paste the Pro Monthly price ID)

**STRIPE_PRICE_PRO_YEARLY**
- Value: `price_XXXXX...` (paste the Pro Yearly price ID)

**STRIPE_PRICE_BUSINESS_MONTHLY**
- Value: `price_XXXXX...` (paste the Business Monthly price ID)

**STRIPE_PRICE_BUSINESS_YEARLY**
- Value: `price_XXXXX...` (paste the Business Yearly price ID)

**STRIPE_PRICE_LIFETIME**
- Value: `price_XXXXX...` (paste the Lifetime price ID)

**Important:**
- Select **All** environments (Production, Preview, Development)
- Click **Save** after each one
- Redeploy after adding all variables

---

## Step 4: Test the Checkout Flow

### Test Card Information

**Card Number:** `4242 4242 4242 4242`
**Expiry:** Any future date (e.g., `12/34`)
**CVC:** Any 3 digits (e.g., `123`)
**ZIP:** Any 5 digits (e.g., `12345`)

### Testing Steps:

1. **Go to your deployed app:**
   ```
   https://csv-column-mapper-dekubmkal-avjay21s-projects.vercel.app/pricing
   ```

2. **Click "Upgrade to Pro"** (or any plan)

3. **Should redirect to Stripe checkout**

4. **Fill in test card details**

5. **Click "Pay"**

6. **Should redirect back to your app**

7. **Check if user tier is updated to "pro"**

---

## Step 5: Configure Stripe Webhooks (After testing)

### 1. Create Webhook Endpoint

**Go to:** https://dashboard.stripe.com/test/webhooks

1. **Click "+ Add endpoint"**
2. **Endpoint URL:** `https://csv-column-mapper-dekubmkal-avjay21s-projects.vercel.app/api/stripe/webhook`
3. **Select events to listen for:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. **Click "Add endpoint"**

### 2. Copy Webhook Secret

1. **Click on the webhook** you just created
2. **Click "Reveal"** next to "Signing secret"
3. **Copy the secret** (starts with `whsec_...`)

### 3. Update in Vercel

**Go to:** https://vercel.com/avjay21s-projects/csv-column-mapper/settings/environment-variables

**Add variable:**
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (paste the webhook secret)
- **Environments:** All (Production, Preview, Development)
- **Click "Save"**
- **Redeploy**

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All 5 products created in Stripe
- [ ] All 5 price IDs added to Vercel
- [ ] Vercel redeployed successfully
- [ ] Pricing page loads without errors
- [ ] Clicking "Upgrade" redirects to Stripe
- [ ] Test payment completes successfully
- [ ] User is redirected back to app
- [ ] User tier updated in database
- [ ] Webhook endpoint created (after deployment)
- [ ] Webhook secret added to Vercel

---

## 🧪 Quick Test Command

After setup, test the checkout by running:

```bash
# Go to pricing page
open https://csv-column-mapper-dekubmkal-avjay21s-projects.vercel.app/pricing
```

---

## 📚 Stripe Dashboard Links

**Test Mode Dashboard:**
- Products: https://dashboard.stripe.com/test/products
- Prices: https://dashboard.stripe.com/test/prices
- Payments: https://dashboard.stripe.com/test/payments
- Customers: https://dashboard.stripe.com/test/customers
- Webhooks: https://dashboard.stripe.com/test/webhooks

**Live Mode (for production):**
- Products: https://dashboard.stripe.com/products
- Prices: https://dashboard.stripe.com/prices

---

## 🐛 Troubleshooting

### Issue: "No such price" error
**Solution:** Make sure you copied the correct Price ID (not Product ID)

### Issue: Webhook not receiving events
**Solution:** Make sure the webhook URL is correct and deployment is live

### Issue: Payment succeeds but user not upgraded
**Solution:** Check webhook is configured and receiving events

### Issue: Test card declined
**Solution:** Make sure you're using test card: 4242 4242 4242 4242

---

## 💡 Tips

1. **Always test in Test Mode first** - Use real money only when ready!
2. **Copy Price IDs carefully** - They're long and easy to mistake
3. **Redeploy after environment variables** - Changes need redeploy to take effect
4. **Test each plan** - Make sure all 5 work correctly
5. **Check Stripe logs** - If something fails, check webhook delivery logs

---

## 🚀 Next Steps

After Stripe is configured:

1. Test complete checkout flow
2. Verify webhooks work
3. Check database for user tier updates
4. Test subscription cancellation
5. Move to live Stripe keys (when ready for production)

---

**Good luck! 🎉**
