# YourVisaSite

YourVisaSite is a comprehensive visa management platform designed to connect visa applicants with lawyers, provide tracking tools, and offer educational resources. The platform serves three main user roles: Regular Users (Visa Applicants), Lawyers, and Administrators.

## Features

### 👤 For Users (Visa Applicants)
*   **Dashboard**: A centralized hub to view visa status and upcoming tasks.
*   **Visa Tracking**: Track the progress of visa applications.
*   **Document Management**: Upload, store, and manage visa-related documents.
*   **Consultations**: Book and manage consultations with lawyers.
*   **Premium Content**: Access exclusive guides and resources.
*   **Marketplace**: Purchase additional services or products.
*   **Settings**: Manage profile and account settings.

### ⚖️ For Lawyers
*   **Dashboard**: Overview of client activities and pending tasks.
*   **Client Management**: Manage client cases and communications.
*   **Availability**: Set and manage consultation availability.
*   **Marketing Tools**: Tools to promote services to potential clients.
*   **Marketplace**: Offer services on the marketplace.
*   **Lawyer News**: Stay updated with relevant legal news.
*   **Pending Status**: Track verification status.

### 🛡️ For Admins
*   **Dashboard**: High-level overview of platform statistics.
*   **User Management**: Manage user accounts and permissions.
*   **Lawyer Management**: Verify and manage lawyer profiles.
*   **Visa Management**: Manage visa types and information.
*   **Content Management**: Manage news, premium content, and marketplace items.
*   **Pricing & Promos**: specific pricing strategies and promotional codes.
*   **Activity Log**: Monitor platform activity for security and auditing.

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
