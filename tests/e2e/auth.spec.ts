import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('Login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    // Corrected placeholder from 'Enter your password' to '••••••••' based on source code
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
  });

  test('Login handles error', async ({ page }) => {
    // Mock the auth request to fail
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' })
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    // Corrected placeholder
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    // Using locator for submit button inside form
    await page.locator('button[type="submit"]').click();

    // Verify error toast or message
    await expect(page.getByRole('alert').getByText('Invalid login credentials')).toBeVisible();
  });

  test('Register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('Lawyer Register page loads', async ({ page }) => {
    await page.goto('/register/lawyer');
    await expect(page.getByRole('heading', { name: 'Join as a Lawyer' })).toBeVisible();
  });
});
