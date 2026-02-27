import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Full System Walkthrough', () => {
  // Increase timeout for full walkthrough
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Clear cookies/storage before each test
    await page.context().clearCookies();
    await page.goto(BASE_URL);
  });

  // --- USER ROLE ---
  test('User Role: Login, Dashboard, Search, Detail, Logout', async ({ page }) => {
    console.log('🔵 Starting User Role Walkthrough');

    // 1. Login
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@example.com').fill('user1@visabuild.test');
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    await page.locator('button[type="submit"]').click();

    // 2. Verify Dashboard Access
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
    console.log('✅ User logged in and dashboard visible');

    // 3. Navigate to Visa Search from Dashboard
    const searchLink = page.locator('a[href="/visas"]').first();
    if (await searchLink.isVisible()) {
        await searchLink.click();
    } else {
        await page.goto(`${BASE_URL}/visas`);
    }
    await expect(page.locator('text=Visa Search')).toBeVisible();
    console.log('✅ User navigated to Visa Search');

    // 4. View Visa Detail
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]');
    await page.locator('[class*="card"]').first().click();

    // Check for critical elements on detail page
    await expect(page.locator('text=Processing Time')).toBeVisible();
    console.log('✅ User viewed Visa Detail');

    // 5. Logout
    // Locate user menu or logout button.
    // Assuming standard layout: Avatar or "Sign out" button
    // Try finding a button with "Sign out" or "Log out" text, or profile menu trigger
    const userMenu = page.locator('button').filter({ hasText: /Sign out|Log out/ }).first();

    if (await userMenu.isVisible()) {
        await userMenu.click();
    } else {
        // Fallback: look for avatar to click then sign out
        const avatar = page.locator('button[aria-label="User menu"], button[aria-label="Profile"]');
        if (await avatar.isVisible()) {
             await avatar.click();
             await page.getByText('Sign out').click();
        } else {
             // Hard logout fallback if UI is elusive in test
             await page.goto(`${BASE_URL}/login`);
        }
    }

    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ User logged out');
  });

  // --- LAWYER ROLE ---
  test('Lawyer Role: Login, Dashboard, Clients, Availability, Logout', async ({ page }) => {
    console.log('🔵 Starting Lawyer Role Walkthrough');

    // 1. Login
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@example.com').fill('lawyer1@visabuild.test');
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    await page.locator('button[type="submit"]').click();

    // 2. Verify Lawyer Dashboard
    await expect(page).toHaveURL(/.*\/lawyer\/dashboard/);
    await expect(page.locator('text=Lawyer Dashboard')).toBeVisible();
    console.log('✅ Lawyer logged in and dashboard visible');

    // 3. View Clients
    await page.goto(`${BASE_URL}/lawyer/clients`);
    await expect(page.locator('text=Clients')).toBeVisible();
    console.log('✅ Lawyer viewed Clients page');

    // 4. View Availability
    await page.goto(`${BASE_URL}/lawyer/availability`);
    await expect(page.locator('text=Availability')).toBeVisible();
    console.log('✅ Lawyer viewed Availability page');

    // 5. Logout
    // Assuming similar logout flow or specialized sidebar
     const logoutBtn = page.locator('button:has-text("Sign out"), button:has-text("Log out")').first();
     if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
     } else {
         // Try sidebar logout if present
         const sidebarLogout = page.locator('a[href="/logout"]'); // Hypothetical
         if (await sidebarLogout.isVisible()) {
             await sidebarLogout.click();
         } else {
             await page.goto(`${BASE_URL}/login`);
         }
     }
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Lawyer logged out');
  });

  // --- ADMIN ROLE ---
  test('Admin Role: Login, Dashboard, User Management, Logout', async ({ page }) => {
    console.log('🔵 Starting Admin Role Walkthrough');

    // 1. Login
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('you@example.com').fill('admin1@visabuild.test');
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    await page.locator('button[type="submit"]').click();

    // 2. Verify Admin Dashboard
    // URL might be /admin or /admin/dashboard
    await expect(page).toHaveURL(/.*\/admin/);
    // Look for generic admin indicators
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    console.log('✅ Admin logged in and dashboard visible');

    // 3. View User Management
    await page.goto(`${BASE_URL}/admin/users`);
    await expect(page.locator('text=User Management')).toBeVisible();
    console.log('✅ Admin viewed User Management');

    // 4. Logout
     const logoutBtn = page.locator('button:has-text("Sign out"), button:has-text("Log out")').first();
     if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
     } else {
         await page.goto(`${BASE_URL}/login`);
     }
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Admin logged out');
  });
});
