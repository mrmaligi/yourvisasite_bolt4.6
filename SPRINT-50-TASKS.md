# VisaBuild — 50-Task Sprint to 100% Completion

> **Created:** 2026-02-18  
> **Target:** 5 days (Feb 18–23)  
> **Scope:** Australia-only MVP, Stripe test mode, Supabase Storage  
> **Executor:** Jules (coding) + Main Agent (coordination, research, QA)  
> **Cron:** Every 2 hours → status update to topic:164  

---

## Current State (Honest Assessment)

**What exists:**
- 92 TS/TSX files (~8,867 lines)
- 30 Supabase migrations (schema is solid)
- 81 Australian visas seeded with DHA links
- Full routing in App.tsx (public, user, lawyer, admin)
- Auth context, layout components, UI primitives
- Page files exist for all 3 dashboards

**What's missing/incomplete:**
- Most pages are stubs or partially wired to Supabase
- Stripe checkout/webhook flow not functional
- Document upload not connected to Supabase Storage
- Premium content unlock flow not working end-to-end
- Lawyer verification/booking flow incomplete
- Tracker EWMA algorithm not implemented
- Edge functions not deployed
- RLS policies incomplete for new tables
- No real data flowing through most pages
- No error handling, loading states, or empty states on most pages

**Realistic completion:** ~20-25%

---

## Research Plan

Before starting tasks, we need to verify:

| # | Research Item | Source | Why |
|---|--------------|--------|-----|
| R1 | Current DHA visa subclass list (confirm all 81+) | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing | Ensure no missing/renamed subclasses |
| R2 | DHA official link format per subclass | Same as above | Every visa needs correct `immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/[name]-[subclass]` URL |
| R3 | Supabase Edge Functions deployment method | https://supabase.com/docs/guides/functions | Confirm deploy flow for Stripe webhooks |
| R4 | Stripe test mode setup & webhook config | https://docs.stripe.com/testing | Test keys, webhook signing secret |
| R5 | Supabase Storage bucket setup | https://supabase.com/docs/guides/storage | For document uploads |

**Action:** R1-R2 can be done by agent (web scrape DHA). R3-R5 are reference docs — agent reads before relevant tasks. No human input needed.

---

## 50 Tasks (LLM-Optimized Order)

Tasks are ordered for **sequential AI execution** — each task builds on the previous. Grouped by dependency, not by feature.

### PHASE 1: DATA FOUNDATION (Tasks 1-8) — Day 1

These ensure the database is complete and correct before any UI work.

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **1** | Audit & fix all 81+ visa records | DB | Verify every visa in `visas` table has: correct subclass, name, category, `is_active=true`, official DHA link in `visa_links`. Cross-reference with https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing. Fix any missing/incorrect entries. | — |
| **2** | Complete visa metadata fields | DB | Ensure every visa has: `processing_time_range`, `cost_aud`, `duration`, `key_requirements` (JSON array), `category` matching one of the 15 defined categories. | T1 |
| **3** | Seed premium content for ALL visa subclasses | DB | Every active visa needs at least 3 premium content sections in `visa_premium_content`: (1) Step-by-step guide, (2) Document checklist, (3) Common mistakes/tips. Use DHA info as source. | T1 |
| **4** | Seed document checklist per visa | DB | Create `visa_document_requirements` table (or use existing structure). Map each visa subclass → required document categories from the 19 categories. E.g., Subclass 189 needs: Identity, Character, Health, English, Employment, Qualifications, Skills Assessment, EOI. | T1 |
| **5** | Create processing time seed data | DB | Seed `tracker_entries` with realistic sample data for top 20 visas (at least 10 entries each) so the tracker has data to display on day 1. | T1 |
| **6** | Create `tracker_stats` materialized view or function | DB | Implement the EWMA (Exponentially Weighted Moving Average) calculation. Create a Supabase function `refresh_tracker_stats()` that recalculates weighted averages, median, p25, p75 for each visa. | T5 |
| **7** | RLS policies audit & complete | DB | Review ALL tables. Ensure: `visas` = public read; `visa_premium_content` = read only if user has purchased; `user_documents` = owner only + shared lawyers; `tracker_entries` = public read, authenticated insert; `bookings` = user sees own, lawyer sees assigned; `profiles` = own update, public read for lawyers. | — |
| **8** | Create all Supabase Storage buckets | DB | Create buckets: `documents` (private, per-user), `lawyer-credentials` (private), `avatars` (public). Set storage policies matching RLS. | — |

