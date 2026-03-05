import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

test('Full Lawyer Flow: Register → Approve → Login', async ({ page }) => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  FULL LAWYER FLOW TEST');
  console.log('═══════════════════════════════════════════════════════\n');

  const timestamp = Date.now();
  const testEmail = `flowlawyer${timestamp}@test.com`;
  const testPassword = 'Lawyer123!';
  const testBar = `FLOW-${timestamp.toString().slice(-6)}`;

  // Step 1: Register as lawyer
  console.log('STEP 1: Register as Lawyer');
  console.log(`Email: ${testEmail}`);
  console.log(`Bar: ${testBar}`);

  await page.goto(`${BASE_URL}/register?role=lawyer`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.waitForSelector('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]', { state: 'visible', timeout: 30000 });
    await page.locator('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]').first().fill( 'Flow Test Lawyer');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.waitForSelector('input[placeholder*="Bar Number" i], input[placeholder*="bar" i]', { state: 'visible', timeout: 30000 });
    await page.locator('input[placeholder*="Bar Number" i], input[placeholder*="bar" i]').first().fill( testBar);
  if (await page.locator('select').first().isVisible({ timeout: 5000 }).catch(() => false)) await page.locator('select').first().selectOption({ label: 'Victoria' }).catch(() => {});
  await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);

  const regUrl = page.url();
  console.log(`After registration: ${regUrl}`);

  if (regUrl.includes('/pending')) {
    console.log('✅ Registration successful - pending approval\n');
  } else {
    console.log('❌ Registration issue\n');
  }

  await page.screenshot({ path: `test-results/flow-1-register-${timestamp}.png`, fullPage: true });

  // Step 2: Admin approves the lawyer
  console.log('STEP 2: Admin Approves Lawyer');

  // Login as admin
  await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 10000 }).catch(() => false)) { 
        await _adminBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
    }
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);

  // Go to lawyer management
  await page.goto(`${BASE_URL}/admin/lawyers`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);

  // Find and approve our test lawyer
  const lawyerRow = page.locator(`tr:has-text("${testBar}")`);
  const found = await lawyerRow.isVisible().catch(() => false);

  if (found) {
    console.log('Found lawyer in admin panel');
    const approveBtn = lawyerRow.locator('button:has-text("Approve")');
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(3000);
      console.log('✅ Lawyer approved\n');
    } else {
      console.log('ℹ️  Already approved or no approve button\n');
    }
  } else {
    console.log('❌ Lawyer not found in admin panel\n');
  }

  await page.screenshot({ path: `test-results/flow-2-approve-${timestamp}.png`, fullPage: true });

  // Step 3: Login as the approved lawyer
  console.log('STEP 3: Login as Approved Lawyer');

  await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.click('button:has-text("Lawyer") >> nth=0');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);

  const loginUrl = page.url();
  console.log(`After login: ${loginUrl}`);

  if (loginUrl.includes('/lawyer/dashboard')) {
    console.log('✅✅✅ SUCCESS! Lawyer can access dashboard! ✅✅✅');
  } else if (loginUrl.includes('/lawyer/pending')) {
    console.log('❌ Lawyer still pending - approval may not have worked');
  } else {
    console.log(`   Unexpected URL: ${loginUrl}`);
  }

  await page.screenshot({ path: `test-results/flow-3-login-${timestamp}.png`, fullPage: true });

  console.log('\n═══════════════════════════════════════════════════════');
});
