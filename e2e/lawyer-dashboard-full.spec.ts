import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const LAWYER_EMAIL = 'testlawyer1772618600@gmail.com';
const LAWYER_PASSWORD = 'Lawyer123!';

test.describe('LAWYER DASHBOARD - Full Test', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as lawyer
    console.log('🔐 Logging in as lawyer...');
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("Lawyer")');
    await page.fill('input[type="email"]', LAWYER_EMAIL);
    await page.fill('input[type="password"]', LAWYER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    
    const url = page.url();
    console.log(`  Logged in. URL: ${url}`);
  });

  test('Lawyer Dashboard Overview', async ({ page }) => {
    console.log('\n📊 TESTING LAWYER DASHBOARD');
    
    const hasWelcome = await page.locator('text=/welcome|dashboard|lawyer/i').count() > 0;
    const hasStats = await page.locator('text=/client|consultation|appointment/i').count() > 0;
    
    console.log(`  Welcome message: ${hasWelcome}`);
    console.log(`  Stats visible: ${hasStats}`);
    
    await page.screenshot({ path: 'test-results/lawyer-dashboard.png', fullPage: true });
  });

  test('Lawyer Clients Page', async ({ page }) => {
    console.log('\n👥 TESTING LAWYER CLIENTS');
    
    await page.goto(`${BASE_URL}/lawyer/clients`);
    await page.waitForTimeout(3000);
    
    const hasContent = await page.locator('text=/client|patient|user/i').count() > 0;
    console.log(`  Clients content: ${hasContent}`);
    
    await page.screenshot({ path: 'test-results/lawyer-clients.png', fullPage: true });
  });

  test('Lawyer Consultations', async ({ page }) => {
    console.log('\n📅 TESTING LAWYER CONSULTATIONS');
    
    await page.goto(`${BASE_URL}/lawyer/consultations`);
    await page.waitForTimeout(3000);
    
    const hasContent = await page.locator('text=/consultation|appointment|booking/i').count() > 0;
    console.log(`  Consultations content: ${hasContent}`);
    
    await page.screenshot({ path: 'test-results/lawyer-consultations.png', fullPage: true });
  });

  test('Lawyer Availability', async ({ page }) => {
    console.log('\n🕐 TESTING LAWYER AVAILABILITY');
    
    await page.goto(`${BASE_URL}/lawyer/availability`);
    await page.waitForTimeout(3000);
    
    const hasCalendar = await page.locator('input[type="date"], [class*="calendar"]').count() > 0;
    const hasSlots = await page.locator('button, [class*="slot"], [class*="time"]').count() > 0;
    
    console.log(`  Calendar: ${hasCalendar}`);
    console.log(`  Time slots: ${hasSlots}`);
    
    await page.screenshot({ path: 'test-results/lawyer-availability.png', fullPage: true });
  });

  test('Lawyer Settings', async ({ page }) => {
    console.log('\n⚙️ TESTING LAWYER SETTINGS');
    
    await page.goto(`${BASE_URL}/lawyer/settings`);
    await page.waitForTimeout(3000);
    
    const hasForm = await page.locator('input, select, button').count() > 0;
    console.log(`  Form elements: ${hasForm}`);
    
    await page.screenshot({ path: 'test-results/lawyer-settings.png', fullPage: true });
  });
});
