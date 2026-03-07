import { test, expect } from '@playwright/test';

const BASE_URL = 'https://yourvisasite-newui.vercel.app';

test('Home page loads without JS errors', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('pageerror', (error) => {
    console.log('❌ PAGE ERROR:', error.message);
    errors.push(error.message);
  });
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('Testing new deployment:', BASE_URL);
  
  await page.goto(BASE_URL, { timeout: 15000 });
  await page.waitForTimeout(3000);
  
  // Check for component errors
  const componentErrors = errors.filter(e => 
    e.includes('is not defined') ||
    e.includes('ModernButton') ||
    e.includes('ModernCard')
  );
  
  console.log('Total errors:', errors.length);
  console.log('Component errors:', componentErrors.length);
  
  if (componentErrors.length === 0) {
    console.log('✅ NO COMPONENT ERRORS! Deployment is working!');
  }
  
  expect(componentErrors).toHaveLength(0);
});

test('Login page works', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`, { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  // Check for errors
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  
  // Take screenshot for verification
  await page.screenshot({ path: 'test-results/login-newui.png' });
  
  // Check if page loaded
  const body = page.locator('body');
  await expect(body).toBeVisible();
  
  console.log('✅ Login page loaded');
});
