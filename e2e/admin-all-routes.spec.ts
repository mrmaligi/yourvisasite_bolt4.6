import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

// All admin routes based on actual AdminDashboardLayout.tsx
const ADMIN_ROUTES = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Performance', path: '/admin/performance' },
  { name: 'Activity Log', path: '/admin/activity' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Lawyers', path: '/admin/lawyers' },
  { name: 'Visas', path: '/admin/visas' },
  { name: 'Content CMS', path: '/admin/content' },
  { name: 'Pages', path: '/admin/pages' },
  { name: 'Blog', path: '/admin/blog' },
  { name: 'News', path: '/admin/news' },
  { name: 'YouTube Feed', path: '/admin/youtube' },
  { name: 'Premium Content', path: '/admin/premium' },
  { name: 'Tracker', path: '/admin/tracker' },
  { name: 'Analytics Overview', path: '/admin/analytics/overview' },
  { name: 'Support Tickets', path: '/admin/support/tickets' },
  { name: 'Pricing', path: '/admin/pricing' },
  { name: 'Promo Codes', path: '/admin/promos' },
  { name: 'Settings', path: '/admin/settings' },
  { name: 'System Settings', path: '/admin/system/settings' },
];

test.describe('Admin Routes - All Pages Test', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("Admin")');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
  });

  test('Test all admin routes load correctly', async ({ page }) => {
    console.log('═══════════════════════════════════════════════════');
    console.log('  TESTING ALL 19 ADMIN ROUTES');
    console.log('═══════════════════════════════════════════════════\n');
    
    const results = [];
    
    for (const route of ADMIN_ROUTES) {
      console.log(`\n📍 Testing: ${route.name} (${route.path})`);
      
      try {
        // Navigate to the route
        await page.goto(`${BASE_URL}${route.path}`);
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        
        // Check for errors
        const has404 = await page.locator('text=/404|Not Found|Page not found/i').count() > 0;
        const hasError = await page.locator('text=/error|Error|Something went wrong/i').count() > 0;
        const isBlank = await page.locator('body').innerText().then(t => t.trim().length < 50);
        
        // Check if content loaded
        const hasHeading = await page.locator('h1, h2').count() > 0;
        const hasContent = await page.locator('text=' + route.name).count() > 0 || hasHeading;
        
        const passed = !has404 && !hasError && !isBlank && hasContent;
        
        results.push({
          name: route.name,
          path: route.path,
          url: currentUrl,
          passed,
          has404,
          hasError,
          isBlank,
          hasContent
        });
        
        console.log(`  ${passed ? '✅' : '❌'} ${route.name}`);
        
        if (!passed) {
          console.log(`      404: ${has404}, Error: ${hasError}, Blank: ${isBlank}, Content: ${hasContent}`);
          await page.screenshot({ 
            path: `test-results/admin-route-${route.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}-error.png`,
            fullPage: true 
          });
        }
      } catch (error: any) {
        console.log(`  ❌ ${route.name} - Exception: ${error.message}`);
        results.push({
          name: route.name,
          path: route.path,
          url: page.url(),
          passed: false,
          error: error.message
        });
        
        await page.screenshot({ 
          path: `test-results/admin-route-${route.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}-exception.png`,
          fullPage: true 
        });
      }
    }
    
    // Final report
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  FINAL RESULTS');
    console.log('═══════════════════════════════════════════════════');
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    results.forEach(r => {
      console.log(`  ${r.passed ? '✅' : '❌'} ${r.name} (${r.path})`);
      if (!r.passed) {
        if (r.has404) console.log(`      → 404 Not Found`);
        if (r.hasError) console.log(`      → Error displayed`);
        if (r.isBlank) console.log(`      → Blank page`);
        if (!r.hasContent) console.log(`      → No content loaded`);
        if (r.error) console.log(`      → ${r.error}`);
      }
    });
    
    console.log(`\n  Total: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════════════');
    
    // Report broken routes
    if (failed > 0) {
      console.log('\n🔧 BROKEN ROUTES TO FIX:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`   - ${r.name}: ${r.path}`);
      });
    }
    
    // Assert all passed
    expect(failed).toBe(0);
  });
});
