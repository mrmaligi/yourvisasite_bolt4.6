import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

test('Admin Lawyer Approval - Full Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  LAWYER APPROVAL VERIFICATION');
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
  
  // Find first pending lawyer
  await page.waitForSelector('tr:has-text("pending")', { timeout: 20000 }).catch(() => {});
  const pendingRow = page.locator('tr:has-text("pending")').first();
  const hasPending = await pendingRow.isVisible().catch(() => false);
  
  if (!hasPending) {
    console.log('No pending lawyers found - all approved!');
    return;
  }
  
  // Get lawyer name before approval
  const lawyerName = await pendingRow.locator('td').first().innerText();
  console.log(`Found pending lawyer: ${lawyerName}`);
  
  // Click approve
  const approveBtn = pendingRow.locator('button:has-text("Approve")');
  await approveBtn.click();
  
  console.log('Clicked Approve button');
  await page.waitForTimeout(3000);
  
  // Take screenshot after approval
  await page.screenshot({ path: 'test-results/after-approval.png', fullPage: true });
  
  // Refresh page to check if status changed
  await page.reload();
  await page.waitForTimeout(4000);
  
  // Check if lawyer is now approved
  const approvedRows = await page.locator('tr:has-text("approved")').count();
  const pendingRows = await page.locator('tr:has-text("pending")').count();
  
  console.log(`\nAfter refresh:`);
  console.log(`  Approved lawyers: ${approvedRows}`);
  console.log(`  Pending lawyers: ${pendingRows}`);
  
  // Check if our lawyer is in approved list
  const isApproved = await page.locator(`tr:has-text("${lawyerName}"):has-text("approved")`).isVisible().catch(() => false);
  console.log(`  ${lawyerName} is approved: ${isApproved}`);
  
  await page.screenshot({ path: 'test-results/after-refresh.png', fullPage: true });
  
  console.log('\n═══════════════════════════════════════════');
});
