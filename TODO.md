# VisaBuild Project Plan

## Phase 1: Documentation & Structure
- [x] Update README.md with the exact project spec.
- [x] Create a TODO.md breaking down the features into coding tasks.

## Phase 2: Database Schema (Supabase)
- [ ] Design the SQL tables.
    - [ ] `profiles` (roles: user/lawyer/admin)
    - [ ] `visas` (visa types and details)
    - [ ] `user_visas` (for paid unlocks/access)
    - [ ] `tracker_entries` (for processing times)
    - [ ] `bookings` (for lawyer consultations)

## Phase 3: Frontend Build
### Tracker
- [ ] Build Anonymous Tracker Interface.
- [ ] Implement processing time algorithm (User input + Weighted Lawyer input).

### Auth & Role System
- [ ] Implement Google Sign-in with Supabase.
- [ ] Set up Role-Based Access Control (RBAC) for User, Lawyer, and Admin.
- [ ] Create basic dashboards for each role.

### User Features (The Applicant)
- [ ] Dashboard: News Feed, Quick Call.
- [ ] Visa Search: Search by keywords/subclass.
- [ ] Freemium Logic:
    - [ ] Free view (Basic summary).
    - [ ] Payment integration (Stripe) for $49/visa.
    - [ ] Premium view (Step-by-step guide, document helper).
- [ ] Consultation Booking System.

### Lawyer Features (The Expert)
- [ ] Verification Process (Upload proof of practice).
- [ ] Lawyer Dashboard: Manage Users, Marketing, Hourly Rates.
- [ ] News Commenting System.
- [ ] Reply to User Reviews.

### Admin Features (The Controller)
- [ ] Admin Dashboard: Overview.
- [ ] User & Lawyer Management (Approve Lawyers).
- [ ] Content Management (Premium content, Doc categories).
- [ ] Pricing Control.
