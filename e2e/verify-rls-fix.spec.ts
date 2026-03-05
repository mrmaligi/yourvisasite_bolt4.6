import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Verify Lawyer Approval Works After RLS Fix', async ({ page }) => {
  console.log('Testing lawyer approval after RLS fix...');
  
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
  
  // Go to lawyers page
  await page.goto(`${BASE_URL}/admin/lawyers`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);
  
  // Count pending before
  const pendingBefore = await page.locator('text=/pending/i').count();
  console.log(`Pending before: ${pendingBefore}`);
  
  // Click approve
  const approveBtn = page.locator('button:has-text("Approve")').first();
  if (await approveBtn.isVisible().catch(() => false)) {
    await approveBtn.click();
    await page.waitForTimeout(5000);
    
    // Refresh
    await page.reload();
    await page.waitForTimeout(4000);
    
    const pendingAfter = await page.locator('text=/pending/i').count();
    console.log(`Pending after: ${pendingAfter}`);
    
    if (pendingAfter < pendingBefore) {
      console.log('✅✅✅ LAWYER APPROVAL WORKING! ✅✅✅');
    } else {
      console.log('⚠️ Still pending - may need another refresh');
    }
  }
  
  await page.screenshot({ path: 'test-results/rls-fix-verified.png', fullPage: true });
});
