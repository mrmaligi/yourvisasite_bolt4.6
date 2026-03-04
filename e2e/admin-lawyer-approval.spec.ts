import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

test('Admin Lawyer Approval Flow', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING ADMIN LAWYER APPROVAL');
  console.log('═══════════════════════════════════════════\n');
  
  // Login as admin
  console.log('1. Logging in as admin...');
  await page.goto(`${BASE_URL}/login`);
  await page.click('button:has-text("Admin")');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);
  
  console.log(`   Logged in. URL: ${page.url()}`);
  
  // Navigate to Lawyer Management
  console.log('\n2. Navigating to Lawyer Management...');
  await page.goto(`${BASE_URL}/admin/lawyers`);
  await page.waitForTimeout(4000);
  
  console.log(`   URL: ${page.url()}`);
  
  // Check page content
  const pageText = await page.locator('body').innerText();
  console.log(`   Contains 'Lawyer Management': ${pageText.includes('Lawyer Management')}`);
  console.log(`   Contains 'pending': ${pageText.toLowerCase().includes('pending')}`);
  
  // Look for lawyers
  const rows = await page.locator('tr').count();
  console.log(`   Table rows found: ${rows}`);
  
  // Check for Approve/Reject buttons
  const approveBtn = await page.locator('button:has-text("Approve")').first().isVisible().catch(() => false);
  const rejectBtn = await page.locator('button:has-text("Reject")').first().isVisible().catch(() => false);
  
  console.log(`   Approve button visible: ${approveBtn}`);
  console.log(`   Reject button visible: ${rejectBtn}`);
  
  // Get status badges
  const pendingBadges = await page.locator('text=/pending/i').count();
  const approvedBadges = await page.locator('text=/approved/i').count();
  
  console.log(`   Pending lawyers: ${pendingBadges}`);
  console.log(`   Approved lawyers: ${approvedBadges}`);
  
  await page.screenshot({ path: 'test-results/admin-lawyer-approval.png', fullPage: true });
  
  console.log('\n3. Screenshot saved');
  
  // If there's a pending lawyer, test approval
  if (approveBtn) {
    console.log('\n4. Testing approval process...');
    
    // Click approve on first pending lawyer
    await page.locator('button:has-text("Approve")').first().click();
    await page.waitForTimeout(3000);
    
    // Check for success message
    const hasSuccess = await page.locator('text=/approved|success/i').isVisible().catch(() => false);
    console.log(`   Success message: ${hasSuccess}`);
    
    await page.screenshot({ path: 'test-results/admin-lawyer-approved.png', fullPage: true });
  }
  
  console.log('\n═══════════════════════════════════════════');
});
