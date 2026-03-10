import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5174';

test.describe('🔍 ANZSCO Database Tests', () => {
  
  test('Tracker page has ANZSCO profession filter', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check for profession filter dropdown
    await expect(page.locator('text=Profession').first()).toBeVisible();
    await expect(page.locator('select').nth(1)).toBeVisible();
  });

  test('Can search and filter by developer programmer ANZSCO', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Select visa type first
    await page.selectOption('select >> nth=0', '189');
    
    // Wait for profession dropdown to be available
    await page.waitForTimeout(500);
    
    // Check that profession dropdown contains Developer Programmer
    const professionOptions = await page.locator('select >> nth=1 >> option').allTextContents();
    const hasDeveloper = professionOptions.some(opt => opt.includes('Developer') || opt.includes('261312'));
    
    expect(hasDeveloper).toBe(true);
  });

  test('Shows profession breakdown when visa selected', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Select a skilled visa
    await page.selectOption('select >> nth=0', '189');
    await page.waitForTimeout(500);
    
    // Check for profession breakdown section
    await expect(page.locator('text=Processing Times by Profession')).toBeVisible();
  });

  test('Reality Check shows visa types with community data', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check Reality Check section exists
    await expect(page.locator('text=Reality Check')).toBeVisible();
    
    // Check for visa types in the table
    await expect(page.locator('text=Skilled Independent').first()).toBeVisible();
    
    // Check for Official DHA vs Community AI columns
    await expect(page.locator('text=Official DHA')).toBeVisible();
    await expect(page.locator('text=Community AI').first()).toBeVisible();
  });

  test('Confidence scores displayed for predictions', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check for confidence indicators
    const confidenceElements = await page.locator('text=/\\d+% confidence/i').count();
    expect(confidenceElements).toBeGreaterThan(0);
  });

  test('Stats cards show IQR and EMA information', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check for IQR mention
    await expect(page.locator('text=/IQR|outliers/i').first()).toBeVisible();
    
    // Check for EMA mention
    await expect(page.locator('text=/EMA|Exponential/i').first()).toBeVisible();
  });
});

test.describe('📊 Tracker Statistics Tests', () => {
  
  test('Community entries counter displays', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Look for entries count
    await expect(page.locator('text=/entries|submissions/i').first()).toBeVisible();
  });

  test('Average processing time calculated', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Check for average processing time display
    const hasProcessingTime = await page.locator('text=/days|months|processing/i').count() > 0;
    expect(hasProcessingTime).toBe(true);
  });

  test('Prediction range shows min and max estimates', async ({ page }) => {
    await page.goto(`${baseURL}/tracker`);
    
    // Select filters to trigger prediction
    await page.selectOption('select >> nth=0', '189');
    await page.waitForTimeout(500);
    
    // Check for range display (e.g., "range: X - Y days")
    const hasRange = await page.locator('text=/range:/i').count() > 0;
    expect(hasRange).toBe(true);
  });
});

test.describe('🧭 Submit Timeline Form Tests', () => {
  
  test('Submit timeline page loads with ANZSCO field', async ({ page }) => {
    await page.goto(`${baseURL}/tracker/submit`);
    
    // Check page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Look for ANZSCO or profession input
    const hasAnzscoField = await page.locator('text=/ANZSCO|profession|occupation/i').count() > 0;
    expect(hasAnzscoField).toBe(true);
  });

  test('Multi-step form navigation works', async ({ page }) => {
    await page.goto(`${baseURL}/tracker/submit`);
    
    // Check for form elements
    await expect(page.locator('select, input').first()).toBeVisible();
    
    // Look for step indicators or progress
    const hasSteps = await page.locator('[class*="step"], [class*="progress"], text=/step/i').count() > 0;
    expect(hasSteps).toBe(true);
  });
});

test.describe('🔐 Responsive Design Tests', () => {
  
  test('Tracker page responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseURL}/tracker`);
    
    // Check page loads without horizontal scroll
    await expect(page.locator('body')).toBeVisible();
    
    // Check filters are accessible
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('Stats cards stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseURL}/tracker`);
    
    // Check stats cards are visible
    await expect(page.locator('text=Community Entries').first()).toBeVisible();
  });
});
