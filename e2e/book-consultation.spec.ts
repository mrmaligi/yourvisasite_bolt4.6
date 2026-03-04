import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const LAWYER_ID = 'a01f18a4-2cef-4a0d-99f5-d11f97752025';

test('Book Consultation Page', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING BOOK CONSULTATION');
  console.log('═══════════════════════════════════════════\n');
  
  // Login first
  await page.goto(`${BASE_URL}/login`);
  await page.click('button:has-text("User")');
  await page.fill('input[type="email"]', 'user1@visabuild.test');
  await page.fill('input[type="password"]', 'User123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  // Navigate to book consultation
  console.log('📍 Navigating to book consultation...');
  await page.goto(`${BASE_URL}/dashboard/book-consultation/${LAWYER_ID}`);
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
