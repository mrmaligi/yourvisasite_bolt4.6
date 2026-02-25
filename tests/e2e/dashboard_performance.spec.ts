import { test, expect } from '@playwright/test';

test.describe('Dashboard Performance Optimized', () => {
  test('User Dashboard makes 1 RPC request', async ({ page }) => {
    // Mock user authentication
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-access-token',
          refresh_token: 'fake-refresh-token',
          expires_in: 3600,
          user: {
            id: 'test-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'test@example.com'
          }
        })
      });
    });

    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'test@example.com',
          app_metadata: { provider: 'email' },
          user_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      });
    });

    // Mock profile
    await page.route('**/rest/v1/profiles?*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-user-id', role: 'user', full_name: 'Test User', is_active: true })
      });
    });

    // Mock the RPC call
    await page.route('**/rest/v1/rpc/get_user_dashboard_stats', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                savedVisas: 5,
                myVisas: 2,
                documents: 3,
                upcomingConsultations: 1
            })
        });
    });

    // Mock tracker entries (still a separate call)
    await page.route('**/rest/v1/tracker_entries?*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
        });
    });

    let rpcCount = 0;
    let legacyCount = 0;

    page.on('request', request => {
        const url = request.url();
        if (url.includes('rpc/get_user_dashboard_stats')) {
            console.log(`RPC detected: ${url}`);
            rpcCount++;
        }
        if (url.includes('saved_visas') ||
            url.includes('user_visas') ||
            url.includes('user_documents') ||
            (url.includes('bookings') && !url.includes('rpc'))) {
             console.log(`Legacy request detected: ${url}`);
             legacyCount++;
        }
    });

    // Go to login page
    await page.goto('/login');

    // Perform login
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.locator('button[type="submit"]').click();

    // Wait for the dashboard to load
    await expect(page.getByText('Welcome Back!')).toBeVisible({ timeout: 10000 });

    // Wait for RPC call
    await page.waitForTimeout(500);

    // Verify stats are displayed
    // Using a more specific selector
    // The structure is Card > CardBody > div > div > p(count) + p(label)
    // We can target the label, then find the sibling/parent count.

    // Find the container that has "Saved Visas" and ensure it also has "5"
    // .locator('..') goes up to the div container
    await expect(page.getByText('Saved Visas', { exact: true }).locator('xpath=..').getByText('5')).toBeVisible();
    await expect(page.getByText('My Visas', { exact: true }).locator('xpath=..').getByText('2')).toBeVisible();
    await expect(page.getByText('Documents', { exact: true }).locator('xpath=..').getByText('3')).toBeVisible();
    await expect(page.getByText('Consultations', { exact: true }).locator('xpath=..').getByText('1')).toBeVisible();

    console.log(`RPC requests: ${rpcCount}`);
    console.log(`Legacy requests: ${legacyCount}`);

    expect(rpcCount).toBeGreaterThanOrEqual(1);
    expect(legacyCount).toBe(0);
  });
});
