# VisaBuild — 50 Critical Fixes

> **Created:** 2026-02-21  
> **Executor:** Jules (Google AI) via parallel sessions  
> **Goal:** Fix all TypeScript errors, missing features, and integration issues

---

## 🔴 BATCH 1: TypeScript & Build Errors (Fixes 1-10)

| # | Fix | File(s) | Issue |
|---|-----|---------|-------|
| 1 | Remove unused React imports | 50+ files | `'React' is declared but its value is never read` (TS6133) |
| 2 | Fix CaseKanban urgent property | `lawyer/cases/CaseKanban.tsx` | Property 'urgent' doesn't exist on union type |
| 3 | Fix unused imports in CaseManagement | `lawyer/cases/CaseManagement.tsx` | CheckCircle, Clock, CardHeader, view/setView unused |
| 4 | Fix unused imports in CaseTimeline | `lawyer/cases/CaseTimeline.tsx` | CalendarIcon, CardHeader unused |
| 5 | Fix ClientCommunication imports | `lawyer/clients/ClientCommunication.tsx` | Multiple unused imports |
| 6 | Fix all lawyer portal unused imports | 30+ files in `lawyer/*` | Bulk fix TS6133/TS6192 errors |
| 7 | Add missing type definitions | `types/database.ts` | Ensure all tables have TypeScript interfaces |
| 8 | Fix nullable type issues | Various | Handle `maybeSingle()` return types properly |
| 9 | Fix React Hook dependency warnings | Various | Add missing deps to useEffect arrays |
| 10 | Fix any types | Various | Replace `any` with proper types |

---

## 🟠 BATCH 2: Missing Features from Voice Notes (Fixes 11-20)

| # | Fix | Description | Priority |
|---|-----|-------------|----------|
| 11 | **Google Sign-In** | Enable Google OAuth in Supabase auth | HIGH |
| 12 | **YouTube Feed on Landing** | Add trending lawyer videos to homepage | MEDIUM |
| 13 | **Visa-Specific News** | Show related news articles on visa detail page | HIGH |
| 14 | **Document Help Icons** | Add ? tooltips to document upload categories | HIGH |
| 15 | **Example Filled Application** | Add sample application forms to premium content | HIGH |
| 16 | **Lawyer Sees User Docs** | Enable document sharing from user to lawyer | HIGH |
| 17 | **Lawyer Weighted Tracker** | Give lawyer tracker submissions 2x weight | MEDIUM |
| 18 | **Lawyer News Comments** | Allow lawyers to comment on news articles | MEDIUM |
| 19 | **Quick Call Button** | Add instant call booking on main page | MEDIUM |
| 20 | **Rating System** | User rates lawyer after consultation | HIGH |

---

## 🟡 BATCH 3: Database & API Issues (Fixes 21-30)

| # | Fix | Description |
|---|-----|-------------|
| 21 | Fix `user_visas` table queries | Dashboard queries failing - check table name |
| 22 | Fix `saved_visas` RLS policies | Users can't save visas |
| 23 | Fix `bookings` status flow | Status not updating after payment |
| 24 | Add missing `consultation_checkout` edge function | Stripe integration for consultations |
| 25 | Fix `stripe-webhook` handler | Payment confirmations not processing |
| 26 | Add missing `tracker_stats` view | Processing time stats not calculating |
| 27 | Fix `lawyer_profiles` visibility | Public can't view lawyer details |
| 28 | Add `user_documents` sharing | Share docs with lawyer for consultation |
| 29 | Fix `news` table RLS | Public can't read news articles |
| 30 | Add `notifications` trigger | Real-time notifications not working |

---

## 🟢 BATCH 4: UI/UX Polish (Fixes 31-40)

| # | Fix | Description |
|---|-----|-------------|
| 31 | Fix mobile navigation | Hamburger menu not closing properly |
| 32 | Add loading skeletons | All pages need proper loading states |
| 33 | Fix dark mode inconsistencies | Some components don't respect theme |
| 34 | Add empty states | Show friendly messages when no data |
| 35 | Fix form validation | Add proper error messages to all forms |
| 36 | Add toast notifications | Success/error feedback for actions |
| 37 | Fix responsive layout issues | Mobile layout breaks on several pages |
| 38 | Add confirmation dialogs | Prevent accidental deletions |
| 39 | Fix infinite scroll | Virtualized list has scroll issues |
| 40 | Add breadcrumb navigation | Users get lost in deep pages |

---

## 🔵 BATCH 5: Integration & Logic (Fixes 41-50)

| # | Fix | Description |
|---|-----|-------------|
| 41 | Fix premium unlock flow | $49 purchase not unlocking content |
| 42 | Fix document upload to Supabase Storage | Files not uploading properly |
| 43 | Fix consultation booking calendar | Time slots not showing availability |
| 44 | Fix lawyer availability management | Can't set available times |
| 45 | Fix tracker entry submission | Form submits but data not saved |
| 46 | Fix admin user management | Can't change user roles |
| 47 | Fix lawyer verification flow | Pending status not updating |
| 48 | Fix password reset flow | Reset emails not sending |
| 49 | Fix email notifications | No emails for bookings/consultations |
| 50 | Fix PWA install prompt | Prompt not showing on mobile |

---

## Jules Execution Plan

### Session 1: TS Errors Batch (Fixes 1-10)
- Fix all TypeScript errors across lawyer portal
- Remove unused imports
- Fix type definitions

### Session 2: Core Features Batch (Fixes 11-20)
- Google Sign-In
- YouTube feed
- Visa-specific news
- Document help icons

### Session 3: Database/API Batch (Fixes 21-30)
- Fix RLS policies
- Fix edge functions
- Add missing views/triggers

### Session 4: UI Polish Batch (Fixes 31-40)
- Mobile fixes
- Loading states
- Dark mode
- Empty states

### Session 5: Integration Batch (Fixes 41-50)
- Premium unlock
- Document upload
- Consultation booking
- Admin features

---

## Status Tracking

| Batch | Status | Session | URL |
|-------|--------|---------|-----|
| 1: TS Errors | 🟡 In Progress | 11713961120993037045 | [Open](https://jules.google.com/session/11713961120993037045) |
| 2: Core Features | 🟡 In Progress | 16598955566074231859 | [Open](https://jules.google.com/session/16598955566074231859) |
| 3: Database/API | 🟡 In Progress | 4820782180714400139 | [Open](https://jules.google.com/session/4820782180714400139) |
| 4: UI Polish | 🟡 In Progress | 17465481245330366802 | [Open](https://jules.google.com/session/17465481245330366802) |
| 5: Integration | 🟡 In Progress | 4249901200334866252 | [Open](https://jules.google.com/session/4249901200334866252) |
