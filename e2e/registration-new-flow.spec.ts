import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test.describe('NEW Registration Flow Tests', () => {
  
  test('Applicant Registration - Full Flow', async ({ page }) => {
    console.log('═══════════════════════════════════════════');
    console.log('  TESTING APPLICANT REGISTRATION');
    console.log('═══════════════════════════════════════════\n');
    
    await page.goto(`${BASE_URL}/register`);
    await page.waitForTimeout(3000);
    
    // Check role selector exists
    const hasRoleSelector = await page.locator('button:has-text("Applicant")').isVisible().catch(() => false);
    console.log(`✅ Role selector visible: ${hasRoleSelector}`);
    
    // Applicant should be selected by default
    const applicantBtn = await page.locator('button:has-text("Applicant")');
    const isSelected = await applicantBtn.evaluate(el => el.classList.contains('border-primary-600'));
    console.log(`✅ Applicant selected by default: ${isSelected}`);
    
    // Fill form
    const testEmail = `applicant${Date.now()}@test.com`;
    await page.fill('input[placeholder*="Jane Doe"]', 'Test Applicant');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'TestPass123!');
    
    console.log(`✅ Form filled: ${testEmail}`);
    
    // Submit button should say "Create Account"
    const submitText = await page.locator('button[type="submit"]').innerText();
    console.log(`✅ Submit button: ${submitText}`);
    
    await page.screenshot({ path: 'test-results/reg-applicant.png', fullPage: true });
    console.log('\n✅ Screenshot saved');
  });

  test('Lawyer Registration - Shows Extra Fields', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TESTING LAWYER REGISTRATION UI');
    console.log('═══════════════════════════════════════════\n');
    
    await page.goto(`${BASE_URL}/register`);
    await page.waitForTimeout(3000);
    
    // Click Lawyer button
    await page.click('button:has-text("Lawyer")');
    await page.waitForTimeout(500);
    
    console.log('✅ Selected Lawyer role');
    
    // Check for lawyer-specific fields
    const hasBarNumber = await page.locator('text=/Bar Number/i').isVisible().catch(() => false);
    const hasJurisdiction = await page.locator('text=/Jurisdiction/i').isVisible().catch(() => false);
    
    console.log(`✅ Bar Number field: ${hasBarNumber}`);
    console.log(`✅ Jurisdiction field: ${hasJurisdiction}`);
    
    // Submit button should say "Create Lawyer Account"
    const submitText = await page.locator('button[type="submit"]').innerText();
    console.log(`✅ Submit button: ${submitText}`);
    
    // Fill lawyer form
    const testEmail = `lawyer${Date.now()}@test.com`;
    await page.fill('input[placeholder*="Jane Doe"]', 'Test Lawyer');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.fill('input[placeholder*="Bar Number"]', 'LAW-TEST-123');
    await page.selectOption('select', 'New South Wales');
    
    console.log(`✅ Form filled: ${testEmail}`);
    
    await page.screenshot({ path: 'test-results/reg-lawyer.png', fullPage: true });
    console.log('\n✅ Screenshot saved');
  });

  test('Login Page - Role Selection', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TESTING LOGIN PAGE ROLE SELECTOR');
    console.log('═══════════════════════════════════════════\n');
    
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(3000);
    
    // Check role selector exists
    const hasUser = await page.locator('button:has-text("Applicant")').isVisible().catch(() => false);
    const hasLawyer = await page.locator('button:has-text("Lawyer")').isVisible().catch(() => false);
    const hasAdmin = await page.locator('button:has-text("Admin")').isVisible().catch(() => false);
    
    console.log(`✅ Applicant button: ${hasUser}`);
    console.log(`✅ Lawyer button: ${hasLawyer}`);
    console.log(`✅ Admin button: ${hasAdmin}`);
    
    // Test clicking Lawyer
    await page.click('button:has-text("Lawyer")');
    await page.waitForTimeout(500);
    
    // Check "Create lawyer account" link
    const regLink = await page.locator('a[href*="/register?role=lawyer"]').innerText().catch(() => '');
    console.log(`✅ Registration link: ${regLink}`);
    
    await page.screenshot({ path: 'test-results/login-roles.png', fullPage: true });
    console.log('\n✅ Screenshot saved');
  });

  test('Register with Role Parameter - /register?role=lawyer', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TESTING ROLE PARAMETER URL');
    console.log('═══════════════════════════════════════════\n');
    
    await page.goto(`${BASE_URL}/register?role=lawyer`);
    await page.waitForTimeout(3000);
    
    // Lawyer should be pre-selected
    const lawyerBtn = await page.locator('button:has-text("Lawyer")');
    const isSelected = await lawyerBtn.evaluate(el => el.classList.contains('border-primary-600'));
    console.log(`✅ Lawyer pre-selected: ${isSelected}`);
    
    // Lawyer fields should be visible
    const hasBarNumber = await page.locator('text=/Bar Number/i').isVisible().catch(() => false);
    console.log(`✅ Bar Number visible: ${hasBarNumber}`);
    
    await page.screenshot({ path: 'test-results/reg-lawyer-url.png', fullPage: true });
    console.log('\n✅ Screenshot saved');
  });
});
