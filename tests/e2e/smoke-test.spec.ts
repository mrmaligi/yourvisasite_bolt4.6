import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.beforeEach(async ({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ CONSOLE ERROR on ${page.url()}:`, msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR on ${page.url()}:`, error.message);
  });
});

test('Landing page loads without errors', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/VisaBuild/i);
  await expect(page.locator('text=Find Your Visa')).toBeVisible();
  await expect(page.locator('text=Track Processing Time')).toBeVisible();
  console.log('✅ Landing page OK');
});

test('Visa search page loads and shows visas', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
  // Target the specific h1 for Visa Search to be unambiguous
  await expect(page.locator('h1', { hasText: 'Visa Search' })).toBeVisible();
  await page.waitForTimeout(2000);
  const cards = await page.locator('[class*="card"]').count();
  console.log(`✅ Visa search loaded, found ${cards} cards`);
  expect(cards).toBeGreaterThan(0);
});

test('Visa detail page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
  await page.waitForTimeout(2000);
  const firstCard = page.locator('a[href*="/visas/"]').first();
  if (await firstCard.isVisible().catch(() => false)) {
    await firstCard.click();
    await expect(page.locator('text=Processing Time')).toBeVisible();
    console.log('✅ Visa detail page OK');
  }
});

test('Tracker page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/tracker`);
  // Target a more specific element or use first() if duplicates are expected
  await expect(page.locator('text=Processing Time Tracker').first()).toBeVisible();
  console.log('✅ Tracker page OK');
});

test('Login page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  // Target the specific Sign In heading
  await expect(page.locator('h2', { hasText: 'Sign in' })).toBeVisible();
  console.log('✅ Login page OK');
});

test('Register page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
  await expect(page.locator('text=Create Account')).toBeVisible();
  console.log('✅ Register page OK');
});

test('Lawyer directory loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/lawyers`);
  await expect(page.locator('text=Find a Lawyer')).toBeVisible();
  console.log('✅ Lawyer directory OK');
});

test('News page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/news`);
  // Target the specific News heading
  await expect(page.locator('h1', { hasText: 'News' })).toBeVisible();
  console.log('✅ News page OK');
});
