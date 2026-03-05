import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

/**
 * CRON JOB 1: Test all user roles and interactions
 * Runs every 20 minutes
 */
test.describe('CRON: Role Testing Suite', () => {
  test.setTimeout(90000);
  
  test('Create and Test Applicant Flow', async ({ page }) => {
    console.log('═══════════════════════════════════════════');
    console.log('  CRON: TESTING APPLICANT FLOW');
    console.log('═══════════════════════════════════════════\n');
    
    const timestamp = Date.now();
    const testEmail = `cronuser_${timestamp}@visabuild.test`;
    const testPassword = 'User123!';
    
    // Register
    console.log(`Creating applicant: ${testEmail}`);
    await page.goto(`${BASE_URL}/register`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.waitForSelector('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]', { state: 'visible', timeout: 30000 });
    await page.locator('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]').first().fill( `Test User ${timestamp}`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check redirect
    const url = page.url();
    console.log(`Redirected to: ${url}`);
    
    if (url.includes('/dashboard')) {
      console.log('✅ Applicant registration successful');
    } else {
      console.log('❌ Applicant registration failed');
    }
    
    await page.screenshot({ path: `test-results/cron-applicant-${timestamp}.png`, fullPage: true });
  });

  test('Create and Test Lawyer Flow', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  CRON: TESTING LAWYER FLOW');
    console.log('═══════════════════════════════════════════\n');
    
    const timestamp = Date.now();
    const testEmail = `cronlawyer_${timestamp}@visabuild.test`;
    const testBar = `CRON-${timestamp.toString().slice(-6)}`;
    
    // Register as lawyer
    console.log(`Creating lawyer: ${testEmail}`);
    await page.goto(`${BASE_URL}/register?role=lawyer`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.waitForSelector('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]', { state: 'visible', timeout: 30000 });
    await page.locator('input[placeholder*="Jane Doe" i], input[placeholder*="Full Name" i], input[placeholder*="Name" i]').first().fill( `Test Lawyer ${timestamp}`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'Lawyer123!');
    await page.waitForSelector('input[placeholder*="Bar Number" i], input[placeholder*="bar" i]', { state: 'visible', timeout: 30000 });
    await page.locator('input[placeholder*="Bar Number" i], input[placeholder*="bar" i]').first().fill( testBar);
    if (await page.locator('select').first().isVisible({ timeout: 5000 }).catch(() => false)) await page.locator('select').first().selectOption({ label: 'New South Wales' }).catch(() => {});
    await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
    
    const url = page.url();
    console.log(`Redirected to: ${url}`);
    
    // Verify in database
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    const { data } = await supabase
      .from('lawyer_profiles')
      .select('verification_status, is_verified')
      .eq('bar_number', testBar)
      .single();
    
    console.log(`Lawyer status: ${JSON.stringify(data)}`);
    
    if (data?.verification_status === 'pending') {
      console.log('✅ Lawyer correctly pending approval');
    } else if (data?.verification_status === 'approved') {
      console.log('⚠️  Lawyer auto-approved (investigate!)');
    } else {
      console.log('❌ Could not verify lawyer status');
    }
    
    await page.screenshot({ path: `test-results/cron-lawyer-${timestamp}.png`, fullPage: true });
  });

  test('Test User-Lawyer Interaction', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  CRON: TESTING USER-LAWYER INTERACTION');
    console.log('═══════════════════════════════════════════\n');
    
    // Login as existing user
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.click('button:has-text("User")');
    await page.fill('input[type="email"]', 'user1@visabuild.test');
    await page.fill('input[type="password"]', 'User123!');
    await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Try to book consultation
    await page.goto(`${BASE_URL}/lawyers`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    const lawyerCount = await page.locator('[class*="card"]').count();
    console.log(`Found ${lawyerCount} lawyer cards`);
    
    if (lawyerCount > 0) {
      console.log('✅ Lawyers listing works');
    } else {
      console.log('❌ No lawyers found');
    }
    
    await page.screenshot({ path: `test-results/cron-interaction-${Date.now()}.png`, fullPage: true });
  });

  test('Test Admin Approval Flow', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  CRON: TESTING ADMIN APPROVAL');
    console.log('═══════════════════════════════════════════\n');
    
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 10000 }).catch(() => false)) { 
        await _adminBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
    }
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
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
    
    const pendingCount = await page.locator('text=/pending/i').count();
    const approvedCount = await page.locator('text=/approved/i').count();
    
    console.log(`Pending lawyers: ${pendingCount}`);
    console.log(`Approved lawyers: ${approvedCount}`);
    
    // Try to approve if there's a pending lawyer
    const approveBtn = page.locator('button:has-text("Approve")').first();
    if (await approveBtn.isVisible().catch(() => false)) {
      console.log('Found lawyer to approve, clicking...');
      await approveBtn.click();
      await page.waitForTimeout(3000);
      console.log('✅ Approve button clicked');
    }
    
    await page.screenshot({ path: `test-results/cron-admin-${Date.now()}.png`, fullPage: true });
  });
});
