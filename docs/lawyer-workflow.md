# VisaBuild Lawyer Workflow & Consultation Booking System

## Table of Contents
1. [Overview](#overview)
2. [Lawyer Registration & Verification Flow](#1-lawyer-registration--verification-flow)
3. [Lawyer Dashboard Features](#2-lawyer-dashboard-features)
4. [Consultation Booking Flow](#3-consultation-booking-flow)
5. [Pricing Structure](#4-pricing-structure)
6. [Document Sharing](#5-document-sharing)
7. [Database Schema](#6-database-schema)
8. [Integration Notes](#7-integration-notes)
9. [Sample Data & Flows](#8-sample-data--flows)

---

## Overview

VisaBuild is an Australian visa platform with three primary roles:
- **User (Applicant)**: Seeks visa information and books consultations
- **Lawyer (Verified Expert)**: Provides paid consultations and immigration advice
- **Admin (Overseer)**: Manages platform, approves lawyers, and monitors activity

The lawyer workflow involves:
1. Registration with credential verification
2. Admin approval process
3. Profile and availability management
4. Paid consultation bookings via Stripe
5. Client management and document access

---

## 1. Lawyer Registration & Verification Flow

### 1.1 Complete Registration Journey

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        LAWYER REGISTRATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   START      │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  PREREQUISITE: User must have VisaBuild account              │
    │  (Regular user registration via Supabase Auth)               │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 1: Navigate to Lawyer Registration                     │
    │  Route: /lawyer/register                                     │
    │  Component: LawyerRegister.tsx                               │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 2: Professional Details (Form)                         │
    │  ─────────────────────────────────────                       │
    │  • Bar Number (required)                                     │
    │  • Jurisdiction (required) - e.g., "Australia", "Victoria"   │
    │  • Practice Areas (comma-separated)                          │
    │    - e.g., "Family Immigration, Business Visas"              │
    │  • Years of Experience (number)                              │
    │  • Professional Bio (optional)                               │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 3: Verification Document Upload                        │
    │  ─────────────────────────────────────                       │
    │  Required Documents:                                         │
    │  • Bar license / Practicing certificate                      │
    │  • Professional ID card                                      │
    │  • Any government-issued legal practice proof                │
    │                                                              │
    │  Storage: Supabase Storage → 'lawyer-verification' bucket    │
    │  Path format: {user_id}/{timestamp}_{filename}               │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 4: Submit Registration                                 │
    │  ─────────────────────────────                               │
    │  Actions:                                                    │
    │  1. Upload document to storage                               │
    │  2. Insert lawyer.profiles record                            │
    │  3. Call elevate-role Edge Function                          │
    │  4. Update auth user metadata role='lawyer'                  │
    │                                                              │
    │  Initial Status: verification_status = 'pending'             │
    │                  is_verified = false                         │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 5: Pending Verification                                │
    │  Route: /lawyer/pending                                      │
    │  Component: LawyerPending.tsx                                │
    │                                                              │
    │  User sees: "Your account is pending admin verification"     │
    │  Restricted: Cannot access lawyer features until approved    │
    └──────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  STEP 6: Admin Review Process                                │
    │  ─────────────────────────────                               │
    │  Route: /admin/lawyers                                       │
    │  Component: LawyerManagement.tsx                             │
    │                                                              │
    │  Admin Actions:                                              │
    │  • View all pending lawyer registrations                     │
    │  • View uploaded verification documents                      │
    │  • Approve or Reject with reason                             │
    └──────────────────────────────────────────────────────────────┘
           │
           ├────────────────────┬────────────────────┐
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │   APPROVED   │    │   REJECTED   │    │  REAPPLY     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │• Status:        │  │• Status:        │  │• Clear previous │
    │  'approved'     │  │  'rejected'     │  │  rejection     │
    │• is_verified:   │  │• rejection_     │  │• Allow new     │
    │  true           │  │  reason stored  │  │  submission    │
    │• verified_at    │  │• Can reapply    │  │• New document  │
    │• verified_by    │  │  after fixing    │  │  upload        │
    │  (admin_id)     │  │  issues          │  │                │
    │• Full access    │  │                  │  │                │
    │  to platform    │  │                  │  │                │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 1.2 Database State Transitions

| Status | is_verified | Meaning | Access Level |
|--------|-------------|---------|--------------|
| `pending` | `false` | Awaiting admin review | Can view pending page only |
| `approved` | `true` | Verified lawyer | Full lawyer dashboard access |
| `rejected` | `false` | Rejected with reason | Can reapply with corrections |

### 1.3 Rejection & Reapplication

When a lawyer is rejected:
1. `verification_status` is set to `'rejected'`
2. `rejection_reason` is stored (required field)
3. Lawyer can:
   - View rejection reason on pending page
   - Update their profile and documents
   - Resubmit for approval (status resets to 'pending')

---

## 2. Lawyer Dashboard Features

### 2.1 Dashboard Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        LAWYER DASHBOARD ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │                         LAWYER LAYOUT                                │
    │  (layouts/LawyerLayout.tsx - shown only when role='lawyer')         │
    └─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
   ┌─────────┐               ┌─────────┐                 ┌─────────┐
   │ Sidebar │               │  Main   │                 │ Status  │
   │  Nav    │               │ Content │                 │  Bar    │
   └────┬────┘               └────┬────┘                 └────┬────┘
        │                         │                           │
   ┌────┴─────────────────────────┴───────────────────────────┴────┐
   │  Navigation Items:                                             │
   │  • Dashboard      • Clients       • Availability              │
   │  • Settings       • News          • Tracker                   │
   │  • Marketplace    • Marketing                                 │
   └────────────────────────────────────────────────────────────────┘
```

### 2.2 Feature List by Screen

#### Dashboard (`/lawyer/dashboard`)
| Feature | Description | Component |
|---------|-------------|-----------|
| Stats Cards | Total clients, upcoming sessions, estimated earnings | Stat cards with icons |
| Verification Status | Banner showing verification state | SubscriptionStatus |
| Recent Bookings | Last 5 booking activities | List view |
| Quick Actions | Links to Availability, Clients | Button group |

#### Availability (`/lawyer/availability`)
| Feature | Description | Implementation |
|---------|-------------|----------------|
| View Slots | List all created time slots | Calendar/Card view |
| Add Slot | Create new availability | Form with datetime-local inputs |
| Delete Slot | Remove unbooked slots | Only if `is_booked=false` |
| Slot Status | Shows booked vs available | Badge indicators |

#### Clients (`/lawyer/clients`)
| Feature | Description | Data Shown |
|---------|-------------|------------|
| Client List | All users who booked consultations | Name, phone, total bookings, total spent |
| Recent Bookings | Last 5 bookings with details | Status, notes, date, amount |
| Client Summary | Aggregated per-client metrics | Booking count, last session, total revenue |

#### Settings (`/lawyer/settings`)
| Feature | Description | Editable |
|---------|-------------|----------|
| Personal Info | Name, phone | Yes |
| Professional Info | Jurisdiction, license, experience | Yes |
| Hourly Rate | Consultation pricing | Yes |
| Specializations | Practice areas | Yes (comma-separated) |
| Bio | Professional description | Yes |

#### Marketing (`/lawyer/marketing`)
| Feature | Description |
|---------|-------------|
| Profile Visibility | Toggle public listing |
| SEO Description | Custom meta description |
| Featured Services | Highlight specific services |

#### Tracker (`/lawyer/tracker`)
| Feature | Description | Weight |
|---------|-------------|--------|
| Submit Processing Time | Report visa processing duration | Higher weight (lawyer verified) |
| View Trends | See processing time statistics | Read-only |

#### News (`/lawyer/news`)
| Feature | Description | Permission |
|---------|-------------|------------|
| View Articles | Read immigration news | All users |
| Comment | Add professional comments | Lawyers only |

#### Marketplace (`/lawyer/marketplace`)
| Feature | Description |
|---------|-------------|
| Service Listings | Create service packages |
| Pricing Management | Set package prices |
| Reviews | View client ratings |

---

## 3. Consultation Booking Flow

### 3.1 End-to-End User Perspective

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     CONSULTATION BOOKING - USER FLOW                             │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  PHASE 1: DISCOVERY                                                      │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 1: Browse Lawyer Directory                                        │
    │  Route: /lawyers                                                        │
    │  Component: LawyerDirectory.tsx                                         │
    │                                                                          │
    │  Filters Available:                                                     │
    │  • Search by name, specialty, jurisdiction (text)                       │
    │  • Jurisdiction dropdown                                                │
    │                                                                          │
    │  Displayed Info:                                                        │
    │  • Name, avatar, jurisdiction                                           │
    │  • Practice areas (badges)                                              │
    │  • Years of experience                                                  │
    │  • Hourly rate                                                          │
    │  • Available slots count                                                │
    │  • Verification badge                                                   │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 2: View Lawyer Profile                                            │
    │  Route: /lawyers/:id                                                    │
    │  Component: LawyerProfile.tsx                                           │
    │                                                                          │
    │  Profile Sections:                                                      │
    │  • Header: Name, photo, verification badge                              │
    │  • Stats: Jurisdiction, experience, rate                                │
    │  • About: Full professional bio                                         │
    │  • Specialties: All practice areas                                      │
    │  • Availability Calendar: Bookable time slots                           │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  PHASE 2: BOOKING                                                        │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 3: Select Time Slot                                               │
    │                                                                          │
    │  Slot Display:                                                          │
    │  • Grouped by date ("Monday, February 17")                              │
    │  • Time range buttons (e.g., "9:00 AM - 10:00 AM")                      │
    │  • Only unbooked, unreserved slots shown                                │
    │                                                                          │
    │  Selection:                                                             │
    │  • Click slot → Opens booking modal                                     │
    │  • Requires authentication (prompt to login if not)                     │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 4: Booking Modal                                                  │
    │                                                                          │
    │  Information Displayed:                                                 │
    │  • Lawyer name                                                          │
    │  • Selected date & time                                                 │
    │  • Duration (calculated from slot)                                      │
    │  • Estimated cost: (hourly_rate / 60) * duration_minutes                │
    │                                                                          │
    │  User Input:                                                            │
    │  • Notes (optional): "Briefly describe your visa situation..."          │
    │    - Used for pre-consultation context                                  │
    │    - Lawyer reviews before meeting                                      │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 5: Stripe Payment Flow                                            │
    │  Edge Function: consultation-checkout                                   │
    │                                                                          │
    │  Actions:                                                               │
    │  1. Validate slot is still available                                    │
    │  2. Create booking record (status='pending')                            │
    │  3. Reserve slot for 15 minutes (is_reserved=true)                      │
    │  4. Calculate price: lawyer.hourly_rate_cents / 60 * duration           │
    │  5. Create Stripe Checkout Session                                      │
    │  6. Redirect to Stripe Checkout                                         │
    │                                                                          │
    │  Slot Reservation:                                                      │
    │  • 15-minute hold during checkout                                       │
    │  • Reserved_until timestamp                                             │
    │  • Other users cannot book same slot                                    │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ├──────────────────────────┬──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
    │   SUCCESS    │          │    CANCEL    │          │    EXPIRE    │
    └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
           │                          │                          │
           ▼                          ▼                          ▼
    ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
    │ Webhook:        │      │ Booking:        │      │ Booking:        │
    │ checkout.       │      │ status='cancel' │      │ status='cancel' │
    │ session.        │      │ payment_status= │      │ payment_status= │
    │ completed       │      │ 'failed'        │      │ 'failed'        │
    │                 │      │                 │      │                 │
    │ • Booking:      │      │ Slot:           │      │ Slot:           │
    │   status='conf' │      │ is_reserved=    │      │ is_reserved=    │
    │   payment_status│      │ false           │      │ false           │
    │   ='paid'       │      │ reserved_until= │      │ reserved_until= │
    │   confirmed_at  │      │ null            │      │ null            │
    │                 │      │                 │      │                 │
    │ • Slot:         │      │                 │      │                 │
    │   is_booked=true│      │                 │      │                 │
    │   is_reserved=  │      │                 │      │                 │
    │   false         │      │                 │      │                 │
    │                 │      │                 │      │                 │
    │ • Activity log  │      │                 │      │                 │
    │   entry         │      │                 │      │                 │
    └─────────────────┘      └─────────────────┘      └─────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  STEP 6: Post-Booking                                                   │
    │                                                                          │
    │  User Sees:                                                             │
    │  • Success page with booking confirmation                               │
    │  • Booking appears in /consultations page                               │
    │  • "Add to Calendar" button (ICS export)                                │
    │                                                                          │
    │  Email Notifications (future):                                          │
    │  • Booking confirmation                                                 │
    │  • 24-hour reminder                                                     │
    │  • Day-of reminder                                                      │
    └─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Lawyer Perspective

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CONSULTATION BOOKING - LAWYER FLOW                            │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  NOTIFICATION                                                          │
    │  ───────────                                                           │
    │  Lawyer receives notification when booking is confirmed                 │
    │  (Email notification - future implementation)                           │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  LAWYER DASHBOARD - CLIENTS PAGE                                        │
    │  Route: /lawyer/clients                                                 │
    │                                                                          │
    │  New Booking Appears In:                                                │
    │  • Recent Bookings list (top 5)                                         │
    │  • Client aggregation (if repeat client)                                │
    │                                                                          │
    │  Information Available:                                                 │
    │  • Client name, phone                                                   │
    │  • Booking status (pending/confirmed/completed/cancelled)               │
    │  • Notes provided by client                                             │
    │  • Booking date, duration, amount                                       │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  PRE-CONSULTATION                                                       │
    │  ─────────────────                                                        │
    │  Lawyer can:                                                            │
    │  • Review client notes                                                  │
    │  • View client history (previous bookings)                              │
    │  • Access shared documents (if any)                                     │
    │                                                                          │
    │  Communication Method:                                                  │
    │  • Currently: External (platform provides calendar invite only)         │
    │  • Future: Platform-hosted video calls                                  │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  POST-CONSULTATION                                                      │
    │  ──────────────────                                                       │
    │  Actions:                                                               │
    │  • Mark booking as 'completed'                                          │
    │  • Add lawyer notes (internal)                                          │
    │  • Client receives review request (future)                              │
    │                                                                          │
    │  Revenue:                                                               │
    │  • Payment released to lawyer (minus platform commission)               │
    │  • Appears in earnings stats                                            │
    └─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Booking Status Lifecycle

```
    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │ PENDING │────→│CONFIRMED│────→│COMPLETED│
    └────┬────┘     └─────────┘     └─────────┘
         │
         ├──────────┐
         │          │
         ▼          ▼
    ┌─────────┐  ┌─────────┐
    │CANCELLED│  │  FAILED │
    └─────────┘  └─────────┘
```

| Status | Trigger | Visible To User | Visible To Lawyer |
|--------|---------|-----------------|-------------------|
| `pending` | Checkout initiated, awaiting payment | Yes ("Processing payment") | No |
| `confirmed` | Payment successful via webhook | Yes ("Confirmed") | Yes |
| `completed` | Lawyer marks as done | Yes ("Completed") | Yes |
| `cancelled` | User cancels or payment fails | Yes ("Cancelled") | Yes |

---

## 4. Pricing Structure

### 4.1 Lawyer Rate Setting

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PRICING MODEL                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  LAWYER SETS HOURLY RATE                                                │
    │  ─────────────────────────                                              │
    │  Field: lawyer.profiles.hourly_rate_cents                               │
    │  Default: $50/hr (5000 cents) if not set                                │
    │  Constraints:                                                           │
    │  • Min: platform_settings.min_hourly_rate_cents (default: 5000 = $50)   │
    │  • Max: platform_settings.max_hourly_rate_cents (default: 50000 = $500) │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  SLOT DURATION DETERMINES PRICE                                         │
    │  ────────────────────────────────                                       │
    │  Price = (hourly_rate_cents / 60) * duration_minutes                    │
    │                                                                          │
    │  Examples:                                                              │
    │  • 30 min slot @ $100/hr = $50                                          │
    │  • 60 min slot @ $150/hr = $150                                         │
    │  • 45 min slot @ $200/hr = $150                                         │
    └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  PLATFORM COMMISSION                                                    │
    │  ───────────────────                                                    │
    │  Setting: platform_settings.consultation_commission_pct                 │
    │  Default: 15%                                                           │
    │                                                                          │
    │  Calculation:                                                           │
    │  • Platform Fee = Total Price * commission_pct                          │
    │  • Lawyer Receives = Total Price - Platform Fee                         │
    │                                                                          │
    │  Example ($100 consultation, 15% commission):                           │
    │  • User Pays: $100                                                      │
    │  • Platform Takes: $15                                                  │
    │  • Lawyer Receives: $85                                                 │
    └─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Price Display to User

```
┌─────────────────────────────────────────────────────────────────────────┐
│  USER SEES ON LAWYER PROFILE                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  💼 John Smith - Immigration Lawyer                                     │
│  ✅ Verified                                                            │
│                                                                          │
│  📍 Sydney, Australia    🎓 10 years exp                               │
│  💵 $150/hour                                                          │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Available Slots                                                    ││
│  │  Monday, February 17                                                ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                               ││
│  │  │9:00 AM  │ │11:00 AM │ │2:00 PM  │  (30 min each)                 ││
│  │  └─────────┘ └─────────┘ └─────────┘                               ││
│  │                                                                     ││
│  │  When clicked (11:00 AM):                                           ││
│  │  • Duration: 30 minutes                                             ││
│  │  • Consultation Fee: $75.00                                         ││
│  │  • Platform Fee: $11.25                                             ││
│  │  • Total: $86.25                                                    ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Payment Timing

| Stage | Action | Funds Status |
|-------|--------|--------------|
| Booking | Stripe Checkout created | No charge yet |
| Checkout | User completes payment | Held by Stripe |
| Webhook | Payment confirmed | Transferred to platform |
| Payout | Scheduled (future) | Released to lawyer |

---

## 5. Document Sharing

### 5.1 What Documents Can Be Shared

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DOCUMENT SHARING SYSTEM                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

    USER DOCUMENTS (user_documents table)
    ┌─────────────────────────────────────────────────────────────────────────┐
    │ Document Categories:                                                    │
    │ • Identity: Passport, birth certificate, driver's license               │
    │ • Financial: Bank statements, tax returns, payslips                     │
    │ • Employment: Employment letters, contracts, references                 │
    │ • Education: Degrees, transcripts, certificates                         │
    │ • Immigration: Previous visas, COE, nomination letters                  │
    │ • Health: Medical exam results, insurance                               │
    │ • Character: Police clearances, statutory declarations                  │
    └─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ User decides to share
                                    ▼
    DOCUMENT SHARE (document_shares table)
    ┌─────────────────────────────────────────────────────────────────────────┐
    │ Share Record Created:                                                   │
    │ • document_id → Links to user_documents                                 │
    │ • lawyer_id → Links to lawyer.profiles                                  │
    │ • shared_at → Timestamp                                                 │
    │ • revoked_at → NULL (active) or timestamp (revoked)                     │
    │                                                                          │
    │ UNIQUE constraint: (document_id, lawyer_id) - one share per pair        │
    └─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Privacy & Security

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PRIVACY & SECURITY RULES                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  ROW LEVEL SECURITY POLICIES                                            │
    └─────────────────────────────────────────────────────────────────────────┘

    user_documents table:
    ├─ Users: Full CRUD on own documents
    ├─ Shared Lawyers: READ only if document_shares entry exists and not revoked
    └─ Admins: Full access

    document_shares table:
    ├─ Document Owner: CREATE (share), UPDATE (revoke)
    ├─ Target Lawyer: READ own shares
    ├─ Document Owner: READ own shares
    └─ Admins: Full access

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  ACCESS RULES                                                           │
    └─────────────────────────────────────────────────────────────────────────┘

    Lawyer Can Access Documents When:
    1. User has explicitly shared via document_shares record
    2. share.revoked_at IS NULL (not revoked)
    3. Booking status is 'confirmed' or 'completed'
    
    Lawyer CANNOT:
    • Access documents before booking is confirmed
    • Download or copy documents (view only via signed URLs)
    • Access documents after share is revoked

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  POST-CONSULTATION                                                      │
    └─────────────────────────────────────────────────────────────────────────┘

    Default: Access Retained
    • Shares remain active after consultation completes
    • Lawyer can reference documents for follow-up
    • User can revoke access at any time

    Auto-Revoke (optional future feature):
    • After X days post-consultation
    • When user deletes document
    • When lawyer-client relationship ends
```

### 5.3 Document Share Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT SHARING FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

    USER ACTIONS:
    
    1. Upload Document
       Route: /dashboard/documents
       Storage: Supabase Storage (private bucket)
       Record: user_documents created
    
    2. Share with Lawyer
       Trigger: From document list or during booking
       Action: Create document_shares record
       UI: Lawyer selector (from previous bookings)
    
    3. Revoke Access
       Action: Update document_shares.revoked_at = now()
       Effect: Lawyer immediately loses access

    LAWYER ACTIONS:
    
    1. View Shared Documents
       Route: /lawyer/clients → Client detail → Documents tab
       Query: Join user_documents + document_shares
       Access: Signed URL (expires in 5 minutes)
    
    2. Download Prevention
       • Right-click disabled
       • Watermarked viewer (future)
       • Audit log of all accesses
```

---

## 6. Database Schema

### 6.1 Complete SQL Schema

```sql
-- ============================================================
-- LAWYER WORKFLOW DATABASE SCHEMA
-- ============================================================

-- Enums
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Lawyer Profiles Table
CREATE TABLE public.lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Professional Info
    bar_number VARCHAR(100),
    jurisdiction VARCHAR(100),
    practice_areas TEXT[], -- Array of specialties
    years_of_experience INTEGER DEFAULT 0,
    professional_bio TEXT,
    
    -- Verification
    verification_status verification_status DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    verification_document_url TEXT,
    
    -- Pricing
    hourly_rate_cents INTEGER DEFAULT 5000, -- $50/hr default
    currency VARCHAR(3) DEFAULT 'AUD',
    
    -- Profile
    profile_photo_url TEXT,
    languages TEXT[],
    education TEXT,
    
    -- Settings
    is_available BOOLEAN DEFAULT TRUE,
    accepts_new_clients BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_lawyer_user UNIQUE (user_id)
);

-- Availability Slots Table
CREATE TABLE public.lawyer_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lawyer_id UUID NOT NULL REFERENCES public.lawyer_profiles(id) ON DELETE CASCADE,
    
    -- Time Slot
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) STORED,
    
    -- Status
    is_booked BOOLEAN DEFAULT FALSE,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_until TIMESTAMP WITH TIME ZONE,
    reserved_by UUID REFERENCES auth.users(id),
    
    -- Booking Link
    booking_id UUID,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Bookings Table
CREATE TABLE public.consultation_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parties
    lawyer_id UUID NOT NULL REFERENCES public.lawyer_profiles(id),
    client_id UUID NOT NULL REFERENCES auth.users(id),
    availability_id UUID NOT NULL REFERENCES public.lawyer_availability(id),
    
    -- Session Details
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Pricing
    hourly_rate_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    lawyer_payout_cents INTEGER NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Content
    client_notes TEXT,
    lawyer_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES auth.users(id),
    cancellation_reason TEXT
);

-- Document Shares Table
CREATE TABLE public.document_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.user_documents(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES public.lawyer_profiles(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id),
    
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(document_id, lawyer_id)
);

-- Platform Settings Table
CREATE TABLE public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pricing
    min_hourly_rate_cents INTEGER DEFAULT 5000,
    max_hourly_rate_cents INTEGER DEFAULT 50000,
    consultation_commission_pct DECIMAL(5,2) DEFAULT 15.00,
    
    -- Features
    allow_new_lawyer_registrations BOOLEAN DEFAULT TRUE,
    require_lawyer_verification BOOLEAN DEFAULT TRUE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Activity Log
CREATE TABLE public.lawyer_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lawyer_id UUID REFERENCES public.lawyer_profiles(id),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'booking', 'availability', 'profile'
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lawyer_profiles_user ON public.lawyer_profiles(user_id);
CREATE INDEX idx_lawyer_profiles_status ON public.lawyer_profiles(verification_status);
CREATE INDEX idx_availability_lawyer ON public.lawyer_availability(lawyer_id);
CREATE INDEX idx_availability_time ON public.lawyer_availability(start_time, end_time);
CREATE INDEX idx_availability_available ON public.lawyer_availability(is_booked, is_reserved, start_time) WHERE NOT is_booked AND NOT is_reserved;
CREATE INDEX idx_bookings_lawyer ON public.consultation_bookings(lawyer_id);
CREATE INDEX idx_bookings_client ON public.consultation_bookings(client_id);
CREATE INDEX idx_bookings_status ON public.consultation_bookings(status);
CREATE INDEX idx_document_shares_lawyer ON public.document_shares(lawyer_id);
CREATE INDEX idx_document_shares_document ON public.document_shares(document_id);

-- RLS Policies
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Lawyer Profiles: Public read for approved, Self full access
CREATE POLICY "Lawyer profiles public read" ON public.lawyer_profiles
    FOR SELECT USING (verification_status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Lawyer profiles self update" ON public.lawyer_profiles
    FOR UPDATE USING (user_id = auth.uid());

-- Availability: Public read available slots, Lawyer full access
CREATE POLICY "Availability public read" ON public.lawyer_availability
    FOR SELECT USING (
        NOT is_booked AND NOT is_reserved 
        OR lawyer_id IN (SELECT id FROM public.lawyer_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Availability lawyer manage" ON public.lawyer_availability
    FOR ALL USING (lawyer_id IN (SELECT id FROM public.lawyer_profiles WHERE user_id = auth.uid()));

-- Bookings: Parties can view
CREATE POLICY "Bookings parties read" ON public.consultation_bookings
    FOR SELECT USING (
        client_id = auth.uid() 
        OR lawyer_id IN (SELECT id FROM public.lawyer_profiles WHERE user_id = auth.uid())
    );

-- Document Shares: Parties can view
CREATE POLICY "Shares parties read" ON public.document_shares
    FOR SELECT USING (
        shared_by = auth.uid() 
        OR lawyer_id IN (SELECT id FROM public.lawyer_profiles WHERE user_id = auth.uid())
    );

-- Triggers
CREATE TRIGGER update_lawyer_profiles_updated_at
    BEFORE UPDATE ON public.lawyer_profiles
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER update_lawyer_availability_updated_at
    BEFORE UPDATE ON public.lawyer_availability
    FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
```

---

## 7. Key Edge Functions

| Function | Purpose | Trigger |
|----------|---------|---------|
| `elevate-role` | Convert user to lawyer role | Lawyer registration |
| `consultation-checkout` | Create Stripe session for booking | Booking initiated |
| `stripe-webhook` | Handle payment confirmations | Stripe events |
| `cleanup-expired-reservations` | Release unbooked reserved slots | Cron (every 5 min) |

---

## 8. Integration Notes

### Stripe Flow
1. User clicks "Book" → `consultation-checkout` Edge Function
2. Function validates slot availability
3. Creates booking record (status='pending')
4. Reserves slot for 15 minutes
5. Returns Stripe Checkout URL
6. User completes payment on Stripe
7. Stripe webhook → updates booking to 'confirmed'
8. Slot marked as `is_booked=true`

### Email Notifications (Future)
- Booking confirmation to both parties
- 24-hour reminder
- Day-of reminder
- Cancellation notice
- Document share notification

### Video Calls (Future)
- Integrate Zoom or Twilio
- Auto-generate meeting links
- Recording option with consent


---

## 6. Database Schema (Complete)

### Core Tables

```sql
-- Lawyer Profiles Table
CREATE TABLE lawyer.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bar_number VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    practice_areas TEXT[] DEFAULT '{}',
    years_experience INTEGER,
    bio TEXT,
    hourly_rate_cents INTEGER DEFAULT 5000, -- $50/hr default
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verification_document_url TEXT,
    rejection_reason TEXT,
    verified_at TIMESTAMP,
    verified_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Lawyer Availability Slots
CREATE TABLE lawyer.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    is_reserved BOOLEAN DEFAULT false,
    reserved_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Bookings
CREATE TABLE public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    lawyer_id UUID NOT NULL REFERENCES lawyer.profiles(id),
    availability_id UUID REFERENCES lawyer.availability(id),
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    notes TEXT,
    user_notes TEXT,
    lawyer_notes TEXT,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lawyer Reviews
CREATE TABLE public.lawyer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES public.consultations(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    lawyer_id UUID NOT NULL REFERENCES lawyer.profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consultation_id)
);

-- Document Shares
CREATE TABLE public.document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.user_documents(id),
    lawyer_id UUID NOT NULL REFERENCES lawyer.profiles(id),
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    UNIQUE(document_id, lawyer_id)
);
```

### RLS Policies

```sql
-- Lawyer Profiles: Lawyers can update own, public read for verified
ALTER TABLE lawyer.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lawyers can update own profile"
    ON lawyer.profiles FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Public can view verified lawyers"
    ON lawyer.profiles FOR SELECT
    USING (is_verified = true AND is_active = true);

-- Consultations: Users see own, lawyers see assigned
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultations"
    ON public.consultations FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Lawyers can view assigned consultations"
    ON public.consultations FOR SELECT
    USING (lawyer_id IN (
        SELECT id FROM lawyer.profiles WHERE user_id = auth.uid()
    ));
```

---

## 7. Integration Notes

### Supabase Auth Integration
- Lawyers are regular users with `role='lawyer'`
- Profile exists in both `public.profiles` and `lawyer.profiles`
- Use `elevate-role` Edge Function to upgrade user to lawyer

### Stripe Integration
- Create checkout session with calculated price
- Webhook updates booking status on payment
- Platform commission deducted before payout

### Document Privacy
- Row-level security on all document tables
- Signed URLs expire in 5 minutes
- Access revoked when share record updated

---

## 8. Sample Data & Flows

### Sample Lawyer Registration Flow

```
1. User Alice (user_id: abc-123) signs up via Google
2. Navigates to /register/lawyer
3. Fills form:
   - Bar Number: NSW12345
   - Jurisdiction: New South Wales
   - Practice Areas: ["Skilled Migration", "Employer Sponsored"]
   - Years: 8
   - Bio: "Experienced migration lawyer..."
4. Uploads bar certificate PDF
5. Submits → Status: pending
6. Admin reviews in /admin/lawyers
7. Admin approves → Status: approved, is_verified: true
8. Alice can now access lawyer dashboard
```

### Sample Booking Flow

```
1. User Bob browses lawyer directory
2. Views Alice's profile ($150/hr)
3. Selects 30-min slot (9:00 AM Monday)
4. Price calculated: $75 + $11.25 platform fee = $86.25
5. Stripe checkout created
6. Bob pays → Webhook confirms
7. Booking status: confirmed
8. Alice receives notification
9. Alice marks completed after call
10. Bob receives review request
```

---

*End of Lawyer Workflow Documentation*
