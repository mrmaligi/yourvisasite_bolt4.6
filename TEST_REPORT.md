# VisaBuild Database & Frontend Integration Test Report

**Date:** 2026-03-01  
**Project:** yourvisasite_bolt4.6-main (VisaBuild)  
**Database:** Supabase (zogfvzzizbbmmmnlzxdg.supabase.co)

---

## 🎯 Executive Summary

| Category | Status | Notes |
|----------|--------|-------|
| Database Connection | ⚠️ Partial | Connection works but RLS issues |
| Core Tables | ✅ Good | Most tables exist and accessible |
| Missing Tables | ❌ Issues | news, forum_posts, document_templates missing |
| RLS Policies | ⚠️ Problems | Permission errors on profiles, lawyer tables |
| Edge Functions | ⚠️ Issues | Return non-2xx status codes |
| Frontend Integration | ⚠️ At Risk | AuthContext will fail due to profile RLS |

---

## 📊 Detailed Test Results

### 1. Database Connection ✅
- **Supabase URL:** https://zogfvzzizbbmmmnlzxdg.supabase.co
- **Status:** Connected successfully
- **Anonymous Key:** Valid

### 2. Core Tables Status

| Table | Exists | Accessible | Notes |
|-------|--------|------------|-------|
| `profiles` | ✅ | ❌ | RLS permission denied |
| `visas` | ✅ | ✅ | 81 active visas found |
| `user_visa_purchases` | ✅ | ⚠️ | Accessible but empty |
| `tracker_entries` | ✅ | 🔒 | Insert blocked (expected) |
| `consultation_slots` | ✅ | ✅ | Exists |
| `bookings` | ✅ | ✅ | Exists |
| `lawyer_profiles` | ✅ | ❌ | RLS permission denied |
| `news` | ❌ | - | Table does not exist |
| `forum_posts` | ❌ | - | Table does not exist |
| `document_templates` | ❌ | - | Table does not exist |

### 3. RLS Policy Issues 🔒

#### Critical Issue: `profiles` Table
```
Error: 42703 - column profiles.email does not exist
```

**Problem:** The test query tried to select `email` which doesn't exist on the `profiles` table. The `email` is likely only in `auth.users`.

**Impact:** AuthContext queries will fail because it tries to join `lawyer_profiles`:
```typescript
// AuthContext.tsx line 54-58
const { data, error } = await supabase
  .from('profiles')
  .select('*, lawyer_profiles(*)')  // This will fail!
  .eq('id', userId)
  .single();
```

#### Issue: `lawyer_profiles` Access
```
Error: 42501 - permission denied for table users
```

**Problem:** The RLS policies use `is_admin()` and `is_lawyer()` functions that query `auth.users`, but these functions fail when called by anonymous users.

**Root Cause:** In migration `20260207002145_004_row_level_security.sql`:
```sql
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);  -- This calls is_admin() which fails
```

The `is_admin()` function:
```sql
SELECT COALESCE(
  (SELECT raw_app_meta_data ->> 'role' = 'admin'
   FROM auth.users
   WHERE id = uid),
  false
);
```

### 4. Missing Tables ❌

The following tables referenced in migrations don't exist in the public schema:

| Table | Migration File | Status |
|-------|---------------|--------|
| `news` | 20260223130000_create_news_tracker_tables.sql | ❌ Missing |
| `forum_posts` | 20260219090000_forum_system.sql | ❌ Missing |
| `document_templates` | 20260219091000_document_templates.sql | ❌ Missing |

**Note:** These tables might:
- Be in a different schema
- Not have been applied to the database
- Have different names (e.g., `news_articles` instead of `news`)

### 5. Edge Functions ⚡

| Function | Status | Response |
|----------|--------|----------|
| `process-payment` | ⚠️ | Non-2xx status |
| `stripe-webhook` | ⚠️ | Non-2xx status |
| `consultation-checkout` | ⚠️ | Non-2xx status |
| `send-email` | ⚠️ | Non-2xx status |

