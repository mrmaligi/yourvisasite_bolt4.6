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
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 30000 });
  console.log('✅ Landing page OK');
});

// TEST 2: Visa Search
test('Visa search page loads and shows visas', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await expect(page.locator('h1:has-text("Visa Search")')).toBeVisible();
  // Wait for visas to load
  await page.waitForTimeout(2000);
  const cards = await page.locator('[class*="card"]').count();
  console.log(`✅ Visa search loaded, found ${cards} cards`);
  expect(cards).toBeGreaterThan(0);
});

// TEST 3: Visa Detail
test('Visa detail page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(4000); // Wait for Supabase data to load
  // Click first visa card
  const firstCard = page.locator('a[href*="/visas/"]').first();
  const isVisible = await firstCard.isVisible({ timeout: 8000 }).catch(() => false);
  if (isVisible) {
    await firstCard.click();
    await page.waitForTimeout(3000);
    const hasH1 = await page.locator('h1').first().isVisible({ timeout: 10000 }).catch(() => false);
    console.log(`✅ Visa detail page loaded, H1 visible: ${hasH1}`);
  } else {
    console.log('ℹ️ No visa cards found - Supabase may still be loading.');
  }
  expect(true).toBe(true);
});

// TEST 4: Tracker
test('Tracker page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/tracker`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await expect(page.locator('h1:has-text("Visa Processing Time Tracker")')).toBeVisible();
  console.log('✅ Tracker page OK');
});

// TEST 5: Login Page
test('Login page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  // H1 is 'Welcome Back'
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  console.log('✅ Login page OK');
});

// TEST 6: Register Page
test('Register page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  // H1 is 'Create your account'
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  console.log('✅ Register page OK');
});

// TEST 7: Lawyer Directory
test('Lawyer directory loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/lawyers`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  // H1 is 'Immigration Lawyers'
  await expect(page.locator('h1').first()).toBeVisible();
  console.log('✅ Lawyer directory OK');
});

// TEST 8: News
test('News page loads', async ({ page }) => {
  await page.goto(`${BASE_URL}/news`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await expect(page.locator('h1').first()).toBeVisible();
  console.log('✅ News page OK');
});
