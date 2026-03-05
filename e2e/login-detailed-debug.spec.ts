import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Debug Login Flow - Detailed', async ({ page }) => {
  console.log('🔍 DETAILED LOGIN DEBUG\n');
  
  // Enable console logging
  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  // 1. Navigate to login
  await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  console.log('1. Navigated to login');
  
  // 2. Click Admin
  const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 10000 }).catch(() => false)) { 
        await _adminBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
    }
  console.log('2. Clicked Admin button');
  await page.waitForTimeout(500);
  
  // 3. Fill form
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  console.log('3. Filled credentials');
  
  // 4. Check form values
  const emailValue = await page.inputValue('input[type="email"]');
  const passwordValue = await page.inputValue('input[type="password"]');
  console.log(`   Email: ${emailValue}`);
  console.log(`   Password: ${passwordValue ? '***filled***' : 'EMPTY'}`);
  
  // 5. Check if submit button is enabled
  const submitBtn = page.locator('button[type="submit"]');
  const isEnabled = await submitBtn.isEnabled();
  console.log(`   Submit button enabled: ${isEnabled}`);
  
  // 6. Click submit and monitor
  console.log('\n4. Clicking Sign In...');
  
  // Listen for navigation
  const navigationPromise = page.waitForNavigation({ timeout: 10000 }).catch(e => {
    console.log('   Navigation timeout or error:', e.message);
    return null;
  });
  
  await submitBtn.click();
  console.log('   Clicked!');
  
  // Wait for navigation
  const navigation = await navigationPromise;
  if (navigation) {
    console.log(`   ✅ Navigation occurred`);
  } else {
    console.log(`   ⚠️ No navigation detected`);
  }
  
  // 7. Wait and check state
  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  console.log(`\n5. Current URL: ${currentUrl}`);
  
  // 8. Check page content
  const bodyText = await page.locator('body').innerText();
  
  if (bodyText.includes('Dashboard') || bodyText.includes('Admin')) {
    console.log('   ✅ Admin content detected');
  } else if (bodyText.includes('Sign In') || bodyText.includes('login')) {
    console.log('   ❌ Still on login page');
    
    // Check for error messages
    const errorText = await page.locator('.text-red-600, .text-red-500, [role="alert"]').innerText().catch(() => '');
    if (errorText) {
      console.log(`   Error message: ${errorText}`);
    }
  }
  
  // 9. Check localStorage/sessionStorage for auth tokens
  const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
  const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
  
  console.log('\n6. Storage check:');
  console.log(`   localStorage has keys: ${Object.keys(JSON.parse(localStorage)).join(', ') || 'none'}`);
  console.log(`   sessionStorage has keys: ${Object.keys(JSON.parse(sessionStorage)).join(', ') || 'none'}`);
  
  // 10. Screenshot
  await page.screenshot({ path: 'test-results/login-debug-detailed.png', fullPage: true });
  console.log('\n✅ Debug complete - screenshot saved');
});
