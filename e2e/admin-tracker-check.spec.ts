import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Admin Tracker Page', async ({ page }) => {
  // Login
  await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 10000 }).catch(() => false)) { 
        await _adminBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
    }
  await page.fill('input[type="email"]', 'mrmaligi@outlook.com');
  await page.fill('input[type="password"]', 'Qwerty@2007');
  await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
  
  // Go to tracker
  await page.goto(`${BASE_URL}/admin/tracker`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('URL:', page.url());
  
  // Check page loaded
  const hasTitle = await page.locator('text=/Tracker|tracker/i').count() > 0;
  console.log('Has tracker title:', hasTitle);
  
  // Check for data table or entries
  const hasTable = await page.locator('table, [class*="data"], [class*="table"]').count() > 0;
  const hasEntries = await page.locator('text=/approved|pending|submitted/i').count() > 0;
  console.log('Has table:', hasTable);
  console.log('Has entries:', hasEntries);
  
  // Check for tabs
  const hasTabs = await page.locator('button:has-text("All"), button:has-text("Pending"), [role="tab"]').count() > 0;
  console.log('Has tabs:', hasTabs);
  
  await page.screenshot({ path: 'test-results/tracker-check.png', fullPage: true });
  
  expect(hasTitle).toBe(true);
});
