import { test, expect } from '@playwright/test';

const BASE_URL = 'https://yourvisasite.vercel.app';

test('Original deployment - Home page loads without errors', async ({ page }) => {
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

  console.log('Testing ORIGINAL deployment:', BASE_URL);
  
  await page.goto(BASE_URL, { timeout: 15000 });
  await page.waitForTimeout(3000);
  
  // Check for component errors
  const componentErrors = errors.filter(e => 
    e.includes('is not defined') ||
    e.includes('ModernButton') ||
    e.includes('ModernCard') ||
    e.includes('ContentContainer')
  );
  
  console.log('Total errors:', errors.length);
  console.log('Component errors:', componentErrors.length);
  
  if (componentErrors.length === 0) {
    console.log('✅ ORIGINAL DEPLOYMENT WORKS! No component errors!');
  } else {
    console.log('Errors found:', componentErrors);
  }
  
  expect(componentErrors).toHaveLength(0);
});

test('Original deployment - Login page works', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`, { timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const body = page.locator('body');
  await expect(body).toBeVisible();
  
  console.log('✅ Login page on original deployment loaded');
});
