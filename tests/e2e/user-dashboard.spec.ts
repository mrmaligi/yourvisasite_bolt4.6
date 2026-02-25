import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Authentication
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      const json = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: {
          id: 'test-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'test@example.com',
        }
      };
      await route.fulfill({ json });
    });

    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({ json: {
        id: 'test-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
      }});
    });

    await page.route('**/rest/v1/profiles*', async (route) => {
      await route.fulfill({ json: {
        id: 'test-user-id',
        role: 'user',
        full_name: 'Test User',
        is_active: true
      }});
    });
  });

  async function loginAndGoToDashboard(page) {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  }

  test('User Dashboard loads with stats and content', async ({ page }) => {
    // Mock Stats Counts
    const commonHeaders = {
      'Access-Control-Expose-Headers': 'Content-Range'
    };

    // Saved Visas
    await page.route('**/rest/v1/saved_visas*', async (route) => {
        await route.fulfill({
            headers: { ...commonHeaders, 'Content-Range': '0-4/5' },
            json: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}]
        });
    });

    // My Visas (User Visa Purchases)
    await page.route('**/rest/v1/user_visa_purchases*', async (route) => {
        await route.fulfill({
            headers: { ...commonHeaders, 'Content-Range': '0-2/3' },
            json: [{id: '1'}, {id: '2'}, {id: '3'}]
        });
    });

    // User Documents
    await page.route('**/rest/v1/user_documents*', async (route) => {
        await route.fulfill({
            headers: { ...commonHeaders, 'Content-Range': '0-1/2' },
            json: [{id: '1'}, {id: '2'}]
        });
    });

    // Bookings (Upcoming Consultations)
    await page.route('**/rest/v1/bookings*', async (route) => {
        await route.fulfill({
            headers: { ...commonHeaders, 'Content-Range': '0-0/1' }, // 1 booking
            json: [{id: 'booking-1'}]
        });
    });

    // Tracker Entries (My Applications)
    await page.route('**/rest/v1/tracker_entries*', async (route) => {
        const json = [
            {
                id: 'tracker-1',
                application_date: new Date().toISOString(),
                status: 'pending',
                visas: {
                    name: 'Skilled Independent',
                    subclass: '189'
                }
            }
        ];
        await route.fulfill({ json });
    });

    await loginAndGoToDashboard(page);

    // Wait for Dashboard to be ready (Welcome text is always there)
    await expect(page.getByText('Welcome Back!')).toBeVisible();

    // Verify My Application Journey
    await expect(page.getByText('My Application Journey')).toBeVisible();
    await expect(page.getByText('189 - Skilled Independent')).toBeVisible();

    // Verify Stats
    const savedVisasContainer = page.locator('p', { hasText: /^Saved Visas$/ }).locator('..');
    await expect(savedVisasContainer.getByText('5')).toBeVisible();

    const myVisasContainer = page.locator('p', { hasText: /^My Visas$/ }).locator('..');
    await expect(myVisasContainer.getByText('3')).toBeVisible();

    const documentsContainer = page.locator('p', { hasText: /^Documents$/ }).locator('..');
    await expect(documentsContainer.getByText('2')).toBeVisible();

    const consultationsContainer = page.locator('p', { hasText: /^Consultations$/ }).locator('..');
    await expect(consultationsContainer.getByText('1')).toBeVisible();

    // Verify Quick Actions
    await expect(page.getByText('Find Visas')).toBeVisible();
    await expect(page.getByText('Track Application')).toBeVisible();
    await expect(page.getByText('Find Lawyer')).toBeVisible();
  });

  test('User Dashboard handles empty state', async ({ page }) => {
    // Mock empty stats
    const commonHeaders = {
      'Access-Control-Expose-Headers': 'Content-Range'
    };

     await page.route('**/rest/v1/saved_visas*', async (route) => {
        await route.fulfill({ headers: { ...commonHeaders, 'Content-Range': '*/0' }, json: [] });
    });
    await page.route('**/rest/v1/user_visa_purchases*', async (route) => {
        await route.fulfill({ headers: { ...commonHeaders, 'Content-Range': '*/0' }, json: [] });
    });
    await page.route('**/rest/v1/user_documents*', async (route) => {
        await route.fulfill({ headers: { ...commonHeaders, 'Content-Range': '*/0' }, json: [] });
    });
    await page.route('**/rest/v1/bookings*', async (route) => {
        await route.fulfill({ headers: { ...commonHeaders, 'Content-Range': '*/0' }, json: [] });
    });
    await page.route('**/rest/v1/tracker_entries*', async (route) => {
        await route.fulfill({ json: [] });
    });

    await loginAndGoToDashboard(page);

    // Wait for Dashboard to be ready
    await expect(page.getByText('Welcome Back!')).toBeVisible();

    // Verify "My Application Journey" is NOT visible
    await expect(page.getByText('My Application Journey')).not.toBeVisible();

    // Verify "No recent activity"
    await expect(page.getByText('No recent activity')).toBeVisible();

    // Verify stats are 0
    const savedVisasContainer = page.locator('p', { hasText: /^Saved Visas$/ }).locator('..');
    await expect(savedVisasContainer.getByText('0')).toBeVisible();
  });
});
