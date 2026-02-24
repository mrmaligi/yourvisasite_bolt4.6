# AGENTS.md — VisaBuild Project Guide

## What is VisaBuild?
A comprehensive visa management platform connecting applicants with immigration lawyers. Three roles: **User**, **Lawyer**, **Admin**.

> **Scope:** Primary focus is **Australia**, with expansion into **Canada**, **United Kingdom**, and **New Zealand**. Visa data and premium guides exist for all four countries. Future phases may add US and others. Always cite official government immigration sources when adding content.

## Current Status (Feb 2026)
- **Overall Completion:** ~72%
- **Total Visas:** 17 seeded (11 AU + 3 CA + 2 UK + 1 NZ)
- **Pages Built:** 120+ (70 original + 50 new)
- **Database Migrations:** 022 completed
- **Known Issues:** 22 frontend-backend alignment issues documented (Jules-ready)

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend/DB:** Supabase (Auth, Postgres, Edge Functions, RLS)
- **Payments:** Stripe (checkout sessions + webhooks)
- **Routing:** React Router v7 (lazy-loaded pages)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Email:** Resend API
- **Testing:** Playwright (E2E)

## Architecture

### Auth & Roles
- Google Sign-in via Supabase Auth (`src/contexts/AuthContext.tsx`, `src/lib/auth.tsx`)
- Role-based routing: User → `/dashboard/*`, Lawyer → `/lawyer/*`, Admin → `/admin/*`
- Protected routes via `src/components/layout/ProtectedRoute.tsx`
- Each role has its own dashboard layout in `src/components/layout/`

### Database (Supabase)
- Migrations in `supabase/migrations/` (001–022), applied in order
- Core tables: profiles, visas, user_visas, tracker_entries, bookings
- Lawyer & commerce tables in migration 003
- Row-Level Security (RLS) policies in migrations 004, 006, 007, 021
- Tracker algorithm in migration 005 (user input + weighted lawyer input)
- Marketplace system in migrations 009–012
- Notification system in migration 021
- Tracker moderation in migration 021

### Edge Functions (`supabase/functions/`)
- `stripe-checkout` / `stripe-webhook` / `process-payment` / `marketplace-checkout` — payment flows
- `verify-lawyer` — admin approves lawyer credentials
- `elevate-role` — role management
- `seed-admin` / `seed-accounts` — dev seeding
- `refresh-tracker` — recalculate tracker processing times
- `send-email` — Resend integration for notifications
- `consultation-reminders` — daily 24h reminder sends

### Frontend Structure
```
src/
├── components/
│   ├── layout/          # PublicLayout, UserDashboardLayout, LawyerDashboardLayout, AdminDashboardLayout
│   ├── ui/              # Reusable: Button, Card, Input, Modal, Toast, DataTable, FileUpload, Badge, etc.
│   ├── tracker/         # TrackerWizard, TrackerTimeline, TrackerCharts, etc.
│   └── growth/          # EligibilityQuiz, SuccessStories, ReferralDashboard
├── contexts/            # AuthContext, ToastContext, ThemeContext, GlobalSearchContext
├── hooks/               # useVisas, useAuth, useBookings, useProfile, useDocuments, useTracker, useRealtime
├── lib/
│   ├── services/        # visa.service.ts, auth.service.ts, booking.service.ts, premium.service.ts
│   ├── repositories/    # Data access layer
│   ├── errors/          # Error handling
│   └── cache/           # Memory cache
├── pages/
│   ├── public/          # Landing, Login, Register, VisaSearch, VisaDetail, Tracker, LawyerDirectory, News
│   ├── user/            # Dashboard, MyVisas, MyDocuments, Consultations, PremiumContent, Settings, Welcome, Tour
│   ├── lawyer/          # Dashboard, Clients, Availability, Marketing, Marketplace, Tracker, News, Settings, Cases, Billing
│   └── admin/           # Dashboard, UserMgmt, LawyerMgmt, VisaMgmt, PremiumContent, News, Tracker, Pricing, Promos, Analytics
└── types/               # database.ts (TypeScript types)
```

## Key Business Logic

### Freemium Model
- **Free:** Basic visa summary + official immigration links + news
- **Paid ($49/visa):** Unlocks premium content — step-by-step application guide mirroring the immigration site, document upload helper with tooltips explaining each required document category, example filled applications

### Tracker
- Anonymous access (no login required to view/submit)
- Processing time algorithm: combines user submissions + lawyer updates (lawyer inputs carry higher weight)
- Refreshed via `refresh-tracker` edge function
- Auto-flagging for outliers (>3 std dev from mean)
- Moderation queue for flagged entries

### Lawyer Verification Flow
1. Lawyer registers at `/register/lawyer`
2. Uploads proof of practice → status: "pending" (`/lawyer/pending`)
3. Admin approves via LawyerManagement → status: "verified"
4. Lawyer gets full dashboard access

### Consultation Booking
- Users book 30min/1hr calls with lawyers
- Lawyer sets hourly rate → pricing formula calculates user-facing price
- Users can share uploaded documents with approved lawyer
- Communication happens outside the platform (phone/video call)
- ICS calendar export for bookings
- Email notifications via Resend (booking confirmation, 24h reminders, cancellations)

## Known Issues (22 Frontend-Backend Alignment)
See detailed report in memory. Critical issues requiring immediate attention:

| # | Issue | Severity | File |
|---|-------|----------|------|
| 20 | Booking interface field mismatches | **CRITICAL** | `src/types/database.ts` |
| 21 | LawyerProfile column mismatches | **CRITICAL** | `src/types/database.ts` |
| 22 | LawyerDashboard wrong column query | **HIGH** | `src/pages/lawyer/LawyerDashboard.tsx` |
| 18 | useProfile hook wrong column name | **HIGH** | `src/hooks/useProfile.ts` |
| 19 | Dashboard non-existent scheduled_at | **HIGH** | `src/pages/user/UserDashboard.tsx` |

All 22 issues have Jules-ready submissions prepared.

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run test         # Playwright tests
```

## Environment Variables
Requires `.env` with:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `RESEND_API_KEY` — Resend email API key

## Working on This Project
- All pages use lazy loading — keep imports dynamic
- Follow existing patterns: use the shared UI components in `src/components/ui/`
- Database changes → add a new numbered migration in `supabase/migrations/`
- New edge functions → add to `supabase/functions/` with Deno runtime
- RLS is enforced — always consider row-level security when adding tables
- Stripe webhooks handle payment state — don't mutate payment status client-side
- Run `npm run typecheck` before committing — zero TS errors policy

## Documentation Index
| File | Purpose |
|------|---------|
| `AGENTS.md` | This file — project overview for AI agents |
| `README.md` | Public project documentation |
| `NOTES.md` | Detailed backlog and cycle notes |
| `TODO.md` | Task checklist and project plan |
| `GAP-ANALYSIS.md` | Voice notes vs current build comparison |
| `TASK-QUEUE.md` | Cron automation task queue |
| `SPRINT-STATUS.md` | Current sprint progress |
| `JULES_PROMPTS.md` | Jules AI prompts for code generation |
| `FIXES-50.md` | 50 critical fixes tracking |
| `AUDIT_REPORT.md` | Security and code audit results |
| `50_PAGES_IMPLEMENTATION_SUMMARY.md` | 50 new pages project summary |
| `conductor/tracks.md` | Sprint tracks and progress |

---
*Last Updated: February 25, 2026*
