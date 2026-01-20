# Storage Analysis: Where Data Lives & Future Growth

## 🎯 Quick Answer

**CSV files:** ✅ **NOT stored anywhere** - Processed client-side in browser  
**Mapping configurations:** ✅ **Stored in Supabase** (small JSONB data)  
**Application code:** ✅ **Stored on VPS** (~50-100MB)

---

## 📊 Current Storage Breakdown

### VPS Storage (Your Server)

#### Application Code
```
Current codebase:      ~2MB (source files)
After npm install:     ~150-200MB (with node_modules)
After build:           ~50-100MB (production build)
PM2 logs:              ~10-50MB (grows over time)
Nginx logs:            ~10-50MB (grows over time)
System files:          ~500MB-1GB (Ubuntu base)
```

**Total VPS Storage Needed:**
- **Minimum:** ~1GB (for 1GB RAM VPS)
- **Recommended:** ~5GB (for 2GB RAM VPS with room to grow)
- **Current usage:** ~2MB (code only, no dependencies yet)

#### What Gets Stored on VPS:

1. **Application Code** (~50-100MB)
   - Built JavaScript files
   - Static assets (images, fonts)
   - No CSV files stored

2. **Node Modules** (~150MB)
   - Dependencies (Supabase, Stripe, etc.)
   - Only during development/build
   - Can be removed after build (production doesn't need it)

3. **Logs** (~10-100MB/month)
   - PM2 application logs
   - Nginx access/error logs
   - System logs

4. **Temporary Files** (minimal)
   - Build artifacts
   - Cache files

**VPS Storage Growth:**
- **Year 1:** ~500MB-1GB
- **Year 2:** ~1-2GB (with logs)
- **Year 3:** ~2-3GB (with logs and updates)

**Recommendation:** Start with 10-20GB disk (standard VPS size)

---

### Supabase Storage (Database)

#### What Gets Stored:

1. **User Profiles** (~1KB per user)
   ```sql
   - id, email, full_name, avatar_url
   - subscription_tier, stripe_customer_id
   - created_at, updated_at
   ```
   **Storage:** ~1KB per user
   **10,000 users:** ~10MB

2. **Mappings** (~5-50KB per mapping)
   ```sql
   - Column names (JSONB): ~1-5KB
   - Column mappings (JSONB): ~2-20KB
   - Transformations (JSONB): ~1-10KB
   - Validation rules (JSONB): ~1-15KB
   ```
   **Storage:** ~5-50KB per mapping
   **1,000 mappings:** ~5-50MB
   **10,000 mappings:** ~50-500MB

3. **Mapping Versions** (~5-50KB per version)
   - Version history for undo/redo
   - Only for Pro+ tiers
   **Storage:** ~5-50KB per version
   **10,000 versions:** ~50-500MB

4. **Templates** (~5-50KB per template)
   - Public template library
   - 10 pre-built templates
   **Storage:** ~50-500KB total

5. **Teams** (~1KB per team)
   - Team management (Business tier)
   **Storage:** ~1KB per team
   **1,000 teams:** ~1MB

6. **Team Members** (~500 bytes per member)
   - Team membership records
   **Storage:** ~500 bytes per member
   **10,000 members:** ~5MB

7. **Usage Tracking** (~100 bytes per record)
   - File processing history
   - Analytics data
   **Storage:** ~100 bytes per record
   **1,000,000 records:** ~100MB

#### Supabase Storage Calculation

**Conservative Estimate (10,000 users):**
```
User Profiles:        10MB (10,000 users × 1KB)
Mappings:            250MB (5,000 mappings × 50KB avg)
Mapping Versions:    100MB (2,000 versions × 50KB)
Templates:           1MB (20 templates × 50KB)
Teams:               1MB (1,000 teams × 1KB)
Team Members:        5MB (10,000 members × 500 bytes)
Usage Tracking:      50MB (500,000 records × 100 bytes)
Indexes & Overhead:  100MB
─────────────────────────────────
Total:               ~517MB
```

**Growth Estimate (100,000 users):**
```
User Profiles:        100MB
Mappings:            2.5GB (50,000 mappings)
Mapping Versions:    1GB (20,000 versions)
Templates:           5MB
Teams:               10MB
Team Members:        50MB
Usage Tracking:      500MB
Indexes & Overhead:  1GB
─────────────────────────────────
Total:               ~5.2GB
```

**Supabase Free Tier:** 500MB database  
**Supabase Pro Tier:** 8GB database ($25/month)  
**Supabase Team Tier:** 50GB database ($599/month)

---

## 🚫 What Does NOT Get Stored

### CSV Files (Not Stored Anywhere!)

**Important:** CSV files are processed **100% client-side** in the browser.

**Flow:**
```
User uploads CSV → Browser reads file → Parsed in memory → 
Mapping happens → Export generated → Download to user's computer
```

**No CSV data is:**
- ❌ Uploaded to your VPS
- ❌ Stored in Supabase
- ❌ Sent to any server
- ❌ Persisted anywhere

**Why this is great:**
- ✅ Privacy: User data never leaves their browser
- ✅ No storage costs for CSV files
- ✅ No bandwidth costs for large files
- ✅ Fast processing (no upload/download)

**Only stored:**
- ✅ Mapping configurations (which columns map to which)
- ✅ Transformation rules (how to transform data)
- ✅ Validation rules (what to validate)

**Example:**
- User uploads 100MB CSV file
- **Stored:** Mapping config (~5KB) in Supabase
- **Not stored:** 100MB CSV file (processed and discarded)

---

## 📈 Future Growth Projections

### VPS Storage Growth

| Timeframe | Users | Storage Needed | Notes |
|-----------|-------|----------------|-------|
| **Month 1** | 0-100 | ~500MB | Code + logs |
| **Month 6** | 100-1,000 | ~1GB | Code + logs + updates |
| **Year 1** | 1,000-10,000 | ~2GB | Code + logs + updates |
| **Year 2** | 10,000-50,000 | ~3GB | Code + logs + updates |
| **Year 3** | 50,000+ | ~5GB | Code + logs + updates |

**Recommendation:** 
- Start with **10GB disk** (standard VPS)
- Upgrade to **20GB** when needed (~$2/month more)
- Monitor with: `df -h` (weekly check)

### Supabase Storage Growth

| Users | Mappings | Storage Needed | Tier Needed |
|-------|----------|----------------|-------------|
| **100** | 300 | ~15MB | Free (500MB) ✅ |
| **1,000** | 3,000 | ~150MB | Free (500MB) ✅ |
| **10,000** | 30,000 | ~1.5GB | Pro (8GB) $25/mo |
| **100,000** | 300,000 | ~15GB | Team (50GB) $599/mo |

**Break-even:**
- **Free tier:** Up to ~3,000 users
- **Pro tier:** Up to ~50,000 users
- **Team tier:** 50,000+ users

---

## 💾 Storage Breakdown by Component

### VPS Components

```
Application Code:       50-100MB   (static, doesn't grow)
Node Modules:          150MB      (only during build)
Build Output:          50-100MB   (static)
PM2 Logs:              10-50MB    (grows ~1-5MB/month)
Nginx Logs:            10-50MB    (grows ~1-5MB/month)
System Files:          500MB-1GB  (Ubuntu base)
─────────────────────────────────
Total:                 ~1-2GB    (grows slowly)
```

**Growth Rate:** ~10-20MB/month (mostly logs)

### Supabase Components

```
User Profiles:          Grows with users (~1KB/user)
Mappings:              Grows with saved mappings (~5-50KB/mapping)
Mapping Versions:       Grows with Pro+ users (~5-50KB/version)
Templates:             Static (~1MB, 10-20 templates)
Teams:                 Grows with Business tier (~1KB/team)
Usage Tracking:        Grows with activity (~100 bytes/record)
─────────────────────────────────
Total:                 Grows with usage
```

**Growth Rate:** ~50-500MB per 1,000 users (depends on mapping usage)

---

## 🎯 Storage Optimization Strategies

### VPS Optimization

1. **Remove node_modules after build**
   ```bash
   # After building, remove node_modules
   rm -rf node_modules
   # Saves ~150MB
   ```

2. **Rotate logs regularly**
   ```bash
   # Set up log rotation
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

3. **Clean old builds**
   ```bash
   # Keep only last 2 builds
   # Saves ~50-100MB
   ```

4. **Use compression**
   ```bash
   # Nginx gzip already enabled
   # Reduces bandwidth, not storage
   ```

### Supabase Optimization

1. **Archive old mappings**
   - Delete unused mappings after 1 year
   - Archive to cold storage if needed

2. **Limit version history**
   - Keep only last 10 versions per mapping
   - Delete older versions

3. **Clean usage tracking**
   - Keep only last 90 days of detailed tracking
   - Aggregate older data

4. **Optimize JSONB**
   - Use indexes on frequently queried fields
   - Compress large JSONB fields if needed

---

## 📊 Real-World Storage Examples

### Scenario 1: Small SaaS (1,000 users)

**VPS:**
- Code: 100MB
- Logs: 50MB
- System: 1GB
- **Total: ~1.2GB**

**Supabase:**
- Users: 1MB
- Mappings: 15MB (300 mappings)
- Versions: 5MB
- Other: 5MB
- **Total: ~26MB** (well under 500MB free tier)

### Scenario 2: Growing SaaS (10,000 users)

**VPS:**
- Code: 100MB
- Logs: 200MB
- System: 1GB
- **Total: ~1.3GB**

**Supabase:**
- Users: 10MB
- Mappings: 250MB (5,000 mappings)
- Versions: 100MB
- Other: 50MB
- **Total: ~410MB** (still under 500MB free tier!)

### Scenario 3: Scale SaaS (100,000 users)

**VPS:**
- Code: 100MB
- Logs: 500MB
- System: 1GB
- **Total: ~1.6GB**

**Supabase:**
- Users: 100MB
- Mappings: 2.5GB (50,000 mappings)
- Versions: 1GB
- Other: 500MB
- **Total: ~4.1GB** (needs Pro tier: 8GB, $25/month)

---

## ✅ Storage Recommendations

### VPS Storage

**Start with:** 10-20GB disk (standard VPS size)  
**Upgrade when:** Disk usage >80%  
**Monitor:** Weekly with `df -h`

**Typical VPS sizes:**
- **1GB RAM VPS:** Usually comes with 10-25GB disk ✅
- **2GB RAM VPS:** Usually comes with 25-50GB disk ✅
- **4GB RAM VPS:** Usually comes with 50-80GB disk ✅

**You'll never run out of disk space** with standard VPS sizes.

### Supabase Storage

**Start with:** Free tier (500MB)  
**Upgrade to Pro ($25/month)** when:
- Database size >400MB
- Need more than 500MB
- Want better performance

**Upgrade to Team ($599/month)** when:
- Database size >7GB
- Need more than 8GB
- Enterprise features needed

**Break-even:**
- Free tier: Up to ~3,000 users
- Pro tier: Up to ~50,000 users
- Team tier: 50,000+ users

---

## 🔍 Monitoring Storage

### Check VPS Storage

```bash
# Check disk usage
df -h

# Check directory sizes
du -sh ~/apps/csv-column-mapper/*
du -sh /var/log/*

# Check PM2 logs
pm2 logs csv-mapper --lines 0 | wc -l

# Clean old logs
pm2 flush csv-mapper
```

### Check Supabase Storage

1. **Supabase Dashboard:**
   - Go to Settings → Database
   - View database size
   - View table sizes

2. **SQL Query:**
   ```sql
   -- Check database size
   SELECT pg_size_pretty(pg_database_size('postgres'));
   
   -- Check table sizes
   SELECT 
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

---

## 🎯 Summary

### Storage Locations

| Data Type | Location | Size | Growth |
|-----------|----------|------|--------|
| **CSV Files** | ❌ Not stored | 0MB | N/A |
| **Mapping Configs** | ✅ Supabase | 5-50KB each | With users |
| **Application Code** | ✅ VPS | 50-100MB | Static |
| **Logs** | ✅ VPS | 10-100MB | ~1-5MB/month |
| **User Data** | ✅ Supabase | 1KB/user | With users |

### Key Points

1. ✅ **CSV files never stored** - Processed client-side only
2. ✅ **VPS storage minimal** - ~1-2GB total, grows slowly
3. ✅ **Supabase storage small** - ~26MB for 1,000 users
4. ✅ **Free tier sufficient** - Up to ~3,000 users
5. ✅ **Standard VPS disk** - 10-20GB is plenty

### Cost Impact

**VPS Storage:** Included in VPS price (no extra cost)  
**Supabase Storage:** Free up to 500MB, then $25/month for 8GB

**You'll likely never pay extra for storage** - standard VPS and Supabase free tier handle everything!

---

**Bottom Line:** Storage is **not a concern**. The application is designed to be storage-efficient, and CSV files are never stored (processed client-side only).
