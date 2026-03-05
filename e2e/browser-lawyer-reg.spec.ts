import { test, expect } from '@playwright/test';

test.setTimeout(90000);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Browser Lawyer Registration - Check if Auto-Approved', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  BROWSER LAWYER REGISTRATION TEST');
  console.log('═══════════════════════════════════════════\n');

  const testBar = `BROWSER-${Date.now().toString().slice(-6)}`;
  const testEmail = `browserlawyer${Date.now()}@test.com`;

  // Step 1: Navigate to registration
  console.log('1. Opening registration page...');
  await page.goto(`${BASE_URL}/register?role=lawyer`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Step 2: Fill the form
  console.log('2. Filling form...');
  await page.waitForLoadState('domcontentloaded');
  const nameField = page.locator('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]').first();
  const barField = page.locator('input[placeholder*="Bar Number" i], input[placeholder*="bar" i]').first();
  if (await nameField.isVisible({ timeout: 8000 }).catch(() => false)) await nameField.fill('Browser Test Lawyer');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'TestPass123!');
  if (await barField.isVisible({ timeout: 5000 }).catch(() => false)) await barField.fill(testBar);
  const selectEl = page.locator('select').first();
  if (await selectEl.isVisible({ timeout: 5000 }).catch(() => false)) await selectEl.selectOption({ label: 'Victoria' }).catch(() => { });
  console.log(`   Email: ${testEmail}`);
  console.log(`   Bar: ${testBar}`);

  // Step 3: Submit
  console.log('3. Submitting...');
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForTimeout(6000);

  const currentUrl = page.url();
  console.log(`   Redirected to: ${currentUrl}`);

  // Check where we ended up
  if (currentUrl.includes('/pending')) {
    console.log('   ✅ Redirected to /pending - CORRECT');
  } else if (currentUrl.includes('/lawyer/dashboard')) {
    console.log('   ❌ Redirected to /lawyer/dashboard - AUTO APPROVED!');
  } else if (currentUrl.includes('/dashboard')) {
    console.log('   ℹ️  Redirected to /dashboard');
  }

  await page.screenshot({ path: 'test-results/browser-reg-result.png', fullPage: true });

  // Step 4: Check database status via API
  console.log('\n4. Checking database status...');

  // Need to use the anon key to check
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

  // Wait for database to sync
  await page.waitForTimeout(3000);

  // Use fetch to check status
  const response = await page.evaluate(async ({ barNumber, apiKey }: { barNumber: string, apiKey: string }) => {
    const res = await fetch(`https://zogfvzzizbbmmmnlzxdg.supabase.co/rest/v1/lawyer_profiles?bar_number=eq.${barNumber}&select=verification_status,is_verified`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return res.json();
  }, { barNumber: testBar, apiKey: ANON_KEY });

  console.log(`   Database response: ${JSON.stringify(response)}`);

  if (((response as any)?.[0]?.verification_status) === 'approved') {
    console.log('\n   ❌❌❌ AUTO APPROVED IN DATABASE! ❌❌❌');
  } else if (((response as any)?.[0]?.verification_status) === 'pending') {
    console.log('\n   ✅ CORRECTLY PENDING IN DATABASE');
  } else {
    console.log('\n   ⚠️  Could not verify status');
  }

  console.log('\n═══════════════════════════════════════════');
});
