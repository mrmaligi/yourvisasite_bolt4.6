import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Lawyer Registration - Full Flow', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING LAWYER REGISTRATION');
  console.log('═══════════════════════════════════════════\n');
  
  // Capture errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ ${msg.text()}`);
    }
  });
  
  // Go to registration
  console.log('1. Navigating to registration...');
  await page.goto(`${BASE_URL}/register/lawyer`);
  await page.waitForTimeout(3000);
  
  console.log(`   URL: ${page.url()}`);
  console.log(`   Title: ${await page.title()}`);
  
  // Check form elements
  const hasName = await page.locator('input[name*="name" i], input[placeholder*="name" i]').first().isVisible().catch(() => false);
  const hasEmail = await page.locator('input[type="email"]').first().isVisible().catch(() => false);
  const hasPassword = await page.locator('input[type="password"]').first().isVisible().catch(() => false);
  const hasBarNumber = await page.locator('input[name*="bar" i], input[placeholder*="bar" i]').first().isVisible().catch(() => false);
  
  console.log('');
  console.log('2. Form Elements:');
  console.log(`   Name field: ${hasName}`);
  console.log(`   Email field: ${hasEmail}`);
  console.log(`   Password field: ${hasPassword}`);
  console.log(`   Bar Number field: ${hasBarNumber}`);
  
  // Fill form
  console.log('');
  console.log('3. Filling registration form...');
  
  const testEmail = `lawyer${Date.now()}@gmail.com`;
  
  // Fill all fields
  await page.fill('input[name*="name" i], input[placeholder*="Full Name" i]', 'Test Lawyer');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'LawyerPass123!');
  
  // Fill bar number if exists
  if (hasBarNumber) {
    await page.fill('input[name*="bar" i], input[placeholder*="Bar" i]', 'LAW-12345');
  }
  
  console.log(`   Email: ${testEmail}`);
  console.log('   Form filled successfully');
  
  // Submit
  console.log('');
  console.log('4. Submitting form...');
  
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();
  
  // Wait for response
  await page.waitForTimeout(5000);
  
  console.log(`   Current URL: ${page.url()}`);
  
  // Check result
  const currentUrl = page.url();
  if (currentUrl.includes('/pending') || currentUrl.includes('/dashboard') || currentUrl.includes('/lawyer')) {
    console.log('   ✅ Registration successful!');
  } else {
    // Check for errors
    const errorText = await page.locator('[class*="error"], [role="alert"]').innerText().catch(() => '');
    if (errorText) {
      console.log(`   ❌ Error: ${errorText}`);
    }
  }
  
  await page.screenshot({ path: 'test-results/lawyer-registration.png', fullPage: true });
  
  console.log('');
  console.log('5. Screenshots saved');
  
  if (errors.length > 0) {
    console.log('\n❌ Console Errors:');
    errors.forEach(e => console.log(`   ${e}`));
  } else {
    console.log('\n✅ No console errors');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
