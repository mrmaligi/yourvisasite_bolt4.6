# VisaBuild Backlog – 25 Feb 2026

_Repo snapshot:_ main branch @ Cycle 6. Migrations 001-022. **17 visas** across 4 countries.

## Current Status (~72% Complete)

### ✅ Completed Workstreams
1. **User Experience:** My Visas dashboard, Saved/Bookmarked Visas, Consultations page with Stripe payments, ICS calendar export, Document Vault with Supabase Storage, dashboard stat cards (5 metrics), notification preferences, Welcome/Tour pages
2. **Lawyer Experience:** Registration → Admin approval → Availability management → Public booking with payment, Clients page, Marketing page, Settings, Cases management, Billing
3. **Admin Console:** Lawyer approval/rejection, Premium content CRUD, Activity logs, Visa Management with Requirements JSON editor, Tracker management, Promo codes, Pricing, Platform Settings with feature toggles, country management, tracker moderation tools
4. **Tracker:** Anonymous submission, weighted stats, trend charts, processing speed ratings, auto-flagging for outliers, moderation queue, report functionality, visual timeline
5. **Premium Content:** Structured step-by-step guides for **17 visas**, admin CRUD, Stripe checkout integration
6. **Payment:** Stripe checkout integration for premium content + consultation bookings, metadata pass-through, post-checkout verification, webhook handlers
7. **Data Layer:** **17 visas** (11 AU + 3 CA + 2 UK + 1 NZ) with requirements JSON, premium guides, tracker data, and official citations
8. **Visa Detail UI:** Eligibility criteria, categorized document checklists, official processing time estimates with source links, community tracker with trend charts
9. **Platform Configuration:** Key-value settings table with admin UI
10. **Email Notifications:** Resend integration, templates for booking confirmations, reminders (24h), cancellations, processing alerts, welcome, premium purchase
11. **50 New Pages:** Complete user, lawyer, admin, and public page expansion (120+ total pages)

### 📊 Seeded Visa Data (17 visas)
| Subclass | Name | Country | Category |
|----------|------|---------|----------|
| 189 | Skilled Independent | Australia | Work (PR) |
| 190 | Skilled Nominated | Australia | Work (PR) |
| 491 | Skilled Work Regional | Australia | Work (Provisional) |
| 494 | Skilled Employer Sponsored Regional | Australia | Work (Provisional) |
| 482 | Temporary Skill Shortage | Australia | Work (Temporary) |
| 186 | Employer Nomination Scheme | Australia | Work (PR) |
| 485 | Temporary Graduate | Australia | Work (Temporary) |
| 500 | Student | Australia | Study |
| 600 | Visitor | Australia | Visitor |
| 820/801 | Partner (Temporary & Permanent) | Australia | Family |
| 143 | Contributory Parent | Australia | Family |
| FSW | Federal Skilled Worker (Express Entry) | Canada | Work (PR) |
| CEC | Canadian Experience Class (Express Entry) | Canada | Work (PR) |
| FST | Federal Skilled Trades (Express Entry) | Canada | Work (PR) |
| SW-UK | Skilled Worker Visa | United Kingdom | Work |
| UK-FAMILY | Family Visa (Spouse/Partner) | United Kingdom | Family |
| SMC | Skilled Migrant Category | New Zealand | Work (PR) |

## What Changed Recently

### Cycle 6 (Current)
1. **50 Pages Implementation:**
   - User pages: Welcome, Tour, Getting Started, Visa Roadmap, Document Checklist, etc.
   - Lawyer pages: Enhanced Profile, Reviews, Analytics, Billing, Contracts, Team, Cases
   - Admin pages: Content, Media, Support Tickets, Analytics, Reports, Audit Log
   - Public pages: Resources, Guides, Checklists, Templates, Webinars

2. **TypeScript & Build Fixes:**
   - Fixed all TS errors across 50+ files
   - Removed unused imports
   - Fixed type definitions
   - Zero build errors policy enforced

3. **Security Audit Fixes:**
   - Fixed RLS policies with proper WITH CHECK clauses
   - Secured consultation_slots, saved_visas, marketplace_listings
   - Added input validation recommendations

### Previous Cycles (1-5)
- **Cycle 5:** Email notification system, tracker moderation, 3 new visas (NZ SMC, CA FST, UK Family)
- **Cycle 4:** Document upload system, premium content viewer, consultation booking
- **Cycle 3:** Admin dashboard, lawyer management, visa CRUD
- **Cycle 2:** User dashboard, My Visas, saved visas
- **Cycle 1:** Foundation - auth, tracker, landing page, visa search

## Workstream Backlog

### 1. User (applicants) — ~85% done
- **Done:** Dashboard, My Visas, Saved Visas, Documents, Consultations, Settings, Notification preferences, Welcome/Tour
- **Now:** Reschedule/cancel consultation flows
- **Next:** Visa comparison tool (side-by-side feature comparison)
- **Later:** Mobile-optimized document scan via camera

