# VisaBuild

VisaBuild is a comprehensive visa management platform designed to connect visa applicants with lawyers, provide tracking tools, and offer educational resources. The platform serves three main user roles: Regular Users (Visa Applicants), Lawyers, and Administrators.

## Current Status

**Version:** 4.6  
**Completion:** ~72%  
**Last Updated:** February 2026

### What's Built
- ✅ **17 Visas** across 4 countries (Australia, Canada, UK, NZ)
- ✅ **120+ Pages** (User, Lawyer, Admin, Public)
- ✅ **Complete Auth System** with role-based access
- ✅ **Payment Integration** (Stripe)
- ✅ **Document Management** (Supabase Storage)
- ✅ **Consultation Booking** with calendar integration
- ✅ **Processing Time Tracker** with weighted algorithm
- ✅ **Email Notifications** (Resend)
- ✅ **Responsive Design** with dark mode

## Project Vision

**Goal:** Synthesize visa application requirements into a coherent, user-friendly platform.

**Concept:**
*   **Tracker:** Anonymous tracker for visa processing times with community submissions.
*   **User Role:** Google login (Supabase), main page with news/tracker, "Visas" search, free basic info vs. paid premium content ($49/visa), document upload helper, consultation booking with lawyers.
*   **Lawyer Role:** Verification process, dashboard for managing users/marketing/pricing, setting hourly rates, updating trackers (weighted), commenting on news.
*   **Admin Role:** Oversights everything, manages premium content requirements, monitors documents, pricing control.

## Architecture Summary

### Roles & Core Features

#### 1. 👤 User (The Applicant)
*   **Auth:** Google Sign-in (Supabase).
*   **Dashboard:** Tracker, News Feed, Quick Call, Welcome/Tour.
*   **Visa Search:** Search by keywords/subclass across 17 visa types.
*   **Freemium Model:**
    *   **Free:** Basic summary, official links, news.
    *   **Paid ($49/visa):** Unlocks "Premium Content" (Step-by-step application guide, document upload helper with explanations/examples).
*   **Consultation:** Book paid calls with lawyers (30m/1hr). Share uploaded docs securely.
*   **Documents:** Upload and categorize documents (19 categories).

#### 2. ⚖️ Lawyer (The Expert)
*   **Verification:** Upload proof of practice for Admin approval.
*   **Dashboard:** Manage Users, Marketing, Set Hourly Rates, Cases, Billing.
*   **Tracker Power:** Lawyer updates to the tracker carry more "weight" in the algorithm.
*   **Interaction:** Comment on news, reply to user reviews, view user files (once approved).
*   **Availability:** Set consultation slots for booking.

#### 3. 🛡️ Admin (The Controller)
*   **Oversight:** View/manage everything (Users, Lawyers, Pricing, Content).
*   **Content Management:** Manage the "Premium" section (requirements, document categories).
*   **Approvals:** Verify lawyer accounts.
*   **Analytics:** Platform statistics and reporting.

#### 4. ⏱️ The Tracker
*   **Anonymous Access:** Users can view/submit processing times without login.
*   **Algorithm:** Calculates current processing times based on user + weighted lawyer inputs.
*   **Moderation:** Auto-flagging and admin moderation for data quality.

## Tech Stack

*   **Frontend**: React 18, Vite, TypeScript
*   **Styling**: Tailwind CSS, Lucide React icons
*   **Routing**: React Router v7
*   **Backend / Database**: Supabase (Auth, Postgres, RLS)
*   **Payments**: Stripe
*   **Email**: Resend
*   **Testing**: Playwright

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   Node.js (v18 or higher)
*   npm, yarn, or pnpm
*   A Supabase project
*   A Stripe account (for payments)
*   A Resend account (for emails)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd yourvisasite_bolt4.6
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory:

    ```env
    # Supabase
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # Stripe
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    
    # Resend (for email notifications)
    RESEND_API_KEY=your_resend_api_key
    ```

## Usage

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Build for production:**
    ```bash
    npm run build
    ```

3.  **Preview the production build:**
    ```bash
    npm run preview
    ```

4.  **Run tests:**
    ```bash
    npm run test
    ```

## Project Structure

The source code is organized as follows:

```
src/
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (Public, Dashboard shells)
│   ├── ui/           # Base UI components (Button, Card, Input, etc.)
│   └── tracker/      # Tracker-specific components
├── contexts/         # React Context providers (Auth, Toast, Theme)
├── hooks/            # Custom React hooks (useVisas, useAuth, etc.)
├── lib/              # Library configurations
│   ├── services/     # Business logic services
│   ├── repositories/ # Data access layer
│   └── errors/       # Error handling
├── pages/            # Application pages
│   ├── admin/        # Admin-specific pages
│   ├── lawyer/       # Lawyer-specific pages
│   ├── public/       # Publicly accessible pages
│   └── user/         # User-specific pages
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component & routing
└── main.tsx          # Application entry point
```

## Key Features

### For Users
- **Visa Search:** Browse and search 17 visa types across 4 countries
- **Premium Guides:** Step-by-step application assistance ($49/visa)
- **Document Vault:** Upload and organize required documents
- **Consultation Booking:** Book time with verified immigration lawyers
- **Processing Tracker:** View and contribute to community processing time data

### For Lawyers
- **Profile Management:** Showcase expertise and specializations
- **Availability Calendar:** Set consultation slots
- **Client Management:** Track bookings and share documents
- **Marketing Tools:** Promote services to potential clients
- **Weighted Tracker:** Your processing time updates carry more influence

### For Admins
- **User Management:** View and manage all users
- **Lawyer Verification:** Approve or reject lawyer registrations
- **Content Management:** Create and edit premium visa guides
- **Platform Analytics:** Monitor platform usage and performance
- **Moderation:** Review flagged tracker entries

## Known Issues

We are actively working on 22 frontend-backend alignment issues. See `AGENTS.md` for details. All issues have Jules-ready fixes prepared.

## Roadmap

### Near Term
- Fix alignment issues
- Reschedule/cancel consultation flows
- Lawyer revenue dashboard

### Coming Soon
- Visa comparison tool
- Video consultation integration
- Mobile document scanning
- Additional visa types (US, more UK/Canada)

## Contributing

This project uses [Jules](https://jules.google.com) for AI-assisted development. See `JULES_PROMPTS.md` for task templates.

## Documentation

- `AGENTS.md` - Project guide for AI agents
- `NOTES.md` - Detailed backlog and status
- `JULES_PROMPTS.md` - AI code generation prompts
- `conductor/tracks.md` - Sprint planning

## License

[License Information Here]

---

*Built with ❤️ for visa applicants worldwide.*
