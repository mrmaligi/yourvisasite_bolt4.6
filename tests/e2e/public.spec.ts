import { test, expect } from '@playwright/test';

test.describe('Public Routes', () => {
  test('Landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/VisaBuild/);
    await expect(page.getByRole('heading', { name: 'Navigate Australian Immigration' })).toBeVisible();
  });

  test('Visa Search page loads with mocked data', async ({ page }) => {
    await page.route('**/rest/v1/visas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            name: 'Test Visa 1',
            subclass: '100',
            category: 'work',
            summary: 'Summary 1',
            cost_aud: '$4000',
            processing_time_range: '3-5 months',
            is_active: true
          },
          {
            id: '2',
            name: 'Test Visa 2',
            subclass: '200',
            category: 'family',
            summary: 'Summary 2',
            cost_aud: 'Free',
            processing_time_range: '12 months',
            is_active: true
          }
        ])
      });
    });

    await page.goto('/visas');
    await expect(page.getByPlaceholder('Search by name or subclass...')).toBeVisible();
    await expect(page.getByText('Test Visa 1')).toBeVisible();
    await expect(page.getByText('Test Visa 2')).toBeVisible();
    await expect(page.getByText('Summary 1')).toBeVisible();
    await expect(page.getByText('3-5 months')).toBeVisible();
  });

  test('Visa Detail page handles non-existent/error', async ({ page }) => {
    // Abort the request to simulate a network error or "not found" that results in client-side error
    await page.route('**/rest/v1/visas*', async route => {
        await route.abort();
    });
    await page.goto('/visas/non-existent-id');
    await expect(page.getByText('Visa not found')).toBeVisible();
  });

  test('Tracker page loads with mocked stats', async ({ page }) => {
    await page.route('**/rest/v1/tracker_stats*', async route => {
       await route.fulfill({
         status: 200,
         body: JSON.stringify([
           {
             visa_id: '1',
             total_entries: 10,
             weighted_avg_days: 50,
             median_days: 45,
             p25_days: 30,
             p75_days: 60,
             visas: { name: 'Partner Visa', subclass: '820', category: 'family' }
           }
         ])
       });
    });

    await page.goto('/tracker');
    await expect(page.getByRole('heading', { name: 'Visa Processing Time Tracker' })).toBeVisible();
    await expect(page.getByText('Partner Visa')).toBeVisible();
    await expect(page.getByText('50d')).toBeVisible();
  });

  test('Lawyer Directory page loads', async ({ page }) => {
    await page.goto('/lawyers');
    await expect(page.getByPlaceholder('Search by name, specialty, or jurisdiction...')).toBeVisible();
  });

  test('News page loads', async ({ page }) => {
    await page.goto('/news');
    await expect(page.getByRole('heading', { name: 'Immigration News & Updates' })).toBeVisible();
  });

  test('Marketplace page loads', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.getByRole('heading', { name: 'Services Marketplace' })).toBeVisible();
  });

  test('Pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: 'Simple, Transparent Pricing' })).toBeVisible();
  });
});