### 2. Lawyer experience — ~75% done
- **Done:** Registration, verification, dashboard, clients, availability, booking, marketplace, settings, cases, billing
- **Now:** Upcoming bookings detail view with client notes, revenue analytics
- **Next:** Marketing page editor, review/rating management
- **Later:** Client messaging system

### 3. Admin console — ~85% done
- **Done:** Dashboard, users, lawyers, visas, premium, news, tracker, pricing, promos, activity log, settings, tracker moderation, content management
- **Now:** Email template management in admin UI
- **Next:** User analytics dashboard
- **Later:** Advanced reporting, audit trail enhancements

### 4. Tracker — ~80% done
- **Done:** Anonymous submission, weighted stats, trend charts, processing speed ratings, auto-flagging, moderation, visual timeline
- **Now:** Comparative analytics (occupation-based trends, country comparison)
- **Next:** Public API with rate limiting
- **Later:** Automated data quality checks, processing time predictions

### 5. Premium content — ~70% done
- **Done:** Step-by-step guides for 17 visas, admin CRUD, Stripe checkout
- **Now:** Template-driven step scaffolding for faster content creation
- **Next:** Document category icons and visual checklists
- **Later:** Video walkthroughs, translation toggles

### 6. Consultation & marketplace — ~80% done
- **Done:** Lawyer directory, profiles, slot booking with Stripe payment, ICS calendar export, marketplace, email notifications
- **Now:** Reschedule/cancel flows with refund handling
- **Next:** Bundle consultations with premium guides, lawyer ratings
- **Later:** Video consultation integration

### 7. Data ingestion (immigration corpus) — ~70% done
- **Done:** 17 visas across 4 countries with requirements, guides, tracker data
- **Now:** Australia — remaining family visas (Remaining Relative, Aged Dependent), New Zealand work visas
- **Next:** Canada PNP streams, UK Student visas
- **Later:** Automated refresh jobs diffing against official sources

## Critical Issues (22 Alignment Problems)
All documented with Jules-ready fixes. See AGENTS.md for summary.

## Unmerged Branches (from Jules)
- `fix-errors-update-ui` — UI component consolidation. Still has merge conflicts with main. Should be resolved in a dedicated session.
- `mock-auth-seed-users` — Mock auth + seed users for dev testing.
- `stitch-ui-redesign` — UI design references (docs only).

## Next Concrete Slice (Cycle 7 Plan)
**Focus:** Frontend-Backend Alignment + Consultation Management + Data Expansion

1. **Fix 22 Alignment Issues:**
   - Booking interface field mismatches
   - LawyerProfile column mismatches
   - Dashboard column name fixes
   - All Jules-ready submissions

2. **Reschedule/Cancel Consultations:**
   - User-initiated reschedule flow (select new slot, transfer payment)
   - Cancellation with automatic refund processing via Stripe
   - Lawyer-initiated cancellation with mandatory reason
   - Email notifications for all changes

3. **Visa Data Expansion:**
   - Add New Zealand Work to Residence visas (Accredited Employer, Care Workforce)
   - Add Australia Remaining Relative visa (subclass 115)
   - Add UK Student visa (Tier 4 General)

4. **Lawyer Revenue Dashboard:**
   - Monthly earnings view
   - Booking statistics
   - Payout tracking

**Deliverables:** Full consultation lifecycle management, resolved alignment issues, 20+ total visas, lawyer revenue insights.

## Immigration Data Citations
All data sourced from official government sources:
- Immigration New Zealand – Skilled Migrant Category
- IRCC – Federal Skilled Trades Program
- UK Gov – Family visas guidance
- Australian Department of Home Affairs

Citations embedded in each visa's `requirements_json.citations` array for audit trail.

## Integration Testing Report (Feb 2026)

### Summary
Integration tests were added using Playwright to verify the integrity of the application routes and authentication flows. The tests now include mocked Supabase responses to verify UI logic independently of the backend connection.

### Results
- **Public Routes:** All public pages (Landing, Visa Search, Tracker, Lawyers, News, Marketplace, Pricing) load successfully.
- **Data Rendering:** Mocked data tests confirm that Visa Search and Tracker pages correctly render data fetched from the backend (e.g., visa names, processing times).
- **Authentication:**
    - Login and Register pages render correctly.
    - Error handling logic (e.g., invalid credentials toast) is verified using mocked failure responses.
- **Role-Based Access:** Protected routes (`/dashboard`, `/lawyer/dashboard`, `/admin`) correctly redirect unauthenticated users to the login page.
- **Error Handling:**
    - Visa Detail page gracefully handles "not found" states (mocked network failure).
    - Login page correctly displays error messages on mocked authentication failure.

### Infrastructure
- **Playwright:** Configured to run against local development server.
- **Mocks:** Network interception used to mock Supabase Auth and Database queries.
- **Environment:** Placeholder environment variables provided to allow application startup during testing.
- **Artifacts:** Test reports and results are excluded from the repository via `.gitignore` to prevent bloat.

---
*Last Updated: February 25, 2026*
