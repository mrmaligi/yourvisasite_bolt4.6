# VisaBuild Project Plan

## Phase 1: Documentation & Structure ✅
- [x] Update README.md with the exact project spec.
- [x] Create a TODO.md breaking down the features into coding tasks.
- [x] Verify session attachment.

## Phase 2: Database Schema (Supabase) ✅
- [x] Design the SQL tables.
    - [x] `profiles` (roles: user/lawyer/admin)
    - [x] `visas` (visa types and details)
    - [x] `user_visas` (for paid unlocks/access)
    - [x] `tracker_entries` (for processing times)
    - [x] `bookings` (for lawyer consultations)
    - [x] `document_categories` (19 categories)
    - [x] `premium_content` (step-by-step guides)
    - [x] `notification_preferences` (email settings)
    - [x] `tracker_moderation_queue` (flagged entries)

## Phase 3: Frontend Build

### Tracker ✅
- [x] Build Anonymous Tracker Interface.
- [x] Implement processing time algorithm (User input + Weighted Lawyer input).
- [x] Add visual timeline component.
- [x] Add trend charts (Recharts).
- [x] Implement auto-flagging for outliers.
- [x] Add moderation queue.

### Auth & Role System ✅
- [x] Implement Google Sign-in with Supabase.
- [x] Set up Role-Based Access Control (RBAC) for User, Lawyer, and Admin.
- [x] Create basic dashboards for each role.
- [x] Add protected routes.

### User Features (The Applicant) ✅
- [x] Dashboard: News Feed, Quick Call.
- [x] Welcome/Tour pages.
- [x] Visa Search: Search by keywords/subclass.
- [x] Freemium Logic:
    - [x] Free view (Basic summary).
    - [x] Payment integration (Stripe) for $49/visa.
    - [x] Premium view (Step-by-step guide, document helper).
- [x] Consultation Booking System.
- [x] Document Upload with 19 categories.
- [x] Saved/Bookmarked Visas.
- [x] Notification preferences.
- [ ] Reschedule/Cancel flows ⏳

### Lawyer Features (The Expert) ✅
- [x] Verification Process (Upload proof of practice).
- [x] Lawyer Dashboard: Manage Users, Marketing, Hourly Rates.
- [x] Availability calendar.
- [x] Cases management.
- [x] Billing page.
- [ ] News Commenting System ⏳
- [ ] Reply to User Reviews ⏳

### Admin Features (The Controller) ✅
- [x] Admin Dashboard: Overview with charts.
- [x] User & Lawyer Management (Approve Lawyers).
- [x] Content Management (Premium content, Doc categories).
- [x] Pricing Control.
- [x] Tracker moderation.
- [x] Activity logs.
- [ ] Email template management ⏳

## Phase 4: 50 Pages Expansion ✅
- [x] Batch 1: User Experience (Pages 1-10)
- [x] Batch 2: User Completion + Lawyer Start (Pages 11-20)
- [x] Batch 3: Lawyer Completion + Admin Start (Pages 21-30)
- [x] Batch 4: Admin Completion (Pages 31-40)
- [x] Batch 5: Public Resources (Pages 41-50)

## Phase 5: TypeScript & Build Fixes ✅
- [x] Remove unused React imports
- [x] Fix CaseKanban urgent property
- [x] Fix unused imports across lawyer portal
- [x] Add missing type definitions
- [x] Fix nullable type issues
- [x] Fix React Hook dependency warnings
- [x] Zero TypeScript errors

## Phase 6: Security & Audit ✅
- [x] Fix RLS policies with WITH CHECK clauses
- [x] Add input validation
- [x] Security audit report
- [x] Code audit report

## Phase 7: Frontend-Backend Alignment ⏳ (CURRENT)
- [ ] Fix 22 alignment issues (Jules-ready)
    - [ ] #20: Booking interface field mismatches (CRITICAL)
    - [ ] #21: LawyerProfile column mismatches (CRITICAL)
    - [ ] #22: LawyerDashboard wrong column query (HIGH)
    - [ ] #18: useProfile hook wrong column name (HIGH)
    - [ ] #19: Dashboard non-existent scheduled_at (HIGH)
    - [ ] #1-17: Various type and field mismatches

## Phase 8: Final Polish ⏳
- [ ] Reschedule/Cancel consultation flows
- [ ] Lawyer revenue dashboard
- [ ] Visa comparison tool
- [ ] Additional visa data (20+ visas target)

---

**Legend:**
- [x] Complete
- [ ] Not started
- ⏳ In progress
