import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Quick check of all admin routes (faster timeout)
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

test.describe('Quick Admin Route Check', () => {
  test.setTimeout(120000); // 2 minutes total

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const adminBtn = page.locator('button:has-text("Admin")').first();
    if (await adminBtn.isVisible().catch(() => false)) {
      await adminBtn.click();
    }
    await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
    await page.fill('input[type="password"]', 'Qwerty@2007');
    await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
  });

  for (const route of ADMIN_ROUTES) {
    test(`Check ${route.name}`, async ({ page }) => {
      test.setTimeout(30000); // 30 seconds per route

      try {
        await page.goto(`${BASE_URL}${route.path}`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
        await page.waitForLoadState('domcontentloaded', { timeout: 25000 });

        const url = page.url();
        const has404 = await page.locator('text=/404|Not Found/i').count() > 0;
        const hasError = await page.locator('text=/error|Error|failed/i').first().isVisible().catch(() => false);

        if (has404 || hasError) {
          console.log(`❌ ${route.name} - Error/404 detected`);
          await page.screenshot({
            path: `test-results/quick-check-${route.name.toLowerCase().replace(/\s+/g, '-')}-error.png`,
            fullPage: true
          });
        }

        expect(has404).toBe(false);
        expect(hasError).toBe(false);

      } catch (e) {
        console.log(`❌ ${route.name} - Timeout or error`);
        await page.screenshot({
          path: `test-results/quick-check-${route.name.toLowerCase().replace(/\s+/g, '-')}-timeout.png`,
          fullPage: true
        });
        throw e;
      }
    });
  }
});
