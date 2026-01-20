# Storage Quick Reference

## 🎯 Where Data Lives

### ✅ Stored in Supabase (Database)
- **User profiles** (~1KB per user)
- **Mapping configurations** (~5-50KB per mapping)
- **Mapping versions** (~5-50KB per version)
- **Templates** (~5-50KB per template)
- **Teams & members** (~1KB per team)

**Total for 1,000 users:** ~26MB  
**Total for 10,000 users:** ~410MB  
**Free tier limit:** 500MB (covers ~12,000 users)

### ✅ Stored on VPS (Your Server)
- **Application code** (~50-100MB)
- **Build output** (~50-100MB)
- **Logs** (~10-100MB, grows ~1-5MB/month)
- **System files** (~500MB-1GB)

**Total:** ~1-2GB (grows slowly)  
**Standard VPS disk:** 10-20GB (plenty of room)

### ❌ NOT Stored Anywhere
- **CSV files** - Processed 100% client-side in browser
- **File contents** - Never uploaded or stored
- **User data** - Only mapping configs stored, not actual CSV data

---

## 📊 Storage Growth

### VPS Storage
- **Month 1:** ~500MB
- **Year 1:** ~1-2GB
- **Year 3:** ~2-3GB
- **Growth:** ~10-20MB/month (mostly logs)

### Supabase Storage
- **1,000 users:** ~26MB
- **10,000 users:** ~410MB
- **100,000 users:** ~4.1GB
- **Growth:** ~50-500MB per 1,000 users

---

## 💰 Cost Impact

**VPS Storage:** ✅ Included (no extra cost)  
**Supabase Storage:** ✅ Free up to 500MB, then $25/month for 8GB

**You'll likely never pay extra for storage!**

---

## 🔍 Quick Checks

### Check VPS Storage
```bash
df -h                    # Overall disk usage
du -sh ~/apps/*         # App directory size
pm2 logs --lines 0 | wc -l  # Log size
```

### Check Supabase Storage
- Dashboard → Settings → Database
- View database size
- Free tier: 500MB limit

---

## ✅ Key Points

1. **CSV files never stored** - Privacy-first design
2. **VPS storage minimal** - ~1-2GB total
3. **Supabase storage small** - Free tier covers ~12,000 users
4. **Standard VPS disk** - 10-20GB is plenty
5. **No storage costs** - Everything included

**Storage is NOT a concern!** 🎉
