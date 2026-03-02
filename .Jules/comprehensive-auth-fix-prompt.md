================================================================================
JULES SESSION: Comprehensive Auth & Dashboard Fix
Project: yourvisasite_bolt4.6
Repository: github/mrmaligi2007/yourvisasite_bolt4.6
================================================================================

🎯 OBJECTIVE
Fix the critical authentication and dashboard issues that prevent users from accessing the application after signin. The user is authenticated but gets redirected back to login, creating an infinite loop.

🔍 CONTEXT & PROBLEM ANALYSIS

## Primary Issue: Auth Redirect Loop
When a user signs in successfully:
1. AuthContext authenticates the user
2. ProtectedRoute checks for user and profile
3. Profile fetch fails or returns null
4. ProtectedRoute redirects to /login
5. Login sees authenticated user, redirects to /dashboard
6. Loop repeats infinitely

## Root Cause Analysis
After investigating the codebase, I've identified multiple alignment issues between frontend TypeScript interfaces and the actual Supabase database schema:

### Critical Issue #1: Profile Fetch Column Mismatch
**File:** `src/hooks/useProfile.ts` (line 23)
- Frontend queries: `.eq('user_id', user.id)`
- Database schema: `profiles.id UUID PRIMARY KEY REFERENCES auth.users(id)`
- **Fix needed:** Change `user_id` to `id`

### Critical Issue #2: TypeScript Interface Mismatches
**File:** `src/types/database.ts`
- `Booking` interface uses wrong field names (`booking_date`, `start_time`, `end_time`)
- Database uses: `scheduled_at`, `duration_minutes`
- `LawyerProfile` interface missing 15+ fields that exist in database

### Critical Issue #3: ProtectedRoute Logic
**File:** `src/components/auth/RoleGuard.tsx`
- When profile is null, it redirects to /login (creates loop)
- Should redirect to /register or wait for profile creation

### Critical Issue #4: AuthService Retry Logic
**File:** `src/lib/services/auth.service.ts`
- Profile fetch retries 3 times but may not wait long enough for trigger
- No proper error handling for missing profiles

📁 FILES REQUIRING CHANGES

1. `src/types/database.ts` - Fix all TypeScript interfaces to match database
2. `src/hooks/useProfile.ts` - Fix column name in query
3. `src/contexts/AuthContext.tsx` - Improve profile loading state
4. `src/components/auth/RoleGuard.tsx` - Fix redirect logic
5. `src/lib/services/auth.service.ts` - Improve fetch logic
6. `src/lib/repositories/profile.repository.ts` - Verify query
7. `src/pages/user/UserDashboard.tsx` - Fix queries and null checks

🔧 DETAILED FIX REQUIREMENTS

## Fix 1: Update Booking Interface
Replace in `src/types/database.ts`:
```typescript
export interface Booking {
  id: string;
  user_id: string;
  lawyer_id: string;
  booking_reference?: string;
  status: BookingStatus;
  scheduled_at: string;           // Changed from booking_date
  duration_minutes: number;       // Changed from start_time/end_time
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

## Fix 2: Update LawyerProfile Interface
Replace in `src/types/database.ts`:
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

## Fix 3: Fix useProfile Hook
In `src/hooks/useProfile.ts` line 23:
Change from:
```typescript
.eq('user_id', user.id)
```
To:
```typescript
.eq('id', user.id)
```

## Fix 4: Fix ProtectedRoute Logic
In `src/components/auth/RoleGuard.tsx`:
When profile is null, redirect to `/register` instead of `/login` to break the loop.

## Fix 5: Improve AuthContext
Add better loading state management and debugging logs to trace the auth flow.

🧠 THINKING & ANALYSIS INSTRUCTIONS

Jules, please:

1. **DEEP ANALYSIS:** Read all the files mentioned above and understand the full auth flow from signin to dashboard access.

2. **IDENTIFY ADDITIONAL ISSUES:** Look for:
   - Other TypeScript interfaces that don't match the database schema
   - Components that use the wrong field names
   - Race conditions in async operations
   - Missing error handling
   - Any other alignment issues

3. **CONSIDER EDGE CASES:**
   - What happens if the profile trigger doesn't run?
   - What happens if the user refreshes the page mid-auth?
   - What happens with slow network connections?
   - What happens if the user has a valid session but no profile row?

4. **PROPOSE COMPREHENSIVE FIXES:**
   - Fix all identified issues
   - Add proper error boundaries
   - Add retry logic where appropriate
   - Ensure type safety throughout
   - Add helpful error messages for users

5. **TESTING CONSIDERATIONS:**
   - Ensure TypeScript compiles with zero errors
   - Ensure the build succeeds
   - Test the auth flow end-to-end
   - Verify dashboard loads with real data

✅ SUCCESS CRITERIA

- [ ] User can sign in successfully
- [ ] User is redirected to dashboard after signin
- [ ] Dashboard loads without errors
- [ ] User profile data is displayed correctly
- [ ] No redirect loops occur
- [ ] TypeScript compiles with zero errors
- [ ] Build succeeds for production
- [ ] All TypeScript interfaces match database schema

📝 ADDITIONAL CONTEXT

**Tech Stack:**
- React 18 + TypeScript + Vite
- Supabase (Auth, Postgres, RLS)
- React Router v7
- Tailwind CSS

**Database:**
- 27 tables
- RLS policies enabled
- Profile trigger creates profile on auth.users insert

**Current State:**
- 71 branches merged recently
- Multiple alignment issues from branch merges
- Build succeeds but auth flow broken
- User can sign in but gets stuck in redirect loop

🔍 INVESTIGATION HINTS

1. Check if `profiles` table has a trigger that creates profile on new auth user
2. Check if RLS policies allow reading own profile
3. Check if the profile repository query is correct
4. Check all components that use Booking or LawyerProfile types
5. Check for any hardcoded field names that don't match schema

💡 RECOMMENDED APPROACH

1. First, fix the TypeScript interfaces to match database
2. Then, fix the useProfile hook column name
3. Then, fix the ProtectedRoute redirect logic
4. Add logging to trace the auth flow
5. Test the complete flow
6. Fix any additional issues found during testing

================================================================================
END OF PROMPT
================================================================================
