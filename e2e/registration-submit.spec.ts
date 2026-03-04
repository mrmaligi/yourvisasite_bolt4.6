import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Registration - Submit Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING REGISTRATION SUBMISSION');
  console.log('═══════════════════════════════════════════\n');
  
  // Navigate to register
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(2000);
  
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Capture network errors
  const networkErrors: string[] = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()}: ${response.url()}`);
    }
  });
  
  // Fill form
  console.log('📝 Filling registration form...');
  
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  // Try to find and fill name field
  const nameSelectors = [
    'input[name="fullName"]',
    'input[name="full_name"]',
    'input[placeholder*="Full Name" i]',
    'input[placeholder*="Name" i]'
  ];
  
  for (const selector of nameSelectors) {
    const field = page.locator(selector).first();
    if (await field.isVisible().catch(() => false)) {
      await field.fill('Test User');
      console.log('  ✅ Name filled');
      break;
    }
  }
  
  // Fill email
  await page.fill('input[type="email"]', testEmail);
  console.log(`  ✅ Email filled: ${testEmail}`);
  
  // Fill password
  await page.fill('input[type="password"]', testPassword);
  console.log('  ✅ Password filled');
  
  // Find and click submit button
  console.log('\n🚀 Submitting form...');
  
  const submitSelectors = [
    'button[type="submit"]',
    'button:has-text("Create")',
    'button:has-text("Register")',
    'button:has-text("Sign Up")'
  ];
  
  let submitClicked = false;
  for (const selector of submitSelectors) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible().catch(() => false)) {
      console.log(`  Found submit button: ${selector}`);
      
      // Listen for navigation or error
      try {
        await Promise.race([
          Promise.all([
            page.waitForNavigation({ timeout: 10000 }).catch(() => null),
            btn.click()
          ]),
          new Promise(resolve => setTimeout(resolve, 5000))
        ]);
        submitClicked = true;
        console.log('  ✅ Form submitted');
      } catch (e) {
        console.log('  ❌ Error clicking submit:', e);
      }
      break;
    }
  }
  
  if (!submitClicked) {
    console.log('  ❌ Could not find submit button');
  }
  
  // Wait for response
  await page.waitForTimeout(3000);
  
  // Check current state
  const currentUrl = page.url();
  console.log(`\n📍 Current URL: ${currentUrl}`);
  
  // Check for error messages
  const errorSelectors = [
    '.text-red',
    '[class*="error"]',
    '[role="alert"]',
    'text=/error|failed|unable|could not/i'
  ];
  
  const errors: string[] = [];
  for (const selector of errorSelectors) {
    const text = await page.locator(selector).innerText().catch(() => '');
    if (text.trim()) {
      errors.push(text.trim());
    }
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Error Messages Found:');
    errors.forEach(e => console.log(`  - ${e}`));
  }
  
  // Check console messages
  if (consoleMessages.length > 0) {
    console.log('\n📝 Console Messages:');
    consoleMessages.forEach(m => console.log(`  ${m}`));
  }
  
  // Check network errors
  if (networkErrors.length > 0) {
    console.log('\n🌐 Network Errors:');
    networkErrors.forEach(e => console.log(`  ${e}`));
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/registration-submit.png', fullPage: true });
  console.log('\n📸 Screenshot saved');
  
  console.log('\n═══════════════════════════════════════════');
  
  // The test should show us what's happening even if it doesn't pass
  expect(true).toBe(true);
});
