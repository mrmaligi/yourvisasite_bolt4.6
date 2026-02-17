# VisaBuild Backlog – 18 Feb 2026

_Repo snapshot:_ main branch. Migrations 013-015 seeded with **8 Australian visas** covering skilled, regional, employer-sponsored, study, and visitor categories.

## Current Status (~45% Complete)

### ✅ Completed Workstreams
1. **User Experience:** My Visas dashboard connected to `user_visa_purchases`, Consultations page with booking management
2. **Lawyer Experience:** Registration with document upload → Admin approval → Availability management → Public booking (end-to-end)
3. **Admin Console:** Lawyer approval/rejection with notes, Premium content CRUD editor, Activity logs
4. **Tracker:** Anonymous submission, weighted stats, trend charts on visa detail pages
5. **Premium Content:** Structured step-by-step guides rendering with document categories
6. **Data Layer:** 8 visas with requirements JSON, premium content, tracker entries, and official citations

### 📊 Seeded Visa Data (8 visas)
| Subclass | Name | Category |
|----------|------|----------|
| 189 | Skilled Independent | Work (PR) |
| 190 | Skilled Nominated | Work (PR) |
| 491 | Skilled Work Regional | Work (Provisional) |
| 494 | Skilled Employer Sponsored Regional | Work (Provisional) |
| 482 | Temporary Skill Shortage | Work (Temporary) |
| 186 | Employer Nomination Scheme | Work (PR) |
| 500 | Student | Study |
| 600 | Visitor | Visitor |

## Workstream Backlog

### 1. User (applicants)
- **Now:** Document upload helper in My Documents (OCR hints, progress tracking)
- **Next:** Saved visas / recently viewed rail on `/visas`
- **Later:** Notification preferences, email alerts for processing time changes

### 2. Lawyer experience
- **Now:** Upcoming bookings detail view with client notes
- **Next:** ICS calendar export for consultation slots
- **Later:** Marketing page editor, review management

### 3. Admin console
- **Now:** Visa management CRUD (add/edit visa metadata, requirements JSON)
- **Next:** Tracker moderation (flag/remove spam entries)
- **Later:** Pricing controls with promo code workflows

### 4. Tracker
- **Now:** Admin spam detection and override tools
- **Next:** Comparative analytics (occupation-based trends)
- **Later:** Public API with rate limiting

### 5. Premium content
- **Now:** Template-driven step scaffolding for faster content creation
- **Next:** Document category icons and visual checklists
- **Later:** Video walkthroughs, translation toggles

### 6. Consultation & marketplace
- **Now:** Real payment integration (Stripe) for paid consultations
- **Next:** Reschedule/cancel flows with notification emails
- **Later:** Bundle consultations with premium guides

### 7. Data ingestion (immigration corpus)
- **Now:** **DONE:** 8 Australian visas with structured JSON, premium guides, tracker seed data
- **Next:** Canada Express Entry (FSW, CEC, FST), UK Skilled Worker visa
- **Later:** Automated refresh jobs diffing against official sources

## Next Concrete Slice (Cycle Plan)
**Focus:** Admin Visa Management + Document Upload

1. **Admin Visa CRUD:** Build interface to add/edit visa metadata and requirements JSON without SQL
2. **User Document Upload:** Connect My Documents page to Supabase Storage with drag-drop, OCR hints
3. **Payment Integration:** Replace demo provider with Stripe checkout for premium guide purchases

**Deliverables:** Self-serve visa management, functional document storage, real payment flow.
