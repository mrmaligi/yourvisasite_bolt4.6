import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Landing page should be responsive', async ({ page }) => {
    await page.goto('/');

    // Check for hamburger menu button (visible on mobile)
    const menuButton = page.locator('nav button').filter({ has: page.locator('svg.lucide-menu') });
    await expect(menuButton).toBeVisible();

    // Check that hero content is stacked (optional check, visual mainly)
    // We check if the search button is visible and clickable
    await expect(page.getByText('Search Visas').first()).toBeVisible();

    // Open mobile menu
    await menuButton.click();
    // Use exact: true to avoid matching "Search Visas" button which contains "Visas"
    // Also scope to the mobile menu container to avoid bottom nav ambiguity
    const mobileMenu = page.locator('div.fixed.inset-x-0.top-16.bottom-0');
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Visas', exact: true })).toBeVisible();
  });

  test('Visa Search page should show filters on mobile', async ({ page }) => {
    await page.goto('/visas');

    // Check if search input is visible
    await expect(page.getByPlaceholder('Search by name or subclass...')).toBeVisible();

    // Filters are hidden by default on mobile. Check for toggle button.
    const filterButton = page.locator('button').filter({ has: page.locator('svg.lucide-filter') });
    await expect(filterButton).toBeVisible();

    // Click to show filters
    await filterButton.click();

    // Check if categories select is visible
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('Dashboard Sidebar should work on mobile', async ({ page }) => {
    // Mock authentication flow
    const user = {
      id: 'test-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'test@example.com',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: new Date().toISOString(),
    };

    // Mock login token request
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: user,
        }),
      });
    });

    // Mock user retrieval (getSession uses this sometimes)
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user),
      });
    });

    // Mock profile
    await page.route('**/rest/v1/profiles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          role: 'user',
          full_name: 'Test User',
          email: 'test@example.com',
          created_at: new Date().toISOString(),
        }),
      });
    });

    // Mock dashboard data
    await page.route('**/rest/v1/user_visa_purchases*', async (route) => {
       await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.route('**/rest/v1/bookings*', async (route) => {
       await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    // Perform login
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    // Use role for robustness
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Now we are on dashboard (hopefully)

    // Check for dashboard hamburger menu
    const dashboardMenuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') }).first();
    await expect(dashboardMenuButton).toBeVisible();

    // Open sidebar
    await dashboardMenuButton.click();

    // Check if sidebar links are visible. "My Visas" is unique enough.
    await expect(page.getByRole('link', { name: 'My Visas' })).toBeVisible();
  });
});
