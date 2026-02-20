import { test, expect } from '@playwright/test';

test.describe('PWA and Toast UI Fixes', () => {
  test('Toast container has pointer-events-none', async ({ page }) => {
    await page.goto('/');

    // Locate the toast container by its specific classes
    const toastContainer = page.locator('div.fixed.bottom-4.right-4.z-\\[100\\]');

    // Check if it exists and has the class
    await expect(toastContainer).toHaveClass(/pointer-events-none/);
    await expect(toastContainer).toHaveClass(/w-full/);
    await expect(toastContainer).toHaveClass(/max-w-sm/);
  });
});
