import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

// Essential admin routes only (4 core pages)
const ADMIN_ROUTES = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Lawyers', path: '/admin/lawyers' },
  { name: 'Payments', path: '/admin/payments' },
];

test.describe('Admin Routes - Essential Pages Test', () => {

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
    await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 20000 }).catch(() => { });
    await page.waitForTimeout(3000);
  });

  test('Test all essential admin routes load correctly', async ({ page }) => {
    test.setTimeout(60000); // 1 min for 4 routes
    console.log('═══════════════════════════════════════════════════');
    console.log('  TESTING ESSENTIAL ADMIN ROUTES (4 pages)');
    console.log('═══════════════════════════════════════════════════\n');

    const results = [];

    for (const route of ADMIN_ROUTES) {
      console.log(`\n📍 Testing: ${route.name} (${route.path})`);

      try {
        await page.goto(`${BASE_URL}${route.path}`);
        await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});

        // Wait for page to either have a heading or some visible text
        await Promise.race([
          page.waitForSelector('h1, h2, h3, h4, .text-3xl, .text-2xl', { timeout: 10000 }).catch(() => null),
          page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null)
        ]);

        await page.waitForTimeout(2000); // Small buffer for animations

        const currentUrl = page.url();
        const has404 = await page.locator('text=/404|Not Found|Page not found/i').count() > 0;
        const hasError = await page.locator('text=/error|Error|Something went wrong/i').count() > 0;

        // Better blank check: wait for anything inside #root or main
        const bodyText = await page.locator('body').innerText();
        const isBlank = bodyText.trim().length < 100 && (await page.locator('main').count() === 0 || (await page.locator('main').innerText()).trim().length < 20);

        const hasHeading = await page.locator('h1, h2, h3, h4, .text-3xl, .text-2xl').count() > 0;
        const hasContent = hasHeading || bodyText.length > 500;

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
        }
      } catch (error: any) {
        console.log(`  ❌ ${route.name} - Exception: ${error.message}`);
        results.push({ name: route.name, path: route.path, passed: false, error: error.message });
      }
    }

    const failed = results.filter(r => !r.passed).length;
    console.log(`\n  Total: ${results.length - failed} passed, ${failed} failed`);

    // All essential pages should pass
    expect(failed).toBe(0);
  });
});
