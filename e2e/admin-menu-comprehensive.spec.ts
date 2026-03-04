import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

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
    await page.click('button:has-text("Admin")');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    
    // Verify we're logged in
    expect(page.url()).toContain('/admin');
  });

  test('Test all admin menu items', async ({ page }) => {
    console.log('═══════════════════════════════════════════');
    console.log('  TESTING ALL ADMIN MENU ITEMS');
    console.log('═══════════════════════════════════════════\n');
    
    const results = [];
    
    for (const item of ADMIN_MENU_ITEMS) {
      console.log(`\n📍 Testing: ${item.name}`);
      
      try {
        // Click the menu item
        const menuLink = page.locator(item.selector).first();
        
        if (await menuLink.isVisible().catch(() => false)) {
          await menuLink.click();
          await page.waitForTimeout(2000);
          
          // Check if page loaded
          const currentUrl = page.url();
          const hasError = await page.locator('text=/error|Error|404|Not Found/i').count() > 0;
          const hasContent = await page.locator('h1, h2, h3').count() > 0;
          
          const passed = !hasError && hasContent;
          
          results.push({
            name: item.name,
            url: currentUrl,
            passed,
            error: hasError ? 'Error message found' : null
          });
          
          console.log(`  ${passed ? '✅' : '❌'} ${item.name} - ${currentUrl}`);
          
          if (!passed) {
            await page.screenshot({ 
              path: `test-results/menu-${item.name.toLowerCase().replace(/\s+/g, '-')}-error.png`,
              fullPage: true 
            });
          }
        } else {
          console.log(`  ⚠️ ${item.name} - Menu item not visible`);
          results.push({
            name: item.name,
            url: page.url(),
            passed: false,
            error: 'Menu item not visible'
          });
        }
      } catch (error: any) {
        console.log(`  ❌ ${item.name} - ${error.message}`);
        results.push({
          name: item.name,
          url: page.url(),
          passed: false,
          error: error.message
        });
        
        await page.screenshot({ 
          path: `test-results/menu-${item.name.toLowerCase().replace(/\s+/g, '-')}-exception.png`,
          fullPage: true 
        });
      }
    }
    
    // Final report
    console.log('\n═══════════════════════════════════════════');
    console.log('  FINAL RESULTS');
    console.log('═══════════════════════════════════════════');
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    results.forEach(r => {
      console.log(`  ${r.passed ? '✅' : '❌'} ${r.name}`);
      if (r.error) console.log(`      Error: ${r.error}`);
    });
    
    console.log(`\n  Total: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════');
    
    // Assert all passed
    expect(failed).toBe(0);
  });
});
