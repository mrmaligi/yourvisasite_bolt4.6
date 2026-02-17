# AGENTS.md — VisaBuild Project Guide

## What is VisaBuild?
A comprehensive visa management platform connecting applicants with immigration lawyers. Three roles: **User**, **Lawyer**, **Admin**.

> **Scope:** Currently **Australia-only**. All visa data, categories, subclasses, and immigration links target the Australian Department of Home Affairs. International expansion is planned for later phases — do not build for other countries yet.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend/DB:** Supabase (Auth, Postgres, Edge Functions, RLS)
- **Payments:** Stripe (checkout sessions + webhooks)
- **Routing:** React Router v7 (lazy-loaded pages)
- **Charts:** Recharts
- **Icons:** Lucide React

## Architecture

### Auth & Roles
- Google Sign-in via Supabase Auth (`src/contexts/AuthContext.tsx`, `src/lib/auth.tsx`)
- Role-based routing: User → `/dashboard/*`, Lawyer → `/lawyer/*`, Admin → `/admin/*`
- Protected routes via `src/components/layout/ProtectedRoute.tsx`
- Each role has its own dashboard layout in `src/components/layout/`

### Database (Supabase)
- Migrations in `supabase/migrations/` (001–012), applied in order
- Core tables: profiles, visas, user_visas, tracker_entries, bookings
- Lawyer & commerce tables in migration 003
- Row-Level Security (RLS) policies in migrations 004, 006, 007
- Tracker algorithm in migration 005 (user input + weighted lawyer input)
- Marketplace system in migrations 009–012

### Edge Functions (`supabase/functions/`)
- `stripe-checkout` / `stripe-webhook` / `process-payment` / `marketplace-checkout` — payment flows
- `verify-lawyer` — admin approves lawyer credentials
- `elevate-role` — role management
- `seed-admin` / `seed-accounts` — dev seeding
- `refresh-tracker` — recalculate tracker processing times

### Frontend Structure
```
src/
├── components/
│   ├── layout/          # PublicLayout, UserDashboardLayout, LawyerDashboardLayout, AdminDashboardLayout
│   └── ui/              # Reusable: Button, Card, Input, Modal, Toast, DataTable, FileUpload, Badge, etc.
├── contexts/            # AuthContext (global auth state)
├── hooks/               # useVisas
├── lib/                 # supabase client, auth helpers, constants
├── pages/
│   ├── public/          # Landing, Login, Register, VisaSearch, VisaDetail, Tracker, LawyerDirectory, News
│   ├── user/            # Dashboard, MyVisas, MyDocuments, Consultations, PremiumContent, Settings
│   ├── lawyer/          # Dashboard, Clients, Availability, Marketing, Marketplace, Tracker, News, Settings
│   └── admin/           # Dashboard, UserMgmt, LawyerMgmt, VisaMgmt, PremiumContent, News, Tracker, Pricing, Promos
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

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Environment Variables
Requires `.env` with:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

## Working on This Project
- All pages use lazy loading — keep imports dynamic
- Follow existing patterns: use the shared UI components in `src/components/ui/`
- Database changes → add a new numbered migration in `supabase/migrations/`
- New edge functions → add to `supabase/functions/` with Deno runtime
- RLS is enforced — always consider row-level security when adding tables
- Stripe webhooks handle payment state — don't mutate payment status client-side
