import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const LAWYER_ID = 'a01f18a4-2cef-4a0d-99f5-d11f97752025';

test('Debug Book Consultation - Detailed', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  DEBUGGING BOOK CONSULTATION PAGE');
  console.log('═══════════════════════════════════════════\n');
  
  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  // Login
  await page.goto(`${BASE_URL}/login`);
  await page.click('button:has-text("User")');
  await page.fill('input[type="email"]', 'user1@visabuild.test');
  await page.fill('input[type="password"]', 'User123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  // Navigate to book consultation
  console.log('📍 Loading book consultation page...');
  await page.goto(`${BASE_URL}/dashboard/book-consultation/${LAWYER_ID}`);
  
  // Wait for loading to finish
  console.log('⏳ Waiting for page to fully load...');
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  
  // Check page content
  const pageText = await page.locator('body').innerText();
  
  console.log('\n📄 Page content check:');
  console.log(`  Contains 'No available slots': ${pageText.includes('No available slots')}`);
  console.log(`  Contains 'Book Consultation': ${pageText.includes('Book Consultation')}`);
  console.log(`  Contains 'Select Date': ${pageText.includes('Select Date')}`);
  
  // Check for slot buttons specifically
  const slotButtons = await page.locator('button').allInnerTexts();
  console.log(`\n🕐 Found ${slotButtons.length} buttons on page`);
  
  const timeButtons = slotButtons.filter(t => t.includes(':') || t.includes('AM') || t.includes('PM'));
  console.log(`  Time slot buttons: ${timeButtons.length}`);
  if (timeButtons.length > 0) {
    console.log(`  Times found: ${timeButtons.join(', ')}`);
  }
  
  // Check for loading state
  const hasLoading = await page.locator('text=/loading|Loading/i').isVisible().catch(() => false);
  console.log(`\n⏳ Page still loading: ${hasLoading}`);
  
  // Screenshot
  await page.screenshot({ path: 'test-results/book-consultation-debug.png', fullPage: true });
  
  if (consoleErrors.length > 0) {
    console.log('\n❌ Console Errors:');
    consoleErrors.forEach(e => console.log(`  ${e}`));
  } else {
    console.log('\n✅ No console errors');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
