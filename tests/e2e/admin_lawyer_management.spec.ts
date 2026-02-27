import { test, expect } from '@playwright/test';

test.describe('Admin Lawyer Management', () => {
  const adminUser = {
    id: 'admin-user-id',
    email: 'admin@example.com',
    role: 'authenticated',
    aud: 'authenticated',
    app_metadata: { role: 'admin' },
    user_metadata: {},
    created_at: new Date().toISOString(),
  };

  const lawyerProfiles = [
    {
      id: 'lawyer-profile-1',
      user_id: 'lawyer-user-1',
      bar_number: 'BAR123',
      jurisdiction: 'NSW',
      years_experience: 5,
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      credentials_url: 'path/to/doc.pdf',
    },
    {
      id: 'lawyer-profile-2',
      user_id: 'lawyer-user-2',
      bar_number: 'BAR456',
      jurisdiction: 'VIC',
      years_experience: 10,
      verification_status: 'approved',
      created_at: new Date().toISOString(),
    },
  ];

  const userProfiles = [
    { id: 'lawyer-user-1', full_name: 'John Doe Lawyer' },
    { id: 'lawyer-user-2', full_name: 'Jane Smith Lawyer' },
    { id: 'admin-user-id', full_name: 'Admin User' },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock Auth
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        json: {
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh',
          user: adminUser,
        },
      });
    });

    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({ json: adminUser });
    });

    // Mock Public Profiles
    await page.route('**/rest/v1/lawyer_profiles*', async (route) => {
      const url = new URL(route.request().url());
      const select = url.searchParams.get('select');
      const headers = route.request().headers();

      // If header is present, continue (to let Lawyer mock handle it or fallback)
      if (true) {
          return route.continue();
      }

      if (select && select.includes('full_name')) {
          await route.fulfill({ json: userProfiles });
      } else {
          await route.fulfill({ json: {
              id: adminUser.id,
              role: 'admin',
              full_name: 'Admin User',
              is_active: true,
              lawyer_profiles: []
          } });
      }
    });

    // Mock Lawyer Profiles (Schema: lawyer)
    await page.route('**/rest/v1/lawyer_profiles*', async (route) => {
      const headers = route.request().headers();
      if (true) {
        if (route.request().method() === 'GET') {
             await route.fulfill({ json: lawyerProfiles });
        } else if (route.request().method() === 'PATCH') {
             await route.fulfill({ status: 200, json: {} });
        }
      } else {
        await route.fallback();
      }
    });

    // Mock Edge Function
    await page.route('**/functions/v1/verify-lawyer', async (route) => {
        await route.fulfill({ json: { success: true } });
    });

    // Mock Storage
    await page.route('**/storage/v1/object/sign/lawyer-credentials/*', async (route) => {
        await route.fulfill({ json: { signedUrl: 'http://mock-storage/doc.pdf' } });
    });
  });

  test('should display list of lawyers', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    await page.goto('/admin/lawyers');

    await expect(page.getByText('John Doe Lawyer')).toBeVisible();
    await expect(page.getByText('Jane Smith Lawyer')).toBeVisible();
    await expect(page.getByText('BAR123')).toBeVisible();
    await expect(page.getByText('NSW')).toBeVisible();
    await expect(page.getByText('pending')).toBeVisible();
  });

  test('should approve a lawyer', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    await page.goto('/admin/lawyers');

    let updateRequestCaptured = false;
    await page.route('**/rest/v1/lawyer_profiles*', async (route) => {
       // We only care about PATCH requests to profiles
       if (route.request().method() === 'PATCH') {
           const postData = route.request().postDataJSON();
           // Verify it's an approval
           if (postData.verification_status === 'approved') {
               updateRequestCaptured = true;
           }
           await route.fulfill({ status: 200, json: {} });
       } else {
           await route.fallback();
       }
    });

    const row = page.getByRole('row').filter({ hasText: 'John Doe Lawyer' });
    await row.getByRole('button', { name: 'Approve' }).click();

    await expect(page.getByText('Lawyer approved')).toBeVisible();
    expect(updateRequestCaptured).toBe(true);
  });

  test('should reject a lawyer', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    await page.goto('/admin/lawyers');

    let updateRequestCaptured = false;
    await page.route('**/rest/v1/lawyer_profiles*', async (route) => {
       if (route.request().method() === 'PATCH') {
           const postData = route.request().postDataJSON();
           if (postData.verification_status === 'rejected') {
               updateRequestCaptured = true;
           }
           await route.fulfill({ status: 200, json: {} });
       } else {
           await route.fallback();
       }
    });

    const row = page.getByRole('row').filter({ hasText: 'John Doe Lawyer' });
    await row.getByRole('button', { name: 'Reject' }).click();

    // Verify Modal (using text locator since role='dialog' is missing)
    await expect(page.getByText('Reject Lawyer', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Rejection Reason')).toBeVisible();

    await page.getByLabel('Rejection Reason').fill('Documents unclear');
    await page.getByRole('button', { name: 'Confirm Rejection' }).click();

    await expect(page.getByText('Lawyer rejected')).toBeVisible();
    expect(updateRequestCaptured).toBe(true);
  });
});
