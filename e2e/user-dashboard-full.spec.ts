import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const USER_EMAIL = 'user1@visabuild.test';
const USER_PASSWORD = 'User123!';

test.describe('USER DASHBOARD - Full Test', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as user
    console.log('🔐 Logging in as user...');
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("User")');
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    
    const url = page.url();
    console.log(`  Logged in. URL: ${url}`);
    expect(url).toContain('/dashboard');
  });

  test('User Dashboard Overview', async ({ page }) => {
    console.log('\n📊 TESTING DASHBOARD OVERVIEW');
    
    // Check dashboard elements
    const hasWelcome = await page.locator('text=/welcome|dashboard|hello/i').count() > 0;
    const hasStats = await page.locator('text=/visa|application|status/i').count() > 0;
    
    console.log(`  Welcome message: ${hasWelcome}`);
    console.log(`  Stats visible: ${hasStats}`);
    
    await page.screenshot({ path: 'test-results/user-dashboard.png', fullPage: true });
  });

  test('User My Visas Page', async ({ page }) => {
    console.log('\n📋 TESTING MY VISAS PAGE');
    
    await page.goto(`${BASE_URL}/dashboard/visas`);
    await page.waitForTimeout(3000);
    
    const hasVisaContent = await page.locator('text=/visa|saved|track/i').count() > 0;
    console.log(`  Visa content: ${hasVisaContent}`);
    
    await page.screenshot({ path: 'test-results/user-my-visas.png', fullPage: true });
  });

  test('User Book Consultation Flow', async ({ page }) => {
    console.log('\n⚖️ TESTING BOOK CONSULTATION');
    
    // Navigate to lawyers
    await page.goto(`${BASE_URL}/lawyers`);
    await page.waitForTimeout(3000);
    
    console.log(`  Lawyers page URL: ${page.url()}`);
    
    // Check if lawyers are displayed
    const lawyerCards = await page.locator('[class*="card"], [class*="lawyer"]').count();
    console.log(`  Lawyer cards found: ${lawyerCards}`);
    
    // Try to click first lawyer
    const bookButton = page.locator('button:has-text("Book"), a:has-text("Book"), button:has-text("Consultation"), a:has-text("Consultation")').first();
    if (await bookButton.isVisible().catch(() => false)) {
      await bookButton.click();
      await page.waitForTimeout(3000);
      console.log(`  After click URL: ${page.url()}`);
    }
    
    await page.screenshot({ path: 'test-results/user-book-consultation.png', fullPage: true });
  });

  test('User Saved Visas', async ({ page }) => {
    console.log('\n💾 TESTING SAVED VISAS');
    
    await page.goto(`${BASE_URL}/dashboard/saved`);
    await page.waitForTimeout(3000);
    
    const hasContent = await page.locator('text=/saved|visa|bookmark/i').count() > 0;
    console.log(`  Saved visas content: ${hasContent}`);
    
    await page.screenshot({ path: 'test-results/user-saved-visas.png', fullPage: true });
  });

  test('User Settings', async ({ page }) => {
    console.log('\n⚙️ TESTING USER SETTINGS');
    
    await page.goto(`${BASE_URL}/dashboard/settings`);
    await page.waitForTimeout(3000);
    
    const hasForm = await page.locator('input, select, button').count() > 0;
    console.log(`  Form elements: ${hasForm}`);
    
    await page.screenshot({ path: 'test-results/user-settings.png', fullPage: true });
  });

  test('User Profile', async ({ page }) => {
    console.log('\n👤 TESTING USER PROFILE');
    
    await page.goto(`${BASE_URL}/dashboard/profile`);
    await page.waitForTimeout(3000);
    
    const hasProfile = await page.locator('text=/profile|name|email/i').count() > 0;
    console.log(`  Profile content: ${hasProfile}`);
    
    await page.screenshot({ path: 'test-results/user-profile.png', fullPage: true });
  });

  test('User Billing', async ({ page }) => {
    console.log('\n💰 TESTING USER BILLING');
    
    await page.goto(`${BASE_URL}/dashboard/billing`);
    await page.waitForTimeout(3000);
    
    const hasBilling = await page.locator('text=/billing|payment|subscription/i').count() > 0;
    console.log(`  Billing content: ${hasBilling}`);
    
    await page.screenshot({ path: 'test-results/user-billing.png', fullPage: true });
  });

  test('User Notifications', async ({ page }) => {
    console.log('\n🔔 TESTING USER NOTIFICATIONS');
    
    await page.goto(`${BASE_URL}/dashboard/notifications`);
    await page.waitForTimeout(3000);
    
    const hasNotifications = await page.locator('text=/notification|alert|message/i').count() > 0;
    console.log(`  Notifications content: ${hasNotifications}`);
    
    await page.screenshot({ path: 'test-results/user-notifications.png', fullPage: true });
  });
});
