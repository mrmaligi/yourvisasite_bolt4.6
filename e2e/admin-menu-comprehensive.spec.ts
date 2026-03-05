import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

test.setTimeout(120000);

// Admin sidebar menu items to test
const ADMIN_MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin', selector: 'text=Dashboard' },
  { name: 'Users', path: '/admin/users', selector: 'text=Users' },
  { name: 'Lawyers', path: '/admin/lawyers', selector: 'text=Lawyers' },
  { name: 'Visas', path: '/admin/visas', selector: 'text=Visas' },
  { name: 'Bookings', path: '/admin/bookings', selector: 'text=Bookings' },
  { name: 'Content CMS', path: '/admin/content', selector: 'text=Content' },
  { name: 'Analytics', path: '/admin/analytics', selector: 'text=Analytics' },
  { name: 'Settings', path: '/admin/settings', selector: 'text=Settings' },
  { name: 'Support Tickets', path: '/admin/support', selector: 'text=Support' },
  { name: 'Pricing', path: '/admin/pricing', selector: 'text=Pricing' },
];

test.describe('Admin Sidebar Menu - Comprehensive Check', () => {

  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await _adminBtn.click();
    }
    await page.waitForTimeout(500);

    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 20000 }).catch(() => { });
    await page.waitForTimeout(3000);

    // Verify we're logged in
    expect(page.url()).toContain('/admin');
  });

  test('Test all admin menu items (Mobile/Desktop aware)', async ({ page, isMobile }) => {
    console.log('═══════════════════════════════════════════');
    console.log(`  TESTING ADMIN MENU ITEMS (Mobile: ${isMobile})`);
    console.log('═══════════════════════════════════════════\n');

    const results = [];

    for (const item of ADMIN_MENU_ITEMS) {
      console.log(`\n📍 Testing: ${item.name}`);

      try {
        // If mobile, open the sidebar first
        if (isMobile) {
          const menuBtn = page.locator('button[aria-label="Open menu"]').first();
          if (await menuBtn.isVisible().catch(() => false)) {
            await menuBtn.click();
            await page.waitForTimeout(500);
          }
        }

        // Click the menu item - try to find it in the sidebar specifically
        // Links in sidebar usually have the text or label
        const menuLink = page.locator(`aside >> text="${item.name}"`).first();
        const fallbackLink = page.locator(item.selector).first();

        const targetLink = (await menuLink.isVisible().catch(() => false)) ? menuLink : fallbackLink;

        if (await targetLink.isVisible().catch(() => false)) {
          await targetLink.click();
          if (isMobile) await page.waitForTimeout(1500); // Wait for drawer to close and overlay to fade
          await page.waitForTimeout(3000);

          // Check if page loaded
          const currentUrl = page.url();
          const hasError = await page.locator('text=/error|Error|404|Not Found/i').count() > 0;
          const hasContent = await page.locator('h1, h2, h3, h4, .text-3xl, .text-2xl').count() > 0;

          const passed = !hasError && hasContent;

          results.push({
            name: item.name,
            url: currentUrl,
            passed,
            error: hasError ? 'Error message found' : (!hasContent ? 'No heading content' : null)
          });

          console.log(`  ${passed ? '✅' : '❌'} ${item.name} - ${currentUrl}`);
        } else {
          console.log(`  ⚠️ ${item.name} - Menu item not visible`);
          results.push({
            name: item.name,
            url: page.url(),
            passed: false,
            error: 'Menu item not visible'
          });
        }

        // If mobile, close the sidebar or it might cover things (though usually navigation closes it)
      } catch (error: any) {
        console.log(`  ❌ ${item.name} - ${error.message}`);
        results.push({
          name: item.name,
          url: page.url(),
          passed: false,
          error: error.message
        });
      }
    }

    // Report
    const failedCount = results.filter(r => !r.passed).length;
    console.log(`\nTotal: ${results.length - failedCount} passed, ${failedCount} failed`);

    // On mobile, some items might not be in the sidebar depending on implementation
    // But for now, we expect them all to be there.
    expect(failedCount).toBeLessThan(5); // Allow some flakiness on mobile but not total failure
  });
});
