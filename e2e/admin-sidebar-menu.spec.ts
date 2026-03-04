import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

// Store console logs
const consoleLogs: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleLogs.length = 0;
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      console.log(`❌ ${text}`);
    }
  });
});

test('Admin Dashboard - Sidebar Menu Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════════');
  console.log('  ADMIN SIDEBAR MENU TEST');
  console.log('═══════════════════════════════════════════════\n');
  
  // STEP 1: Navigate and login
  console.log('STEP 1: Navigate to login page');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('domcontentloaded');
  await page.screenshot({ path: 'test-results/admin-01-login.png' });
  
  // Click Admin option
  const adminBtn = page.locator('button', { hasText: 'Admin' });
  if (await adminBtn.isVisible().catch(() => false)) {
    await adminBtn.click();
    console.log('  ✅ Selected Admin login type');
  }
  
  // Fill login form
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  console.log('  ✅ Credentials entered');
  
  // Submit and wait
  await page.click('button:has-text("Sign In")');
  await page.waitForTimeout(5000); // Wait for auth + redirect
  
  const url = page.url();
  console.log(`  📍 URL after login: ${url}`);
  
  // STEP 2: Check if we're on admin page
  console.log('\nSTEP 2: Verify admin page loaded');
  
  if (url.includes('/admin')) {
    console.log('  ✅ On admin page');
  } else {
    console.log('  ⚠️ Not on /admin URL, checking content...');
    
    // Check for admin-specific elements
    const hasAdminText = await page.locator('text=/admin|dashboard/i').count() > 0;
    const hasSidebar = await page.locator('nav, aside, [class*="sidebar"], [class*="SideBar"]').count() > 0;
    
    console.log(`  - Admin text found: ${hasAdminText}`);
    console.log(`  - Sidebar found: ${hasSidebar}`);
  }
  
  await page.screenshot({ path: 'test-results/admin-02-after-login.png', fullPage: true });
  
  // STEP 3: Find and test sidebar menu
  console.log('\nSTEP 3: Testing sidebar menu items');
  
  // Try to find sidebar
  const sidebarSelectors = [
    'nav',
    'aside',
    '[class*="sidebar"]',
    '[class*="SideBar"]',
    '[role="navigation"]',
    '[aria-label*="navigation" i]'
  ];
  
  let sidebarFound = false;
  let sidebarSelector = '';
  
  for (const selector of sidebarSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      sidebarFound = true;
      sidebarSelector = selector;
      console.log(`  ✅ Sidebar found: ${selector}`);
      break;
    }
  }
  
  // Menu items to check
  const menuItems = [
    { name: 'Dashboard', patterns: ['Dashboard', 'dashboard', 'Home'] },
    { name: 'Users', patterns: ['Users', 'users', 'User Management'] },
    { name: 'Lawyers', patterns: ['Lawyers', 'lawyers', 'Lawyer'] },
    { name: 'Visas', patterns: ['Visas', 'visas', 'Visa'] },
    { name: 'Bookings', patterns: ['Bookings', 'bookings', 'Booking'] },
    { name: 'Content', patterns: ['Content', 'content', 'CMS'] },
    { name: 'Analytics', patterns: ['Analytics', 'analytics', 'Stats'] },
    { name: 'Settings', patterns: ['Settings', 'settings', 'Config'] }
  ];
  
  const results = [];
  
  if (sidebarFound) {
    // Get all links in sidebar
    const links = await page.locator(`${sidebarSelector} a`).allInnerTexts();
    console.log(`  📋 Found ${links.length} menu items in sidebar:`);
    links.filter(l => l.trim()).forEach((link, i) => {
      console.log(`    ${i + 1}. ${link.trim()}`);
    });
    
    // Check for expected items
    for (const item of menuItems) {
      const found = links.some(link => 
        item.patterns.some(pattern => link.toLowerCase().includes(pattern.toLowerCase()))
      );
      results.push({ name: item.name, found });
    }
  } else {
    console.log('  ❌ No sidebar found with standard selectors');
    
    // Check entire page for menu items
    const pageText = await page.locator('body').innerText();
    
    for (const item of menuItems) {
      const found = item.patterns.some(pattern => 
        pageText.toLowerCase().includes(pattern.toLowerCase())
      );
      results.push({ name: item.name, found });
    }
  }
  
  // STEP 4: Results
  console.log('\n═══════════════════════════════════════════════');
  console.log('  SIDEBAR MENU ITEMS FOUND:');
  console.log('═══════════════════════════════════════════════');
  
  results.forEach(item => {
    console.log(`  ${item.found ? '✅' : '❌'} ${item.name}`);
  });
  
  const foundCount = results.filter(r => r.found).length;
  console.log(`\n  Total: ${foundCount}/${results.length} items found`);
  
  // STEP 5: Check for mobile menu
  console.log('\nSTEP 5: Check mobile responsive menu');
  
  // Resize to mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  
  const hamburger = page.locator('button[aria-label*="menu" i], button:has-text("☰"), [class*="hamburger"]').first();
  if (await hamburger.isVisible().catch(() => false)) {
    console.log('  ✅ Hamburger menu visible on mobile');
    await hamburger.click();
    await page.waitForTimeout(1000);
    
    const mobileLinks = await page.locator('nav a, [role="menu"] a, [class*="drawer"] a').allInnerTexts();
    console.log(`  📱 Mobile menu has ${mobileLinks.length} items`);
    
    await page.screenshot({ path: 'test-results/admin-03-mobile-menu.png' });
  } else {
    console.log('  ℹ️ No hamburger menu (mobile view may show sidebar differently)');
  }
  
  // STEP 6: Final report
  console.log('\n═══════════════════════════════════════════════');
  console.log('  CONSOLE ERRORS:');
  console.log('═══════════════════════════════════════════════');
  const errors = consoleLogs.filter(log => log.includes('[error]'));
  if (errors.length > 0) {
    errors.forEach(err => console.log(`  ${err}`));
  } else {
    console.log('  ✅ No errors detected');
  }
  
  await page.screenshot({ path: 'test-results/admin-04-final.png', fullPage: true });
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('  TEST COMPLETE');
  console.log('═══════════════════════════════════════════════');
});
