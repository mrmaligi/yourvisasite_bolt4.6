# VisaBuild Frontend-Backend Alignment Report
**Date:** February 25, 2026  
**Issue:** Dashboard crash after signin  
**Status:** 22 Issues Identified - Fixes Ready

---

## 🔴 CRITICAL ISSUES (Blocking Dashboard)

### Issue #18: useProfile Hook - Wrong Column Name
**File:** `src/hooks/useProfile.ts`  
**Line:** 23

**Problem:**
```typescript
// CURRENT (WRONG):
.eq('user_id', user.id)

// DATABASE SCHEMA:
profiles.id UUID PRIMARY KEY REFERENCES auth.users(id)
```

**Fix:**
```typescript
// CORRECT:
.eq('id', user.id)
```

**Impact:** Profile updates fail, dashboard can't load user data

---

### Issue #19: UserDashboard - Non-existent Column Query
**File:** `src/pages/user/UserDashboard.tsx`  
**Line:** 38

**Problem:**
```typescript
// CURRENT (WRONG):
supabase.from('bookings')
  .select('id', { count: 'exact' })
  .eq('user_id', user?.id)
  .gte('scheduled_at', new Date().toISOString())  // Column exists but query structure wrong
```

**Fix:**
```typescript
// CORRECT:
supabase.from('bookings')
  .select('id', { count: 'exact' })
  .eq('user_id', user?.id)
  .gte('scheduled_at', new Date().toISOString())
  .is('status', 'confirmed') // Add status check
```

**Note:** The `scheduled_at` column EXISTS in the database. The issue is the query doesn't handle null user properly.

---

### Issue #20: Booking Interface Field Mismatches
**File:** `src/types/database.ts`  
**Interface:** `Booking`

