import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5174';

test.describe('🔬 Tracker Algorithm Tests', () => {
  
  test('Tracker Dashboard loads with algorithm stats', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check main elements
    await expect(page.locator('text=AusVisa Community Tracker')).toBeVisible();
    await expect(page.locator('text=IQR')).toBeVisible();
    await expect(page.locator('text=EMA')).toBeVisible();
    
    // Check stats cards
    await expect(page.locator('text=Community Entries')).toBeVisible();
    await expect(page.locator('text=Valid Data Points')).toBeVisible();
    await expect(page.locator('text=Avg Processing')).toBeVisible();
    await expect(page.locator('text=Prediction Confidence')).toBeVisible();
  });

  test('Filters work - Visa Type', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Select visa type
    await page.selectOption('select >> nth=0', '189');
    
    // Check prediction updates
    await expect(page.locator('text=AI Prediction')).toBeVisible();
  });

  test('Filters work - ANZSCO', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Select profession
    await page.selectOption('select >> nth=1', '261312');
    
    // Check profession breakdown appears
    await expect(page.locator('text=Developer Programmer')).toBeVisible();
  });

  test('Reality Check table shows DHA vs Community', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check Reality Check section
    await expect(page.locator('text=Reality Check')).toBeVisible();
    await expect(page.locator('text=Official DHA')).toBeVisible();
    await expect(page.locator('text=Community AI')).toBeVisible();
  });

  test('Submit Timeline page loads', async ({ page }) => {
    await page.goto(`${baseURL}/tracker/submit`);
    
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('text=Submit')).toBeVisible();
  });
});
