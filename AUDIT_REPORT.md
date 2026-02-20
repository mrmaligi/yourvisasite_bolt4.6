# Codebase Audit Report

## Part 1: Code Analysis

### TypeScript Errors
- **Severity:** High
- **Issue:** `src/components/GlobalSearch.tsx` was missing import for `LawyerProfile`.
- **Fix:** Imported `LawyerProfile` from `../types/database`.
- **Issue:** `src/components/layout/DashboardShell.tsx` was importing non-existent `toast`.
- **Fix:** Switched to `useToast` hook.
- **Issue:** `src/components/auth/RoleGuard.tsx` was using incorrect `loading` property.
- **Fix:** Switched to `isLoading`.
- **Issue:** `AdminDashboard.tsx` and `UserDashboard.tsx` used polymorphic `Button` (`as={Link}`) which is not supported.
- **Fix:** Replaced with `Link` components using Tailwind classes.

### Unused Code
- **Severity:** Low
- **Issue:** Unused imports and variables in `LawyerDashboard.tsx`, `DashboardShell.tsx`, `ForumCategoryPage.tsx`.
- **Recommendation:** Run a linter auto-fix or manually remove unused variables.

## Part 2: SQL & Database Audit

### RLS Policies
- **Severity:** Critical
- **Issue:** `supabase/migrations/20260220120000_create_all_missing_tables.sql` created policies using `FOR ALL USING (...)` without `WITH CHECK`. This potentially allowed authenticated users to insert rows belonging to other users (e.g., booking slots for other lawyers).
- **Fix:** Created new migration `20260221000000_fix_rls_security.sql` to drop and recreate policies with `WITH CHECK` clauses for:
    - `consultation_slots`
    - `saved_visas`
    - `marketplace_listings`
    - `marketplace_reviews`
    - `youtube_feeds`

### Indexes
- **Severity:** Low
- **Issue:** Most foreign keys are indexed, which is good.
- **Recommendation:** Monitor `tracker_entries` performance as it grows; might need composite index on `(visa_id, status)`.

## Part 3: Performance Issues

### Bundle Size
- **Severity:** Medium
- **Issue:** `dist/assets/index.js` is ~540kB.
- **Recommendation:** Investigate code splitting `src/components/ui` if used heavily, or check if large libraries (like `recharts` or `framer-motion`) can be optimized. `App.tsx` already uses `lazy` loading for routes, which is good.

### Re-renders
- **Severity:** Low
- **Issue:** `GlobalSearch` fetches data every time it opens.
- **Recommendation:** Implement caching (e.g., React Query or simple state cache) for search data.

## Part 4: Security Audit

### RLS
- **Severity:** Critical
- **Status:** Fixed. See Part 2.

### Input Validation
- **Severity:** Medium
- **Issue:** Frontend validation relies mostly on HTML attributes or simple checks.
- **Recommendation:** Ensure all API endpoints (Supabase Edge Functions) validate input strictly using Zod or similar.

## Part 5: Best Practices

### Accessibility
- **Severity:** Medium
- **Issue:** Some buttons/links were nested or semantically incorrect (fixed some in dashboards).
- **Recommendation:** Run an automated accessibility tool (like Axe) to catch contrast and label issues.

### Error Handling
- **Severity:** Low
- **Issue:** `toast` was not working in `DashboardShell`.
- **Fix:** Fixed `toast` usage.
