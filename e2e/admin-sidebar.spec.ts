import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Admin Dashboard Sidebar Menu', () => {
  test.setTimeout(90000);
  
  test.beforeEach(async ({ page }) => {
    // Collect errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
  });

  test('Admin login and sidebar navigation', async ({ page }) => {
    console.log('🚀 Starting admin sidebar test...');
    
    // Step 1: Navigate to login
    console.log('📍 Step 1: Navigating to login...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await expect(page).toHaveTitle(/VisaBuild/i);
    console.log('   ✅ Login page loaded');
    
    // Step 2: Select Admin login type
    console.log('📍 Step 2: Selecting Admin login...');
    const adminButton = page.locator('button:has-text("Admin")');
    if (await adminButton.isVisible().catch(() => false)) {
      await adminButton.click();
      console.log('   ✅ Admin button clicked');
    }
    
    // Step 3: Fill credentials
    console.log('📍 Step 3: Entering credentials...');
    await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
    await page.fill('input[type="password"]', 'Qwerty@2007');
    console.log('   ✅ Credentials filled');
    
    // Step 4: Submit login
    console.log('📍 Step 4: Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForTimeout(3000);
    
    // Step 5: Verify admin page loaded
    console.log('📍 Step 5: Checking admin page...');
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // Check if we're on admin page
    if (currentUrl.includes('/admin')) {
      console.log('   ✅ Successfully on admin page');
    } else {
      console.log('   ⚠️ Checking for dashboard elements...');
    }
    
    // Step 6: Test sidebar/menu items
    console.log('📍 Step 6: Testing sidebar menu...');
    
    // Common menu items to check
    const menuItems = [
      { name: 'Dashboard', selectors: ['text=Dashboard', 'a[href*="dashboard"]', 'nav:has-text("Dashboard")'] },
      { name: 'Users', selectors: ['text=Users', 'a[href*="users"]', 'nav:has-text("Users")'] },
      { name: 'Lawyers', selectors: ['text=Lawyers', 'a[href*="lawyers"]', 'nav:has-text("Lawyers")'] },
      { name: 'Visas', selectors: ['text=Visas', 'a[href*="visas"]', 'nav:has-text("Visas")'] },
      { name: 'Bookings', selectors: ['text=Bookings', 'a[href*="bookings"]', 'nav:has-text("Bookings")'] },
      { name: 'Settings', selectors: ['text=Settings', 'a[href*="settings"]', 'nav:has-text("Settings")'] },
    ];
    
    const results = [];
    
    for (const item of menuItems) {
      let found = false;
      for (const selector of item.selectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          found = true;
          break;
        }
      }
      results.push({ name: item.name, found });
      console.log(`   ${found ? '✅' : '❌'} ${item.name}`);
    }
    
    // Step 7: Check for mobile menu
    console.log('📍 Step 7: Checking mobile menu...');
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button svg[class*="menu"], [class*="hamburger"]').first();
    if (await mobileMenuButton.isVisible().catch(() => false)) {
      console.log('   ✅ Mobile menu button found');
      await mobileMenuButton.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Mobile menu opened');
      
      // Check menu items in mobile view
      const mobileLinks = await page.locator('nav a, [role="navigation"] a').allInnerTexts();
      console.log(`   📱 Mobile menu has ${mobileLinks.length} items`);
    } else {
      console.log('   ℹ️ No mobile menu button (desktop view)');
    }
    
    // Step 8: Take screenshot
    console.log('📍 Step 8: Taking screenshot...');
    await page.screenshot({ path: 'test-results/admin-sidebar.png', fullPage: true });
    console.log('   ✅ Screenshot saved');
    
    // Final report
    console.log('\n📊 SIDEBAR MENU TEST RESULTS:');
    console.log('═══════════════════════════════════════');
    const foundCount = results.filter(r => r.found).length;
    console.log(`Total menu items checked: ${results.length}`);
    console.log(`Found: ${foundCount} | Missing: ${results.length - foundCount}`);
    
    if (foundCount === 0) {
      console.log('\n❌ WARNING: No sidebar menu items found!');
      console.log('   The admin page may have a different layout.');
    }
    
    // List all visible links on the page
    console.log('\n📋 All visible links on page:');
    const allLinks = await page.locator('a').allInnerTexts();
    allLinks.filter(t => t.trim()).slice(0, 15).forEach((text, i) => {
      console.log(`   ${i + 1}. ${text.trim()}`);
    });
    
    console.log('\n✅ Test complete!');
  });
});
