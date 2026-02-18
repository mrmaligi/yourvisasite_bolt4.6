import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control', () => {
  test('User Dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Lawyer Dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/lawyer/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Admin Dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
