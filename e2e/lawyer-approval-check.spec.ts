import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

test('Test Lawyer Approval - After Fix', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING LAWYER APPROVAL (AFTER FIX)');
  console.log('═══════════════════════════════════════════\n');
  
  // Capture console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ Console: ${msg.text()}`);
    }
  });
  
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
  
  console.log(`📍 URL: ${page.url()}`);
  
  // Count pending lawyers
  const pendingBefore = await page.locator('text=/pending/i').count();
  console.log(`⏳ Pending lawyers before: ${pendingBefore}`);
  
  // Take screenshot before
  await page.screenshot({ path: 'test-results/before-approval.png', fullPage: true });
  
  // Find and click approve on first pending lawyer
  const approveBtn = page.locator('button:has-text("Approve")').first();
  const hasApprove = await approveBtn.isVisible().catch(() => false);
  
  if (hasApprove) {
    console.log('✅ Found Approve button, clicking...');
    await approveBtn.click();
    await page.waitForTimeout(4000);
    
    // Check for toast/success message
    const pageText = await page.locator('body').innerText();
    const hasSuccess = pageText.toLowerCase().includes('approved') || 
                       pageText.toLowerCase().includes('success');
    console.log(`✅ Success message shown: ${hasSuccess}`);
    
    // Refresh and check
    await page.reload();
    await page.waitForTimeout(4000);
    
    const pendingAfter = await page.locator('text=/pending/i').count();
    console.log(`⏳ Pending lawyers after: ${pendingAfter}`);
    
    if (pendingAfter < pendingBefore) {
      console.log('🎉 LAWYER APPROVED SUCCESSFULLY!');
    } else {
      console.log('⚠️  Lawyer still pending - RLS policy may need update');
    }
  } else {
    console.log('ℹ️  No pending lawyers to approve');
  }
  
  // Screenshot after
  await page.screenshot({ path: 'test-results/after-approval.png', fullPage: true });
  
  if (errors.length > 0) {
    console.log('\n❌ Console Errors:');
    errors.forEach(e => console.log(`  ${e}`));
  }
  
  console.log('\n═══════════════════════════════════════════');
});
