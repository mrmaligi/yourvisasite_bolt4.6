# VisaBuild

VisaBuild is a comprehensive visa management platform designed to connect visa applicants with lawyers, provide tracking tools, and offer educational resources. The platform serves three main user roles: Regular Users (Visa Applicants), Lawyers, and Administrators.

## Project Vision

**Goal:** Synthesize the requirements into a coherent project plan.
**Concept:**
*   **Tracker:** Anonymous tracker for visa processing times.
*   **User Role:** Google login (Supabase), main page with news/tracker, "Visas" search, free basic info vs. paid premium content ($49/visa), document upload helper, consultation booking with lawyers.
*   **Lawyer Role:** Verification process, dashboard for managing users/marketing/pricing, setting hourly rates, updating trackers (weighted), commenting on news.
*   **Admin Role:** Oversights everything, manages premium content requirements, monitors documents, pricing control.

## Architecture Summary

### Roles & Core Features

#### 1. 👤 User (The Applicant)
*   **Auth:** Google Sign-in (Supabase).
*   **Dashboard:** Tracker, News Feed, Quick Call.
*   **Visa Search:** Search by keywords/subclass.
*   **Freemium Model:**
    *   **Free:** Basic summary, official links, news.
    *   **Paid ($49/visa):** Unlocks "Premium Content" (Step-by-step application guide, document upload helper with explanations/examples).
*   **Consultation:** Book paid calls with lawyers (30m/1hr). Share uploaded docs with them securely.

#### 2. ⚖️ Lawyer (The Expert)
*   **Verification:** Upload proof of practice for Admin approval.
*   **Dashboard:** Manage Users, Marketing, Set Hourly Rates.
*   **Tracker Power:** Lawyer updates to the tracker carry more "weight" in the algorithm.
*   **Interaction:** Comment on news, reply to user reviews, view user files (once approved).

#### 3. 🛡️ Admin (The Controller)
*   **Oversight:** View/manage everything (Users, Lawyers, Pricing).
*   **Content Management:** Manage the "Premium" section (requirements, document categories).
*   **Approvals:** Verify lawyer accounts.

#### 4. ⏱️ The Tracker
*   **Anonymous Access:** Users can view/submit processing times without login.
*   **Algorithm:** Calculates current processing times based on user + weighted lawyer inputs.

## Project Plan

### Phase 1: Documentation & Structure
1.  Update README.md with this exact project spec.
2.  Create a TODO.md breaking down the features into coding tasks.

### Phase 2: Database Schema (Supabase)
1.  Design the SQL tables for profiles (roles: user/lawyer/admin), visas, user_visas (for paid unlocks), tracker_entries, and bookings.

### Phase 3: Frontend Build
1.  Build the Tracker (easiest starting point).
2.  Build the Auth & Role System.

## Tech Stack

*   **Frontend**: React, Vite, TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Routing**: React Router
*   **Backend / Database**: Supabase
*   **Payments**: Stripe

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   Node.js (v18 or higher)
*   npm or yarn
*   A Supabase project
*   A Stripe account (for payments)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd yourvisasite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory based on `.env.example` (if available) or create a new one.

2.  Add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## Project Structure

The source code is organized as follows:

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context providers (e.g., Auth)
├── hooks/            # Custom React hooks
├── lib/              # Library configurations (Supabase, Utils)
├── pages/            # Application pages
│   ├── admin/        # Admin-specific pages
│   ├── lawyer/       # Lawyer-specific pages
│   ├── public/       # Publicly accessible pages
│   └── user/         # User-specific pages
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component & routing
└── main.tsx          # Application entry point
```

## License

[License Information Here]
