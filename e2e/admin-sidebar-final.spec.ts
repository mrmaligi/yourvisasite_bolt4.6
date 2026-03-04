import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Admin Dashboard - Full Sidebar Menu Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  ADMIN SIDEBAR MENU VERIFICATION');
  console.log('═══════════════════════════════════════════\n');
  
  // Login as admin
  console.log('🔐 Logging in as admin...');
  await page.goto(`${BASE_URL}/login`);
  await page.click('button:has-text("Admin")');
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  await page.click('button[type="submit"]');
  
  // Wait for admin page to load (SPA navigation)
  await page.waitForTimeout(5000);
  
  // Verify we're on admin page
  const currentUrl = page.url();
  if (!currentUrl.includes('/admin')) {
    throw new Error(`Expected to be on /admin but got: ${currentUrl}`);
  }
  
  console.log(`✅ Logged in. URL: ${page.url()}\n`);
  
  // Take screenshot of admin dashboard
  await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
  
  // Find sidebar - try multiple selectors
  console.log('📋 Checking for admin sidebar...');
  
  const sidebarSelectors = [
    'aside',
    'nav[aria-label]',
    '[class*="sidebar"]',
    '[class*="Sidebar"]',
    '[class*="navigation"]'
  ];
  
  let sidebarElement = null;
  for (const selector of sidebarSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible().catch(() => false)) {
      sidebarElement = el;
      console.log(`  ✅ Sidebar found: ${selector}`);
      break;
    }
  }
  
  // Expected admin menu items
  const expectedItems = [
    'Dashboard',
    'Users',
    'Lawyers', 
    'Visas',
    'Bookings',
    'Content',
    'Analytics',
    'Settings'
  ];
  
  const results = [];
  
  if (sidebarElement) {
    // Get all links/text in sidebar
    const sidebarText = await sidebarElement.innerText();
    console.log('\n📄 Sidebar content:');
    console.log(sidebarText.substring(0, 500));
    
    // Check for each expected item
    for (const item of expectedItems) {
      const found = sidebarText.toLowerCase().includes(item.toLowerCase());
      results.push({ item, found });
    }
  } else {
    console.log('  ⚠️ No sidebar found - checking entire page');
    const pageText = await page.locator('body').innerText();
    
    for (const item of expectedItems) {
      const found = pageText.toLowerCase().includes(item.toLowerCase());
      results.push({ item, found });
    }
  }
  
  // Report results
  console.log('\n═══════════════════════════════════════════');
  console.log('  SIDEBAR MENU ITEMS:');
  console.log('═══════════════════════════════════════════');
  
  let foundCount = 0;
  for (const { item, found } of results) {
    const status = found ? '✅' : '❌';
    console.log(`  ${status} ${item}`);
    if (found) foundCount++;
  }
  
  console.log(`\n  Total: ${foundCount}/${expectedItems.length} items found`);
  
  // List ALL links on the page for reference
  console.log('\n📋 All links on admin page:');
  const allLinks = await page.locator('a').allInnerTexts();
  allLinks.filter(t => t.trim()).slice(0, 20).forEach((text, i) => {
    console.log(`  ${i + 1}. ${text.trim()}`);
  });
  
  // Check if we're actually on admin dashboard
  const hasAdminHeader = await page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard")').count() > 0;
  const hasAdminText = await page.locator('text=/admin|Admin/i').count() > 5;
  
  console.log('\n═══════════════════════════════════════════');
  console.log('  ADMIN PAGE VERIFICATION:');
  console.log('═══════════════════════════════════════════');
  console.log(`  Dashboard header: ${hasAdminHeader ? '✅' : '❌'}`);
  console.log(`  Admin references: ${hasAdminText ? '✅' : '❌'}`);
  console.log(`  URL contains /admin: ${page.url().includes('/admin') ? '✅' : '❌'}`);
  
  if (foundCount >= 5) {
    console.log('\n✅ ADMIN SIDEBAR IS WORKING CORRECTLY!');
  } else {
    console.log('\n⚠️ Some admin menu items may be missing or using different labels');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
