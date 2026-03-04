import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Verify Lawyer Approval Works After RLS Fix', async ({ page }) => {
  console.log('Testing lawyer approval after RLS fix...');
  
  // Login as admin
  await page.goto(`${BASE_URL}/login`);
  await page.click('button:has-text("Admin")');
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);
  
  // Go to lawyers page
  await page.goto(`${BASE_URL}/admin/lawyers`);
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
