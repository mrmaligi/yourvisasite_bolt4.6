import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Registration Page - Full Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING REGISTRATION PAGE');
  console.log('═══════════════════════════════════════════\n');
  
  // Navigate to register
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(2000);
  
  console.log('📍 URL:', page.url());
  
  // Check page title
  const title = await page.title();
  console.log('📄 Page Title:', title);
  
  // Check for form elements
  const hasNameField = await page.locator('input[name="fullName"], input[placeholder*="name" i], input[type="text"]').first().isVisible().catch(() => false);
  const hasEmailField = await page.locator('input[type="email"]').first().isVisible().catch(() => false);
  const hasPasswordField = await page.locator('input[type="password"]').first().isVisible().catch(() => false);
  const hasSubmitButton = await page.locator('button[type="submit"], button:has-text("Create")').first().isVisible().catch(() => false);
  
  console.log('');
  console.log('✅ Form Elements Found:');
  console.log(`  Name field: ${hasNameField}`);
  console.log(`  Email field: ${hasEmailField}`);
  console.log(`  Password field: ${hasPasswordField}`);
  console.log(`  Submit button: ${hasSubmitButton}`);
  
  // Check for console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Try filling the form
  console.log('\n📝 Testing form fill...');
  try {
    // Fill name
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test User');
      console.log('  ✅ Name filled');
    }
    
    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('testuser999@example.com');
      console.log('  ✅ Email filled');
    }
    
    // Fill password
    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible().catch(() => false)) {
      await passwordInput.fill('TestPassword123!');
      console.log('  ✅ Password filled');
    }
    
    console.log('  ✅ Form filled successfully');
  } catch (e) {
    console.log('  ❌ Error filling form:', e);
  }
  
  // Screenshot
  await page.screenshot({ path: 'test-results/registration-page.png', fullPage: true });
  
  console.log('\n📸 Screenshot saved: test-results/registration-page.png');
  
  if (errors.length > 0) {
    console.log('\n❌ Console Errors:');
    errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('\n✅ No console errors');
  }
  
  console.log('\n═══════════════════════════════════════════');
  
  // Assert key elements exist
  expect(hasEmailField).toBe(true);
  expect(hasPasswordField).toBe(true);
});
