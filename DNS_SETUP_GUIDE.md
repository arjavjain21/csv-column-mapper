# DNS Setup Guide for csvmap.com

## DNS Record Types Required

You need **A Records** (Address Records) to point your domain to the VPS IP address.

### Record Types:
- **A Record**: Maps a domain name to an IPv4 address
- **A Record (www)**: Maps www subdomain to the same IPv4 address

---

## Step-by-Step DNS Configuration

### Step 1: Log into Your Domain Registrar

1. Go to your domain registrar website (where you purchased csvmap.com)
   - Common registrars: Namecheap, GoDaddy, Cloudflare, Google Domains, etc.
2. Log in to your account
3. Navigate to **Domain Management** or **My Domains**
4. Find and click on **csvmap.com**

### Step 2: Access DNS Management

1. Look for **DNS Settings**, **DNS Management**, or **Name Servers** section
2. Click on **Manage DNS** or **DNS Records**
3. You should see a list of existing DNS records

### Step 3: Add A Records

You need to add **TWO** A records:

#### Record 1: Root Domain (csvmap.com)

1. Click **Add Record** or **+ Add** button
2. Select record type: **A Record** or **A**
3. Fill in the details:
   - **Host/Name**: `@` or leave blank (some registrars use `@` for root domain)
   - **Type**: `A`
   - **Value/Points to/TTL**: `137.74.43.93` (your VPS IP)
   - **TTL**: `3600` (1 hour) or `Automatic`
4. Click **Save** or **Add Record**

#### Record 2: WWW Subdomain (www.csvmap.com)

1. Click **Add Record** or **+ Add** button again
2. Select record type: **A Record** or **A**
3. Fill in the details:
   - **Host/Name**: `www`
   - **Type**: `A`
   - **Value/Points to/TTL**: `137.74.43.93` (same VPS IP)
   - **TTL**: `3600` (1 hour) or `Automatic`
4. Click **Save** or **Add Record**

### Step 4: Verify DNS Records

After adding, you should see these records:

```
Type    Host    Value           TTL
A       @       137.74.43.93    3600
A       www     137.74.43.93    3600
```

Or:

```
Type    Name              Value           TTL
A       csvmap.com        137.74.43.93    3600
A       www.csvmap.com    137.74.43.93    3600
```

### Step 5: Wait for DNS Propagation

DNS changes can take anywhere from **5 minutes to 48 hours** to propagate globally. Usually it's **15-60 minutes**.

**Check DNS propagation:**

```bash
# On your VPS or local machine
dig csvmap.com
nslookup csvmap.com
host csvmap.com

# Or use online tools:
# https://www.whatsmydns.net/#A/csvmap.com
# https://dnschecker.org/#A/csvmap.com
```

**What to look for:**
- The answer should show `137.74.43.93`
- If you see different IPs or "not found", DNS hasn't propagated yet

### Step 6: Verify DNS is Working

Once DNS propagates, test:

```bash
# Test root domain
curl -I http://csvmap.com

# Test www subdomain
curl -I http://www.csvmap.com

# Both should connect to your VPS
```

---

## Common Registrar-Specific Instructions

### Namecheap
1. Go to **Domain List** → Click **Manage** next to csvmap.com
2. Go to **Advanced DNS** tab
3. Under **Host Records**, click **Add New Record**
4. Add two A records:
   - Host: `@`, Type: `A Record`, Value: `137.74.43.93`, TTL: `Automatic`
   - Host: `www`, Type: `A Record`, Value: `137.74.43.93`, TTL: `Automatic`

### GoDaddy
1. Go to **My Products** → **Domains** → Click **csvmap.com**
2. Click **DNS** tab
3. Scroll to **Records** section
4. Click **Add** button
5. Add two A records:
   - Type: `A`, Name: `@`, Value: `137.74.43.93`, TTL: `600`
   - Type: `A`, Name: `www`, Value: `137.74.43.93`, TTL: `600`

### Cloudflare
1. Select **csvmap.com** domain
2. Go to **DNS** → **Records**
3. Click **Add record**
4. Add two A records:
   - Type: `A`, Name: `@`, IPv4 address: `137.74.43.93`, Proxy: `DNS only` (gray cloud), TTL: `Auto`
   - Type: `A`, Name: `www`, IPv4 address: `137.74.43.93`, Proxy: `DNS only` (gray cloud), TTL: `Auto`

### Google Domains
1. Go to **My domains** → Click **csvmap.com**
2. Click **DNS** tab
3. Under **Custom resource records**, click **Manage custom records**
4. Add two A records:
   - Host name: `@`, Type: `A`, Data: `137.74.43.93`, TTL: `3600`
   - Host name: `www`, Type: `A`, Data: `137.74.43.93`, TTL: `3600`

---

## Troubleshooting

### DNS Not Propagating?
- Wait at least 1 hour
- Clear your local DNS cache:
  ```bash
  # Linux/Mac
  sudo systemd-resolve --flush-caches
  # Or
  sudo dscacheutil -flushcache
  
  # Windows
  ipconfig /flushdns
  ```
- Check from different locations using online DNS checkers

### Wrong IP Showing?
- Double-check the A record value is `137.74.43.93`
- Make sure you saved the records
- Some registrars require you to click "Save" or "Apply Changes"

### Can't Find DNS Settings?
- Look for: DNS Management, DNS Records, Name Servers, Advanced DNS, DNS Zone
- Contact your registrar's support if you can't find it

---

## After DNS is Configured

Once DNS propagates (you can verify with `dig csvmap.com`), proceed with SSL setup:

```bash
sudo certbot --nginx -d csvmap.com -d www.csvmap.com
```

This will:
1. Obtain SSL certificate from Let's Encrypt
2. Automatically configure Nginx for HTTPS
3. Set up auto-renewal

Then your site will be accessible at:
- https://csvmap.com
- https://www.csvmap.com