**Likely Causes:**
- Functions require authentication
- Missing required parameters
- Functions not deployed

### 6. Storage 📁

**Status:** No storage buckets found

Expected buckets for:
- User documents
- Lawyer profile images
- Visa attachments

---

## 🚨 Critical Issues

### Issue #1: AuthContext Will Fail
**Severity:** 🔴 CRITICAL

The AuthContext tries to load the user profile on sign-in:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*, lawyer_profiles(*)')
  .eq('id', userId)
  .single();
```

**Expected Behavior:** Profile loads successfully  
**Actual Behavior:** Query will fail due to RLS issues

**Impact:** Users cannot sign in or use the application

### Issue #2: Lawyer Schema Tables Not Accessible
**Severity:** 🔴 HIGH

Tables in the `lawyer` schema are not accessible via the Supabase client:
- `lawyer.profiles`
- `lawyer.consultation_slots`
- `lawyer.reviews`

### Issue #3: Missing Core Tables
**Severity:** 🟡 MEDIUM

Several feature tables are missing:
- News/Articles system
- Forum system
- Document templates

---

## ✅ What's Working

1. **Visas Table:** 81 active visas accessible publicly
2. **Basic Connection:** Supabase client connects successfully
3. **Tracker Entries:** RLS blocking insert works correctly (for anon users)
4. **Authentication:** Auth endpoints are reachable

---

## 🔧 Recommended Fixes

### Fix #1: Fix RLS Policies for Profiles

Update the profiles SELECT policy to not rely on `is_admin()` for basic reads:

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a simpler policy
CREATE POLICY "Anyone can view active profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### Fix #2: Fix the is_admin() and is_lawyer() Functions

Make these functions safer when called by anonymous users:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data ->> 'role' = 'admin'
     FROM auth.users
     WHERE id = uid
     AND uid IS NOT NULL),  -- Check uid is not null
    false
  );
$$;
```

### Fix #3: Fix AuthContext Query

Update AuthContext.tsx to handle the lawyer_profiles join better:

```typescript
const fetchProfile = async (userId: string) => {
  try {
    // First get the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('[AuthContext] Profile fetch error:', profileError);
      return;
    }

    // Then try to get lawyer profile if applicable
    if (profile?.role === 'lawyer') {
      const { data: lawyerProfile } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('profile_id', userId)
        .single();
      
      setProfile({ ...profile, lawyer_profile: lawyerProfile });
    } else {
      setProfile(profile);
    }
  } catch (err) {
    console.error('[AuthContext] Unexpected error:', err);
  }
};
```

### Fix #4: Apply Missing Migrations

Run the missing migrations to create the tables:

```bash
# Check if migrations are applied
supabase migration list

# Apply pending migrations
supabase migration up
```

Or manually run the SQL files:
- `20260219090000_forum_system.sql`
- `20260219091000_document_templates.sql`
- `20260223130000_create_news_tracker_tables.sql`

### Fix #5: Create Storage Buckets

```sql
-- Use Supabase dashboard or CLI to create buckets
-- Required buckets:
-- - documents (private)
-- - lawyer-profiles (public)
-- - visa-attachments (public)
```

---

## 🧪 Test Commands

Run these tests to verify fixes:

```bash
# Test database connection
npx tsx test_database.ts

# Test detailed functionality
npx tsx test_database_detailed.ts

# Type check
npm run typecheck

# Run dev server
npm run dev
```

---

## 📈 Next Steps

1. **Immediate:** Fix RLS policies for profiles table
2. **High Priority:** Fix AuthContext profile loading
3. **Medium Priority:** Apply missing migrations
4. **Low Priority:** Set up storage buckets
5. **Testing:** Test full user sign-up/login flow

---

## 📞 Support

For database issues, check:
- Supabase Dashboard: https://app.supabase.com/project/zogfvzzizbbmmmnlzxdg
- RLS Policies: Auth > Policies
- Database: Database > Tables
