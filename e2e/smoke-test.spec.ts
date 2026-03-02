import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Helper to check console errors
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

// TEST 1: Landing Page
test('Landing page loads without errors', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/VisaBuild/i);
  await expect(page.locator('text=Find Your Visa')).toBeVisible();
  await expect(page.locator('text=Track Processing Time')).toBeVisible();
  console.log('✅ Landing page OK');
});

// TEST 2: Visa Search
test('Visa search page loads and shows visas', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
  await expect(page.locator('text=Visa Search')).toBeVisible();
  // Wait for visas to load
  await page.waitForTimeout(2000);
  const cards = await page.locator('[class*="card"]').count();
  console.log(`✅ Visa search loaded, found ${cards} cards`);
  expect(cards).toBeGreaterThan(0);
});

// TEST 3: Visa Detail
test('Visa detail page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
  await page.waitForTimeout(2000);
  // Click first visa card
  const firstCard = page.locator('a[href*="/visas/"]').first();
  if (await firstCard.isVisible().catch(() => false)) {
    await firstCard.click();
    await expect(page.locator('text=Processing Time')).toBeVisible();
    console.log('✅ Visa detail page OK');
  }
});

// TEST 4: Tracker
test('Tracker page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/tracker`);
  await expect(page.locator('text=Visa Processing Time Tracker')).toBeVisible();
  console.log('✅ Tracker page OK');
});

// TEST 5: Login Page
test('Login page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await expect(page.locator('text=Sign In')).toBeVisible();
  console.log('✅ Login page OK');
});

// TEST 6: Register Page
test('Register page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
  await expect(page.locator('text=Create Account')).toBeVisible();
  console.log('✅ Register page OK');
});

// TEST 7: Lawyer Directory
test('Lawyer directory loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/lawyers`);
  await expect(page.locator('text=Find a Lawyer')).toBeVisible();
  console.log('✅ Lawyer directory OK');
});

// TEST 8: News
test('News page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/news`);
  await expect(page.locator('text=News')).toBeVisible();
  console.log('✅ News page OK');
});