### PHASE 2: AUTH & CORE INFRASTRUCTURE (Tasks 9-14) — Day 1-2

Wire up auth, roles, and shared infrastructure before any feature pages.

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **9** | Fix AuthContext — full role support | Frontend | Ensure `AuthContext` correctly: fetches `profiles.role` on login, exposes `user`, `role`, `isLoading`, `signIn`, `signOut`, `signUp`. Handle edge cases: no profile row, stale session. | — |
| **10** | Wire ProtectedRoute with role checks | Frontend | `ProtectedRoute` must: redirect to `/login` if unauthenticated, redirect to `/dashboard` if wrong role for `/admin` or `/lawyer` routes, show loading spinner during auth check. | T9 |
| **11** | Create shared hooks | Frontend | `useVisas()` — fetch visas with search/filter/category. `usePremiumContent(visaId)` — fetch sections + purchase status. `useTracker(visaId?)` — fetch stats. `useProfile()` — fetch/update own profile. `useDocuments()` — CRUD user documents. | T9 |
| **12** | Stripe config & checkout component | Frontend | Set up `stripe-config.ts` with test publishable key. Create `StripeCheckout` component that: creates checkout session via Edge Function, redirects to Stripe, handles success/cancel URLs. | — |
| **13** | Create Edge Function: `stripe-checkout` | Backend | Supabase Edge Function that: receives `{ visa_id, user_id, type: 'premium' | 'consultation' }`, creates Stripe checkout session with test keys, returns `{ url }`. | T12 |
| **14** | Create Edge Function: `stripe-webhook` | Backend | Handles `checkout.session.completed`: for premium → insert into `user_visa_purchases`; for consultation → update `bookings.status = 'confirmed'`. Verify Stripe signature. | T13 |

### PHASE 3: PUBLIC PAGES — FULLY FUNCTIONAL (Tasks 15-24) — Day 2-3

Make every public page actually work with real data.

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **15** | Landing page — polish & real content | Frontend | Hero section, 3 feature cards (Search, Track, Consult), stats counter (81 visas, X lawyers), CTA buttons, responsive. Real copy, not lorem ipsum. | — |
| **16** | Visa Search — full functionality | Frontend | Search by name/subclass number, filter by category (15 categories), sort by popularity/name/cost, pagination, card view showing: subclass, name, category, cost, processing time, "View Details" button. Must query `visas` table. | T11 |
| **17** | Visa Detail — complete page | Frontend | Display: all metadata, official DHA link (opens in new tab), processing time stats from tracker, document checklist (free preview of categories), "Unlock Premium Guide — $49" CTA (→ Stripe if logged in, → login if not), related visas in same category. | T11, T16 |
| **18** | Tracker page — working with real data | Frontend | Show all visas with processing time stats (avg, median, range). Bar chart or visual for top visas. Filter by category. "Submit Your Time" button (→ form if logged in). Pull from `tracker_stats`. | T6, T11 |
| **19** | Tracker Submit Form — functional | Frontend | Authenticated users submit: select visa, processing days, application date, decision date, optional notes. Validate inputs. Insert into `tracker_entries`. Show success toast. Recalculate stats (call refresh function). | T6, T18 |
| **20** | Lawyer Directory — working | Frontend | Grid/list of verified lawyers. Show: name, photo, specializations, hourly rate, rating, "Book Consultation" CTA. Filter by specialization (visa category). Search by name. Query `lawyer.profiles` where `is_verified = true`. | T11 |
| **21** | Lawyer Profile page — complete | Frontend | Full lawyer profile: bio, credentials, specializations, hourly rate, availability calendar preview, reviews, "Book Now" button. | T20 |
| **22** | News page — working | Frontend | List published news articles. Show: title, date, excerpt, author, category tag. Pagination. Query `news` table ordered by date. | T11 |
| **23** | News Detail — working | Frontend | Full article view. Markdown/rich text rendering. Author info. Related articles. Lawyer comments section (read-only for public). | T22 |
| **24** | Pricing page — accurate | Frontend | Display: Free tier features, Premium ($49/visa) features, Consultation pricing info. CTA to register. Clear comparison table. | — |

