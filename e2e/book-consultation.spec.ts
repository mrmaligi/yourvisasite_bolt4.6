import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const LAWYER_ID = 'a01f18a4-2cef-4a0d-99f5-d11f97752025';

test('Book Consultation Page', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING BOOK CONSULTATION');
  console.log('═══════════════════════════════════════════\n');
  
  // Login first
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
  
  // Navigate to book consultation
  console.log('📍 Navigating to book consultation...');
  await page.goto(`${BASE_URL}/dashboard/book-consultation/${LAWYER_ID}`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('Current URL:', page.url());
  
  // Check page elements
  const hasTitle = await page.locator('text=/Book|Consultation|Lawyer/i').count() > 0;
  console.log('Has page title:', hasTitle);
  
  // Check for calendar or date picker
  const hasCalendar = await page.locator('input[type="date"], [class*="calendar"], [class*="datepicker"]').count() > 0;
  console.log('Has calendar:', hasCalendar);
  
  // Check for time slots
  const hasTimeSlots = await page.locator('button:has-text(":00"), [class*="time"]').count() > 0;
  console.log('Has time slots:', hasTimeSlots);
  
  // Check for book button
  const hasBookButton = await page.locator('button:has-text("Book"), button[type="submit"]').count() > 0;
  console.log('Has book button:', hasBookButton);
  
  await page.screenshot({ path: 'test-results/book-consultation.png', fullPage: true });
  
  console.log('\n📸 Screenshot saved');
  console.log('\n═══════════════════════════════════════════');
});