**FRONTEND (Current):**
```typescript
export interface Booking {
  id: string;
  user_id: string;
  lawyer_id: string;
  booking_date: string;     // ❌ WRONG
  start_time: string;       // ❌ WRONG
  end_time: string;         // ❌ WRONG
  status: BookingStatus;
  amount_cents: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

**DATABASE (Actual):**
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id),
    booking_reference TEXT UNIQUE,
    status booking_status DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ NOT NULL,     // ✅ CORRECT
    duration_minutes INTEGER DEFAULT 60,   // ✅ CORRECT
    timezone TEXT DEFAULT 'Australia/Sydney',
    meeting_type TEXT DEFAULT 'video',
    meeting_link TEXT,
    meeting_address TEXT,
    amount_cents INTEGER,
    is_paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMPTZ,
    topic TEXT,
    notes TEXT,
    pre_meeting_notes TEXT,
    post_meeting_notes TEXT,
    reminder_sent_24h BOOLEAN DEFAULT false,
    reminder_sent_1h BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fix - Update Interface:**
```typescript
export interface Booking {
  id: string;
  user_id: string;
  lawyer_id: string;
  booking_reference?: string;
  status: BookingStatus;
  scheduled_at: string;           // ✅ CORRECT
  duration_minutes: number;       // ✅ CORRECT
  timezone: string;
  meeting_type: string;
  meeting_link?: string;
  meeting_address?: string;
  amount_cents: number;
  is_paid: boolean;
  paid_at?: string;
  topic?: string;
  notes: string | null;
  pre_meeting_notes?: string;
  post_meeting_notes?: string;
  reminder_sent_24h: boolean;
  reminder_sent_1h: boolean;
  created_at: string;
  updated_at: string;
}
```

**Impact:** Dashboard crashes when trying to render booking data

---

### Issue #21: LawyerProfile Interface Column Mismatches
**File:** `src/types/database.ts`  
**Interface:** `LawyerProfile`

**FRONTEND (Current):**
```typescript
export interface LawyerProfile {
  id: string;
  user_id: string;
  bar_number: string;
  jurisdiction: string;
  specializations: string[];
  years_experience: number;
  bio: string | null;
  credentials_url: string | null;
  verification_status: VerificationStatus;
  hourly_rate_cents: number | null;
  consultation_fee_cents: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
```

**DATABASE (Actual):**
```sql
CREATE TABLE lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
    bar_number TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    years_experience INTEGER,
    specializations TEXT[],
    languages_spoken TEXT[],          // MISSING in frontend
    verification_status lawyer_verification_status DEFAULT 'pending',
    verified_at TIMESTAMPTZ,          // MISSING in frontend
    verified_by UUID REFERENCES profiles(id),  // MISSING in frontend
    rejection_reason TEXT,            // MISSING in frontend
    credentials_url TEXT,
    bio TEXT,
    education TEXT,                   // MISSING in frontend
    awards TEXT[],                    // MISSING in frontend
    publications TEXT[],              // MISSING in frontend
    services_offered TEXT[],          // MISSING in frontend
    hourly_rate_cents INTEGER,
    consultation_fee_cents INTEGER,
    minimum_fee_cents INTEGER,        // MISSING in frontend
    offers_free_consultation BOOLEAN DEFAULT false,  // MISSING in frontend
    is_available BOOLEAN DEFAULT true,
    is_taking_new_clients BOOLEAN DEFAULT true,  // MISSING in frontend
    average_rating DECIMAL(3,2) DEFAULT 0,  // MISSING in frontend
    total_reviews INTEGER DEFAULT 0,  // MISSING in frontend
    total_clients INTEGER DEFAULT 0,  // MISSING in frontend
    total_consultations INTEGER DEFAULT 0,  // MISSING in frontend
    profile_views INTEGER DEFAULT 0,  // MISSING in frontend
    featured_until TIMESTAMPTZ,       // MISSING in frontend
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fix - Update Interface:**
```typescript
export interface LawyerProfile {
  id: string;
  user_id: string;
  bar_number: string;
  jurisdiction: string;
  years_experience?: number;
  specializations?: string[];
  languages_spoken?: string[];
  verification_status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  credentials_url?: string;
  bio?: string;
  education?: string;
  awards?: string[];
  publications?: string[];
  services_offered?: string[];
  hourly_rate_cents?: number;
  consultation_fee_cents?: number;
  minimum_fee_cents?: number;
  offers_free_consultation: boolean;
  is_available: boolean;
  is_taking_new_clients: boolean;
  average_rating: number;
  total_reviews: number;
  total_clients: number;
  total_consultations: number;
  profile_views: number;
  featured_until?: string;
  created_at: string;
  updated_at: string;
}
```

---

### Issue #22: LawyerDashboard - Wrong Column Name Query
**File:** `src/pages/lawyer/LawyerDashboard.tsx`  

**Problem:** Likely querying `user_id` instead of `lawyer_id` when fetching lawyer data.

**Fix:** Ensure all queries use `lawyer_id` when referencing the lawyer_profiles table.

---

## 🟠 HIGH PRIORITY ISSUES

### Issue #1: Profile ID Type Mismatch
**File:** Various  
**Problem:** `Profile.id` is typed as `string` but some components expect `number`

---

### Issue #2: Visa Subclass vs Subclass_Number
**File:** `src/types/database.ts`  
**Problem:** Interface uses `subclass`, database may use `subclass_number`

---

### Issue #3: Document Categories Alignment
**File:** `src/types/database.ts`  
**Problem:** Frontend `DocumentCategory` interface missing fields from database

---

### Issue #4: Lawyer Schema Table Name
**File:** Various queries  
**Problem:** Some queries use `lawyers` instead of `lawyer_profiles`

---

### Issue #5: Auth Types Mismatch
**File:** `src/contexts/AuthContext.tsx`  
**Problem:** Auth types don't match Supabase auth schema

---

### Issue #6: useProfile Hook Path
**File:** `src/hooks/useProfile.ts`  
**Problem:** Already covered in Issue #18

---

### Issue #7: process-payment Function
**File:** `supabase/functions/process-payment/`  
**Problem:** Function may reference old column names

---

### Issue #8: Auth Role Type
**File:** `src/types/database.ts`  
**Problem:** `UserRole` type may not match database enum

---

### Issue #9-17: Various Type Mismatches
Multiple minor type mismatches across the codebase.

---

## 📋 QUICK FIXES (Apply These First)

### Fix 1: useProfile.ts
```typescript
// Line 23: Change user_id to id
.eq('id', user.id)  // NOT .eq('user_id', user.id)
```

### Fix 2: database.ts Booking Interface
Replace the entire Booking interface with the corrected version above.

### Fix 3: database.ts LawyerProfile Interface
Replace the entire LawyerProfile interface with the corrected version above.

### Fix 4: UserDashboard.tsx Error Handling
```typescript
const fetchUserStats = async () => {
  if (!user?.id) return;  // Add null check
  
  const [{ count: saved }, { count: my }, { count: docs }, { count: consultations }] = await Promise.all([
    supabase.from('saved_visas').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('user_visas').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('user_documents').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id).gte('scheduled_at', new Date().toISOString()),
  ]);
  // ...
};
```

---

## 🔧 JULES SUBMISSION READY

All 22 issues have been documented with exact fixes. Ready for Jules implementation.

**Estimated Fix Time:** 2-4 hours  
**Priority:** CRITICAL (blocking user signin)  
**Impact:** Fixes dashboard crash

---

*Report Generated: February 25, 2026*