### PHASE 4: USER DASHBOARD — ALL FEATURES (Tasks 25-33) — Day 3-4

Complete user experience after login.

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **25** | User Dashboard — real data | Frontend | Welcome message, quick stats (purchased visas, documents uploaded, upcoming consultations), recent activity feed, quick links to all sections. | T9, T11 |
| **26** | My Visas — purchased visas list | Frontend | Show all visas user has purchased premium access for. Status badge (active/expired). "View Guide" button per visa. Link to purchase more. Query `user_visa_purchases` joined with `visas`. | T11, T14 |
| **27** | Premium Content Viewer | Frontend | After purchase: display all sections for that visa. Step-by-step guide with progress tracking (checkboxes, saved to localStorage or DB). Section navigation sidebar. Print-friendly view. | T3, T26 |
| **28** | Document Upload — Supabase Storage | Frontend | `MyDocuments` page: upload files to Supabase Storage `documents` bucket. Categorize by 19 document types. Show upload progress. List uploaded docs with: name, category, date, size, status. Delete functionality. | T8, T11 |
| **29** | Document checklist per visa | Frontend | On premium content page: show required documents for this visa (from T4 data). Checkboxes. Auto-match uploaded documents to requirements. Visual progress (e.g., "7/12 documents uploaded"). | T4, T28 |
| **30** | Saved Visas (bookmarks) | Frontend | Save/unsave visas from search/detail pages. `SavedVisas` page shows bookmarked visas. Heart/bookmark icon toggle. Query `saved_visas` table. | T11 |
| **31** | Consultations page — booking flow | Frontend | List upcoming/past consultations. "Book New" button → Lawyer Directory. Show: lawyer name, date/time, status, price. Cancel button (if > 24h before). | T14, T20 |
| **32** | Consultation booking flow | Frontend | From lawyer profile: select available time slot → confirm details → Stripe checkout → booking created with status "pending" → webhook confirms → status "confirmed". | T13, T14, T21 |
| **33** | User Settings page | Frontend | Edit: full name, phone, email (read-only), notification preferences, change password. Update `profiles` table. | T9 |

### PHASE 5: LAWYER DASHBOARD — ALL FEATURES (Tasks 34-41) — Day 4

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **34** | Lawyer Registration flow | Frontend | `/register/lawyer`: form with bar number, jurisdiction, specializations (multi-select visa categories), hourly rate, credential upload (to Storage). Creates profile with `is_verified = false`. Redirect to `/lawyer/pending`. | T8, T9 |
| **35** | Lawyer Pending page | Frontend | "Your application is under review" message. Show submitted details. Status indicator. Link to edit (if still pending). | T34 |
| **36** | Lawyer Dashboard — real data | Frontend | Stats: total clients, upcoming consultations, earnings this month, rating. Upcoming appointments list. Recent client activity. | T9 |
| **37** | Clients page | Frontend | List all clients who have booked with this lawyer. Show: name, visa type, consultation date, status. Click to view client's shared documents. | T36 |
| **38** | Availability management | Frontend | Calendar UI for lawyer to set available time slots. Weekly recurring + one-off slots. Block out dates. Update `lawyer.availability` table. | T36 |
| **39** | Lawyer Tracker — weighted submissions | Frontend | Lawyers can submit processing times (higher weight in EWMA). Same form as public but with `submitter_role = 'lawyer'` and `weight = 2.0`. | T6, T19 |
| **40** | Lawyer News — comment/publish | Frontend | View published news. Lawyers can write articles (submitted for admin approval). Comment on existing articles. | T22 |
| **41** | Lawyer Settings | Frontend | Edit: profile info, hourly rate, specializations, bio, profile photo upload, notification preferences. | T36 |

