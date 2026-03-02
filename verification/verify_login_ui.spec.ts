import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Verify Login UI', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  // Wait for the login options to be visible
  await expect(page.locator('text=Welcome Back')).toBeVisible();
  await expect(page.locator('text=Sign in to your VisaBuild account')).toBeVisible();

  // Check for the three login options
  await expect(page.getByRole('button', { name: 'Applicant' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lawyer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Admin' })).toBeVisible();

  // Check form elements
  await expect(page.getByLabel('Email Address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'verification/login_page.png' });
});
