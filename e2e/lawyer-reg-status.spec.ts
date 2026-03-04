import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Test Lawyer Registration - Check Status', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING LAWYER REGISTRATION STATUS');
  console.log('═══════════════════════════════════════════\n');
  
  const testEmail = `testlawyer${Date.now()}@test.com`;
  const testBar = `TEST-BAR-${Date.now().toString().slice(-4)}`;
  
  // Go to registration
  await page.goto(`${BASE_URL}/register?role=lawyer`);
  await page.waitForTimeout(3000);
  
  console.log('1. Filling lawyer registration form...');
  
  // Fill the form
  await page.fill('input[placeholder*="Jane Doe"]', 'Test Lawyer Auto');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'TestPass123!');
  await page.fill('input[placeholder*="Bar Number"]', testBar);
  await page.selectOption('select', 'New South Wales');
  
  console.log(`   Email: ${testEmail}`);
  console.log(`   Bar Number: ${testBar}`);
  
  // Submit
  console.log('2. Submitting form...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  console.log(`   Current URL: ${page.url()}`);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/lawyer-reg-test.png', fullPage: true });
  
  // Check what page we're on
  const currentUrl = page.url();
  if (currentUrl.includes('/pending')) {
    console.log('✅ Redirected to /pending - good!');
  } else if (currentUrl.includes('/lawyer/dashboard')) {
    console.log('❌ Redirected to /lawyer/dashboard - AUTO APPROVED!');
  } else {
    console.log(`   URL: ${currentUrl}`);
  }
  
  console.log('\n3. Checking database status...');
  
  // The user would need to check the database to see the actual status
  console.log(`   Check in admin panel: ${BASE_URL}/admin/lawyers`);
  console.log(`   Look for: ${testBar}`);
  
  console.log('\n═══════════════════════════════════════════');
});