### PHASE 6: ADMIN DASHBOARD — ALL FEATURES (Tasks 42-47) — Day 4-5

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **42** | Admin Dashboard — real stats | Frontend | Platform overview: total users, lawyers (pending/verified), visas, revenue (Stripe test), recent activity. Charts/graphs. | T9 |
| **43** | User Management | Frontend | List all users. Search/filter. View profile details. Change roles. Disable accounts. Pagination. | T42 |
| **44** | Lawyer Management — approve/reject | Frontend | List pending lawyer applications. Review credentials. Approve (sets `is_verified = true`) or reject with reason. List all verified lawyers. | T34, T42 |
| **45** | Visa Management — CRUD | Frontend | List all 81+ visas. Edit visa details. Toggle `is_active`. Add new visa. Edit premium content sections inline. Bulk operations. | T42 |
| **46** | News Management — publish/edit | Frontend | Create/edit/delete news articles. Rich text editor (or markdown). Set publish status. Manage categories. | T42 |
| **47** | Tracker & Premium Content Management | Frontend | View tracker submissions. Moderate (approve/flag/delete). View premium content purchases. Revenue reports. | T42 |

### PHASE 7: POLISH & DEPLOY (Tasks 48-50) — Day 5

| # | Task | Type | Description | Depends On |
|---|------|------|-------------|------------|
| **48** | Error handling & loading states | Frontend | Every page: loading skeleton, error boundary, empty state, toast notifications for actions. 404 page. Network error handling. | All above |
| **49** | Responsive design & UI polish | Frontend | Test all pages at mobile/tablet/desktop. Fix layout issues. Consistent spacing, colors, typography. Dark mode if time permits. Accessibility basics (labels, aria, focus). | T48 |
| **50** | Build verification & deploy prep | DevOps | `npm run build` with zero errors. Fix all TypeScript errors. Test all routes manually. Create `.env.example`. Update README with setup instructions. Verify Supabase migrations apply cleanly. Document any manual setup steps. | T49 |

---

## Execution Strategy

### How Tasks Get Done

```
Main Agent (me)                    Jules (Google AI)
─────────────────                  ─────────────────
1. Pick next task                  
2. Write detailed prompt    ───►   3. Implement code
4. Review output            ◄───   
5. Test / fix issues        ───►   6. Fix if needed
7. Commit & push            
8. Update this file         
9. Next task                
```

### Cron Job (Every 2 Hours)
Reports to topic:164:
- Tasks completed since last update
- Current task in progress
- Blockers (if any)
- Projected completion %

### Rules
1. **Australia ONLY** — no other countries in MVP
2. **Stripe TEST MODE** — fake payments, test keys only
3. **Supabase Storage** — for all file uploads
4. **Official DHA links** — every visa links to `immi.homeaffairs.gov.au`
5. **Only ask human if truly blocked** — use best judgment otherwise
6. **LLM-first order** — tasks are sequenced for AI to execute without context-switching

---

## Progress Tracker

| Phase | Tasks | Status | % |
|-------|-------|--------|---|
| 1. Data Foundation | 1-8 | ⬜ Not Started | 0% |
| 2. Auth & Infrastructure | 9-14 | ⬜ Not Started | 0% |
| 3. Public Pages | 15-24 | ⬜ Not Started | 0% |
| 4. User Dashboard | 25-33 | ⬜ Not Started | 0% |
| 5. Lawyer Dashboard | 34-41 | ⬜ Not Started | 0% |
| 6. Admin Dashboard | 42-47 | ⬜ Not Started | 0% |
| 7. Polish & Deploy | 48-50 | ⬜ Not Started | 0% |
| **TOTAL** | **50** | **⬜** | **0%** |

---

## Questions for Mk (Before Starting)

None blocking — all constraints are clear:
- ✅ Australia only
- ✅ Stripe test mode
- ✅ Supabase Storage
- ✅ All visa subclasses
- ✅ Official DHA links
- ✅ Jules + Agent workflow
- ✅ 2-hour cron updates

**Ready to start on your "go".**
