import { test, expect } from '@playwright/test';

test('UnifiedLogin queries profiles by ID not email', async ({ page }) => {
  // Mock successful login
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
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'admin@visabuild.local',
          aud: 'authenticated',
          role: 'authenticated',
        }
      })
    });
  });

  // Mock getUser
  await page.route('**/auth/v1/user', async route => {
     await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@visabuild.local',
        aud: 'authenticated',
        role: 'authenticated',
      })
    });
  });

  // Monitor profiles request
  const profileQueries: string[] = [];
  await page.route('**/rest/v1/profiles*', async route => {
    profileQueries.push(route.request().url());
    // Return dummy profile so the app doesn't crash
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        role: 'admin',
        is_active: true,
        lawyer_profiles: []
      })
    });
  });

  await page.goto('/login');

  // Fill in the form
  await page.getByLabel('Email Address').fill('admin@visabuild.local');
  await page.getByLabel('Password').fill('admin123');

  // Click Sign In
  await page.locator('button[type="submit"]').click();

  // Wait for at least one profile query
  await expect.poll(() => profileQueries.length).toBeGreaterThan(0);

  // Wait a bit more to catch subsequent queries
  await page.waitForTimeout(1000);

  // The actual test assertions for the FIXED state:
  // We expect ALL queries to NOT have email=eq
  for (const query of profileQueries) {
      expect(query).not.toContain('email=eq');
  }

  // And at least one should have id=eq
  const hasIdQuery = profileQueries.some(q => q.includes('id=eq'));
  expect(hasIdQuery).toBe(true);
});
