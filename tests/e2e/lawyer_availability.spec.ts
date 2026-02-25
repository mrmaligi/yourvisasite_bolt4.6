import { test, expect } from '@playwright/test';

test.describe('Lawyer Availability', () => {
  const lawyerId = 'lawyer-123';
  const userId = 'user-123';

  // Helper to get local date string YYYY-MM-DD for the 15th of current month
  const getTargetDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = '15';
    return `${year}-${month}-${day}`;
  };

  test.beforeEach(async ({ page }) => {
    // Mock Authentication
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh',
          user: {
            id: userId,
            email: 'lawyer@example.com',
            aud: 'authenticated',
            role: 'authenticated',
          }
        })
      });
    });

    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: userId,
          email: 'lawyer@example.com',
          aud: 'authenticated',
          role: 'authenticated',
        })
      });
    });

    // Mock Public Profile
    await page.route(/\/rest\/v1\/profiles.*select=.*lawyer_profiles.*/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: userId,
          role: 'lawyer',
          is_active: true,
          first_name: 'Test',
          last_name: 'Lawyer',
          lawyer_profiles: [{ verification_status: 'approved' }]
        })
      });
    });

    // Mock Lawyer Profile
    await page.route(/\/rest\/v1\/profiles\?select=id&profile_id=eq.*/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: lawyerId })
      });
    });

    // Mock Consultation Slots (Initial Load - Empty)
    // Use broad match to avoid query param issues
    await page.route('**/rest/v1/consultation_slots*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to Login and Login as Lawyer
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('lawyer@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/lawyer/dashboard');
  });

  test('Loads availability page', async ({ page }) => {
    await page.goto('/lawyer/availability');
    await expect(page.getByRole('heading', { name: 'Availability' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Slot' })).toBeVisible();
  });

  test('Add a slot', async ({ page }) => {
    const targetDate = getTargetDate();

    await page.goto('/lawyer/availability');

    // Click on day 15
    await page.getByRole('button', { name: '15', exact: true }).click();

    // Check initial state (EmptyState)
    await expect(page.getByText('No slots', { exact: true })).toBeVisible();

    // Mock POST & GET refresh
    // We update the route to handle both
    await page.route('**/rest/v1/consultation_slots*', async route => {
      const method = route.request().method();
      if (method === 'POST') {
        const startTime = `${targetDate}T09:00:00`;
        const endTime = `${targetDate}T10:00:00`;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'slot-1', lawyer_id: lawyerId, start_time: startTime, end_time: endTime, is_booked: false }])
        });
      } else if (method === 'GET') {
             const sTime = `${targetDate}T09:00:00`;
             const eTime = `${targetDate}T10:00:00`;
             await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{
                    id: 'slot-1',
                    lawyer_id: lawyerId,
                    start_time: sTime,
                    end_time: eTime,
                    is_booked: false
                }])
            });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: 'Add Slot' }).click();

    // Fill form
    const startTime = `${targetDate}T09:00`;
    const endTime = `${targetDate}T10:00`;
    await page.getByLabel('Start').fill(startTime);
    await page.getByLabel('End').fill(endTime);

    await page.getByRole('button', { name: 'Save' }).click();

    // Verify toast
    await expect(page.getByText('Slot added')).toBeVisible();

    // Check for "Available"
    await expect(page.getByText('Available').first()).toBeVisible();
  });

  test('Delete a slot', async ({ page }) => {
    const slotId = 'slot-to-delete';
    const targetDate = getTargetDate();
    const startTime = `${targetDate}T10:00:00`;
    const endTime = `${targetDate}T11:00:00`;

    // Override the initial GET mock
    await page.route('**/rest/v1/consultation_slots*', async route => {
       const method = route.request().method();
       if (method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
              id: slotId,
              lawyer_id: lawyerId,
              start_time: startTime,
              end_time: endTime,
              is_booked: false
            }])
          });
       } else if (method === 'DELETE') {
        await route.fulfill({
          status: 204,
          body: ''
        });
       } else {
          await route.continue();
       }
    });

    await page.goto('/lawyer/availability');

    // Click on day 15
    await page.getByRole('button', { name: '15', exact: true }).click();

    // Verify slot is visible
    await expect(page.getByText('Available').first()).toBeVisible();

    // Find delete button
    const deleteBtn = page.locator('button.text-red-500');
    await expect(deleteBtn).toBeVisible();

    // Mock the refresh call that happens after delete to return empty list
    // We need to setup a NEW route handler that returns empty list for GET
    // But we need to keep DELETE handler working if called (though it's called before refresh)
    // The refresh happens AFTER delete returns.
    // We can use a state variable or check if we already deleted.

    // Easier: update the route handler before clicking delete?
    // But then the DELETE request will hit the new handler.
    // So the new handler must handle DELETE too.

    await page.route('**/rest/v1/consultation_slots*', async route => {
       const method = route.request().method();
       if (method === 'DELETE') {
          await route.fulfill({ status: 204, body: '' });
       } else if (method === 'GET') {
          // Return empty list
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
          });
       } else {
          await route.continue();
       }
    });

    await deleteBtn.click();

    // Verify success toast
    await expect(page.getByText('Slot removed')).toBeVisible();

    // Verify slot is gone
    await expect(page.getByText('No slots', { exact: true })).toBeVisible();
  });
});
