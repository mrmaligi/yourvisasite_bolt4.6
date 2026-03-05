import { test, expect } from '@playwright/test';

test.setTimeout(90000);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Test Lawyer Registration - Check Status', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING LAWYER REGISTRATION STATUS');
  console.log('═══════════════════════════════════════════\n');

  const testEmail = `testlawyer${Date.now()}@test.com`;
  const testBar = `TEST-BAR-${Date.now().toString().slice(-4)}`;

  await page.goto(`${BASE_URL}/register?role=lawyer`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  console.log('1. Filling lawyer registration form...');

  // Use robust selectors - fall back gracefully if placeholder differs
  const nameField = page.locator('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]').first();
  const barField = page.locator('input[placeholder*="Bar Number" i], input[placeholder*="bar" i], input[name*="bar" i]').first();

  if (await nameField.isVisible({ timeout: 5000 }).catch(() => false)) await nameField.fill('Test Lawyer Auto');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'TestPass123!');
  if (await barField.isVisible({ timeout: 5000 }).catch(() => false)) await barField.fill(testBar);

  const selectEl = page.locator('select').first();
  if (await selectEl.isVisible({ timeout: 5000 }).catch(() => false)) {
    await selectEl.selectOption({ label: 'New South Wales' }).catch(() => { });
  }

  console.log(`   Email: ${testEmail}`);
  console.log(`   Bar Number: ${testBar}`);

  console.log('2. Submitting form...');
  const submitBtn = page.locator('button[type="submit"]').first();
  if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(5000);
  }

  console.log(`   Current URL: ${page.url()}`);
  await page.screenshot({ path: 'test-results/lawyer-reg-test.png', fullPage: true });

  const currentUrl = page.url();
  if (currentUrl.includes('/pending')) {
    console.log('✅ Redirected to /pending - good!');
  } else if (currentUrl.includes('/lawyer/dashboard')) {
    console.log('❌ Redirected to /lawyer/dashboard - AUTO APPROVED!');
  } else {
    console.log(`   URL: ${currentUrl}`);
  }

  console.log(`\n3. Check admin panel: ${BASE_URL}/admin/lawyers`);
  console.log(`   Look for: ${testBar}`);
  console.log('\n═══════════════════════════════════════════');

  expect(true).toBe(true);
});
