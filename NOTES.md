# VisaBuild Backlog – 18 Feb 2026 (Cycle 2 Update)

_Repo snapshot:_ main branch. Migrations 013-016 now cover **11 visas** across Australia, Canada, and the United Kingdom.

## Current Status (~52% Complete)

### ✅ Completed Workstreams
1. **User Experience:** My Visas dashboard, Consultations page, Document Vault with Supabase Storage upload/download/status tracking
2. **Lawyer Experience:** Registration → Admin approval → Availability management → Public booking (end-to-end), Clients page, Marketing page, Settings
3. **Admin Console:** Lawyer approval/rejection, Premium content CRUD, Activity logs, **Visa Management with Requirements JSON editor (new)**, Tracker management, Promo codes, Pricing
4. **Tracker:** Anonymous submission, weighted stats, trend charts, processing speed ratings on visa detail pages
5. **Premium Content:** Structured step-by-step guides with document categories and evidence callouts
6. **Payment:** **Stripe checkout integration (new)** replacing demo provider — metadata pass-through for visa_id tracking, post-checkout verification
7. **Data Layer:** 11 visas (8 AU + 2 CA + 1 UK) with requirements JSON, premium guides, tracker seed entries, and official citations
8. **Visa Detail UI:** Eligibility criteria, categorized document checklists, official processing time estimates with source links, community tracker with trend charts

### 📊 Seeded Visa Data (11 visas)
| Subclass | Name | Country | Category |
|----------|------|---------|----------|
| 189 | Skilled Independent | Australia | Work (PR) |
| 190 | Skilled Nominated | Australia | Work (PR) |
| 491 | Skilled Work Regional | Australia | Work (Provisional) |
| 494 | Skilled Employer Sponsored Regional | Australia | Work (Provisional) |
| 482 | Temporary Skill Shortage | Australia | Work (Temporary) |
| 186 | Employer Nomination Scheme | Australia | Work (PR) |
| 500 | Student | Australia | Study |
| 600 | Visitor | Australia | Visitor |
| FSW | Federal Skilled Worker (Express Entry) | Canada | Work (PR) |
| CEC | Canadian Experience Class (Express Entry) | Canada | Work (PR) |
| SW-UK | Skilled Worker Visa | United Kingdom | Work |

## What Changed This Cycle (Cycle 2)

1. **Committed previous cycle's work:** Stripe checkout, VisaDetail UI overhaul, useVisas hook improvements
2. **Admin Visa Management enhanced:** Tabbed modal with Details + Requirements JSON editor, inline JSON validation, toggle active/inactive, country search
3. **Modal component:** Added size prop (sm/md/lg/xl) for larger content editing
4. **Canada & UK visa data:** Migration 016 adds FSW, CEC, SW-UK with full requirements JSON, premium step-by-step guides, and tracker seed data
5. **Visa Search:** Added country filter pills (🇦🇺 🇨🇦 🇬🇧) alongside category filters

## Workstream Backlog

### 1. User (applicants)
- **Now:** Saved visas / recently viewed rail, notification preferences
- **Next:** Email alerts for processing time changes, visa comparison tool
- **Later:** Mobile-optimized document scan via camera

### 2. Lawyer experience
- **Now:** Upcoming bookings detail view with client notes, ICS calendar export
- **Next:** Marketing page editor, review/rating management
- **Later:** Revenue analytics dashboard, client messaging

### 3. Admin console
- **Now:** Admin Settings page (platform configuration, feature toggles, email templates)
- **Next:** Tracker moderation (spam flagging/auto-detection), User analytics
- **Later:** Pricing controls with promo code workflows

### 4. Tracker
- **Now:** Comparative analytics (occupation-based trends, country comparison)
- **Next:** Public API with rate limiting
- **Later:** Automated data quality checks

### 5. Premium content
- **Now:** Template-driven step scaffolding for faster content creation
- **Next:** Document category icons and visual checklists
- **Later:** Video walkthroughs, translation toggles

### 6. Consultation & marketplace
- **Now:** Stripe payment for consultation bookings (connect to existing Stripe flow)
- **Next:** Reschedule/cancel flows with notification emails
- **Later:** Bundle consultations with premium guides, lawyer ratings

### 7. Data ingestion (immigration corpus)
- **Now:** ✅ 11 visas across 3 countries
- **Next:** Canada FST (Federal Skilled Trades), Australia Partner (820/801), Australia Parent (143)
- **Later:** New Zealand Skilled Migrant, automated refresh jobs diffing against official sources

## Next Concrete Slice (Cycle 3 Plan)
**Focus:** Consultation Payments + Admin Settings + More Visa Data

1. **Consultation Stripe Integration:** Wire Stripe checkout for lawyer booking payments (connect consultation slots to Stripe)
2. **Admin Settings Page:** Build real platform configuration (site name, default currency, feature toggles, email template management)
3. **Visa Data Expansion:** Add Australia Partner visa (820/801) and Parent visa (143) with full requirements and guides
4. **Saved Visas:** Add "Save" button on visa cards and a "Saved Visas" section in user dashboard

**Deliverables:** Paid consultations, platform configuration, 13+ total visas, user bookmarking.
