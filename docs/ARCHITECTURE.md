# VisaBuild - Master Architecture Document

> **Version:** 1.0 | **For:** Jules AI and Developers

---

## 1. Executive Summary

**VisaBuild** is an Australian visa platform with 3 roles:
- **User** - Search visas, unlock premium ($49), book lawyers
- **Lawyer** - Verified experts, paid consultations
- **Admin** - Manage platform, approve lawyers

**Freemium Model:**
- Free: Visa search, basic info, tracker
- Premium ($49/visa): Step-by-step guides, document helper
- Consultations: Book lawyers at hourly rates

---

## 2. System Architecture

```
FRONTEND: React + Vite + TypeScript + Tailwind
    ↓
BACKEND: Supabase (Auth + Postgres + Storage + Edge Functions)
    ↓
EXTERNAL: Stripe (payments), DHA (official links)
```

---

## 3. Feature Modules

### A. Auth & Roles
- **Pages:** `/login`, `/register`, `/register/lawyer`
- **Tables:** `auth.users`, `public.profiles`
- **Functions:** `elevate-role`, `seed-admin`

### B. Visa System
- **Pages:** `/visas`, `/visas/:id`, `/dashboard/premium`
- **Tables:** `visas`, `visa_premium_content`, `user_visa_purchases`
- **Price:** $49 to unlock premium per visa

### C. Tracker
- **Pages:** `/tracker`, `/tracker/submit`
- **Tables:** `tracker_entries`, `tracker_stats`
- **Algorithm:** EWMA with lawyer-weighted inputs

### D. Lawyer Directory
- **Pages:** `/lawyers`, `/lawyers/:id`, `/lawyer/dashboard`
- **Tables:** `lawyer.profiles`, `lawyer.availability`, `bookings`
- **Commission:** 15% platform fee on consultations

### E. Documents
- **Pages:** `/dashboard/documents`
- **Tables:** `user_documents`, `document_shares`
- **Categories:** 19 document types

### F. Admin
- **Pages:** `/admin/*`
- **Features:** Approve lawyers, manage visas, publish news

---

## 4. Database Schema (Key Tables)

```sql
-- Core tables
profiles (id, user_id, role, full_name, phone)
visas (id, subclass, name, country, category, is_active)

-- Lawyer tables  
lawyer.profiles (id, user_id, bar_number, hourly_rate_cents, is_verified)
lawyer.availability (id, lawyer_id, start_time, is_booked)
bookings (id, user_id, lawyer_id, scheduled_at, price_cents, status)

-- Document tables
user_documents (id, user_id, category, file_path, status)
document_shares (id, document_id, lawyer_id, shared_at, revoked_at)

-- Premium tables
visa_premium_content (id, visa_id, section_number, content)
user_visa_purchases (id, user_id, visa_id, amount_cents)

-- Tracker tables
tracker_entries (id, visa_id, processing_days, submitter_role, weight)
tracker_stats (id, visa_id, weighted_avg_days, median_days, p25_days, p75_days)
```

---

## 5. Key User Flows

### Flow 1: User → Premium Unlock
```
/visas → Click visa → View basic info → "Unlock Premium" → Stripe ($49) 
→ Payment webhook → Access premium content
```

### Flow 2: Lawyer → Verification
```
/register/lawyer → Submit bar details + documents → Pending admin 
→ Admin approves → Full lawyer dashboard access
```

### Flow 3: Consultation Booking
```
/lawyers → Select lawyer → Pick time slot → Stripe checkout 
→ Booking confirmed → Lawyer conducts consultation
```

---

## 6. Security (RLS)

| Table | Policy |
|-------|--------|
| `profiles` | Users update own, public read verified lawyers |
| `visas` | Public read active |
| `visa_premium_content` | Read only if purchased |
| `user_documents` | Owner full access, shared lawyers read-only |
| `bookings` | User sees own, lawyer sees assigned |

---

## 7. Edge Functions

| Function | Purpose |
|----------|---------|
| `stripe-checkout` | Create checkout for premium unlock |
| `stripe-webhook` | Handle payment confirmations |
| `consultation-checkout` | Create checkout for bookings |
| `verify-lawyer` | Admin approve lawyer |
| `elevate-role` | Promote user to lawyer/admin |
| `refresh-tracker` | Recalculate tracker stats |

---

## 8. File Structure

```
src/
├── components/
│   ├── ui/           # Button, Card, Input, Modal
│   └── layout/       # PublicLayout, UserLayout, LawyerLayout, AdminLayout
├── pages/
│   ├── public/       # Landing, Visas, Tracker, News
│   ├── user/         # Dashboard, Documents, Premium, Consultations
│   ├── lawyer/       # Dashboard, Clients, Availability
│   └── admin/        # All admin pages
├── contexts/         # AuthContext
├── hooks/            # useAuth, useVisas
├── lib/              # supabase client, utils
└── types/            # TypeScript types
```

---

## 9. External Integrations

- **Stripe:** Payments, subscriptions, webhooks
- **Supabase:** Auth, database, storage, functions
- **DHA Website:** Official visa links (immi.homeaffairs.gov.au)
- **Future:** Zoom (video calls)

---

## 10. Development Guidelines

### Adding a New Visa
1. Insert into `visas` table
2. Create `visa_premium_content` sections
3. Add to tracker if applicable

### Adding a Feature
1. Create component in appropriate folder
2. Add route in `App.tsx`
3. Update RLS policies if needed
4. Add Edge Function if backend needed

### Testing
- Use mock auth for development
- Test RLS policies with different roles
- Verify Stripe webhooks with test mode

---

## Key Docs Location

| Document | Location | Purpose |
|----------|----------|---------|
| This file | `docs/ARCHITECTURE.md` | Master system overview |
| Visa Data | `docs/australian-visa-data-complete.md` | 100+ visa catalog |
| Lawyer Flow | `docs/lawyer-workflow.md` | Consultation system |
| Premium Content | `docs/premium-content.md` | $49 unlock feature |

---

*Master Architecture for VisaBuild - Use this as the starting point for all development work.*
