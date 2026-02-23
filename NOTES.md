# Project Modifications: Temporary Auth Removal & Mock Data

As requested, the following changes have been made to temporarily remove authentication requirements, clean up the UI, and seed mock data.

## 1. Mock Data Integration
*   **File Created:** `src/lib/mockData.ts`
*   **Content:** Contains 10 mock Users, 10 mock Admins, and 10 mock Lawyers (including detailed Lawyer Profiles).
*   **Configuration:** Exports `export const USE_MOCK = true;` which controls the mock mode across the application.

## 2. Authentication Bypass (Mock Auth)
*   **File Modified:** `src/contexts/AuthContext.tsx`
*   **Change:** Imports `USE_MOCK` from `src/lib/mockData.ts`.
    *   Bypasses Supabase `getSession` and `onAuthStateChange`.
    *   Initializes the session with a default Mock User (`user` role).
    *   Added `switchRole(role)` function to easily swap between User, Lawyer, and Admin roles.
    *   Mocked `signIn` and `signOut` functions.

## 3. UI Cleanup (Navbar)
*   **File Modified:** `src/components/layout/Navbar.tsx`
*   **Change:**
    *   Added a **"Dev Mode"** role switcher in the header (desktop) and mobile menu. This allows you to instantly switch roles and see different dashboards.
    *   Displays the current mock user's profile.
    *   Removed login/register links when in mock mode (implied by user being "logged in").
*   **File Deleted:** `src/components/Header.tsx` (Unused component).

## 4. Page Data Seeding
The following pages have been modified to pull data from `src/lib/mockData.ts` instead of Supabase when `USE_MOCK` is true:

*   **User Management (Admin):** `src/pages/admin/UserManagement.tsx`
    *   Displays all mock profiles.
*   **Lawyer Directory (Public):** `src/pages/public/LawyerDirectory.tsx`
    *   Displays the mock lawyers with generated slot counts.
*   **Lawyer Management (Admin):** `src/pages/admin/LawyerManagement.tsx`
    *   Displays the mock lawyer profiles for verification management. (Approve/Reject actions are mocked to show toasts).
*   **Landing Page:** `src/pages/public/Landing.tsx`
    *   Displays mock stats.

## How to Re-enable Authentication

To revert to using real Supabase Authentication and Data:

1.  **Toggle Flag:** In `src/lib/mockData.ts`, set `export const USE_MOCK = false;`. This single change will revert the data fetching and auth logic across the app.
2.  **Navbar:** To remove the Dev Switcher, you would need to revert changes to `src/components/layout/Navbar.tsx`.
3.  **(Optional) Restore Header:** If `src/components/Header.tsx` was needed, restore it from git history (though it appeared unused).

## Testing the Changes
1.  **Landing:** You should land on the home page as a logged-in "User".
2.  **Switch Role:** Use the yellow "Dev Mode" dropdown in the header to switch to "Admin" or "Lawyer".
3.  **Admin Dashboard:** As Admin, go to "Users" or "Lawyers" to see the seeded 10+ entries.
4.  **Lawyer Directory:** Go to "Lawyers" (public link) to see the seeded lawyers.
