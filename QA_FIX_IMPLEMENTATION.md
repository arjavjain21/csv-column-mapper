# QA Fix Implementation Plan

## 🔍 Root Cause Analysis

### Issue #1: 500 Error on /app Route
**Root Cause Found:** 
- Error: `TypeError: locals.safeGetSession is not a function`
- The `/app` route or its server-side code is trying to call `event.locals.safeGetSession()` but it's not available
- This suggests either:
  1. The route has a `+page.server.ts` that's calling it incorrectly, OR
  2. The hooks.server.ts isn't properly setting up `safeGetSession` for this route

**Fix Strategy:**
- Check if `/app/+page.server.ts` exists and how it uses `safeGetSession`
- Ensure hooks.server.ts properly sets up `event.locals.safeGetSession`
- Add error handling and fallbacks

### Issue #2: Duplicate Headers
**Root Cause Found:**
- `+layout.svelte` renders a navbar (lines 24-42)
- Individual pages like `about/+page.svelte` also render their own header (lines 12-29)
- Result: Two headers stack

**Fix Strategy:**
- Remove header from individual pages
- Use layout header only
- Add "Back to Home" as conditional in layout header

### Issue #3: Pricing Mismatch
**Root Cause Found:**
- Landing page (`+page.svelte`) has hardcoded prices: $12, $39 (lines 285, 300)
- Pricing page uses `plans.ts` which has: $29, $99
- **Source of truth:** `plans.ts` is correct ($29/$99)

**Fix Strategy:**
- Update landing page to use `plans.ts` data
- Remove hardcoded prices
- Ensure consistency

### Issue #4: FAQ Contrast
**Root Cause:** Need to find FAQ section CSS and fix dark mode colors

### Issue #5: Disabled Button
**Root Cause:** Button has `disabled` attribute but no visual styling

---

## 📋 Implementation Plan

### Phase 1: Critical Fixes (Immediate)

#### Fix #1: /app Route 500 Error
**Files:**
- `src/routes/app/+page.svelte` - Check auth logic
- `src/routes/app/+page.server.ts` - If exists, fix safeGetSession usage
- `src/hooks.server.ts` - Verify safeGetSession setup

**Action:**
1. Check if `+page.server.ts` exists for /app route
2. If it exists, fix the safeGetSession call
3. If it doesn't exist, ensure client-side auth check handles errors
4. Add try-catch around auth checks
5. Add proper error boundaries

#### Fix #2: Duplicate Headers
**Files:**
- `src/routes/about/+page.svelte` - Remove header (lines 12-29)
- `src/routes/privacy/+page.svelte` - Remove header
- `src/routes/terms/+page.svelte` - Remove header
- `src/routes/+layout.svelte` - Add "Back to Home" conditional

**Action:**
1. Remove `<header class="page-header">` sections from about/privacy/terms
2. Update layout to show "Back to Home" on secondary pages
3. Ensure single header across all pages

### Phase 2: Major Fixes

#### Fix #3: Pricing Alignment
**Files:**
- `src/routes/+page.svelte` - Update pricing section (lines ~280-310)
- `src/lib/config/plans.ts` - Verify prices ($29/$99 are correct)

**Action:**
1. Import `getAllPlans` from `plans.ts`
2. Replace hardcoded $12/$39 with dynamic data from plans
3. Ensure both pages use same source

#### Fix #4: FAQ Contrast
**Files:**
- `src/routes/pricing/+page.svelte` - Find FAQ section styles

**Action:**
1. Locate FAQ section
2. Update dark mode text colors for WCAG AA compliance
3. Test contrast ratios

#### Fix #5: Disabled Button
**Files:**
- `src/routes/pricing/+page.svelte` - Find "Start Free" button

**Action:**
1. Add disabled state styling
2. Show "Current Plan" label when disabled
3. Add cursor: not-allowed

### Phase 3: Minor Fixes

#### Fix #6: /features Route
**Action:** Create route or redirect

#### Fix #7: Header Consistency
**Action:** Standardize header component

#### Fix #8: CTA Text
**Action:** Create constants file

---

## 🎯 Ready to Implement

I understand all issues and have identified root causes. Should I proceed with implementing fixes in priority order?
