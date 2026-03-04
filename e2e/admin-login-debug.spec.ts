import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Debug Admin Login Flow', async ({ page }) => {
  console.log('🔍 DEBUGGING ADMIN LOGIN\n');
  
  // 1. Navigate to login
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  
  // 2. Take screenshot of initial state
  await page.screenshot({ path: 'test-results/01-login-initial.png' });
  console.log('📸 Screenshot: 01-login-initial.png');
  
  // 3. Check for Admin button
  const adminButton = page.locator('button', { hasText: /Admin/i });
  const adminCount = await adminButton.count();
  console.log(`Found ${adminCount} Admin buttons`);
  
  if (adminCount > 0) {
    await adminButton.first().click();
    console.log('✅ Clicked Admin button');
    await page.waitForTimeout(1000);
  }
  
  // 4. Check form fields
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  
  console.log(`Email field visible: ${await emailInput.isVisible().catch(() => false)}`);
  console.log(`Password field visible: ${await passwordInput.isVisible().catch(() => false)}`);
  
  // 5. Fill credentials
  await emailInput.fill('mrmaligi@outlook.com');
  await passwordInput.fill('Qwerty@2007');
  console.log('✅ Credentials filled');
  
  // 6. Take screenshot before submit
  await page.screenshot({ path: 'test-results/02-login-filled.png' });
  
  // 7. Find and click Sign In
  const signInButton = page.locator('button', { hasText: /Sign In/i });
  console.log(`Sign In buttons found: ${await signInButton.count()}`);
  
  // Click the first visible Sign In button
  for (const btn of await signInButton.all()) {
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      console.log('✅ Clicked Sign In');
      break;
    }
  }
  
  // 8. Wait for response
  await page.waitForTimeout(4000);
  
  // 9. Check current state
  const currentUrl = page.url();
  console.log(`\n📍 Current URL: ${currentUrl}`);
  
  // 10. Check for error messages
  const errorMessages = await page.locator('text=/error|Error|invalid|Invalid/i').allInnerTexts();
  if (errorMessages.length > 0) {
    console.log('\n❌ Error messages found:');
    errorMessages.forEach(msg => console.log(`   - ${msg}`));
  }
  
  // 11. Check page content
  const pageText = await page.locator('body').innerText();
  
  if (pageText.includes('Dashboard') || pageText.includes('Admin') || currentUrl.includes('/admin')) {
    console.log('\n✅ Successfully logged in!');
  } else {
    console.log('\n⚠️ Still on login page or error state');
    console.log('\n📄 Page content snippet:');
    console.log(pageText.substring(0, 500));
  }
  
  // 12. Final screenshot
  await page.screenshot({ path: 'test-results/03-login-result.png', fullPage: true });
  console.log('\n📸 Final screenshot: 03-login-result.png');
});
