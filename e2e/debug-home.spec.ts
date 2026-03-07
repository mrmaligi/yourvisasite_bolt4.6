import { test, expect } from '@playwright/test';

test('capture console errors from home page', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('pageerror', (error) => {
    console.log('PAGE ERROR:', error.message);
    errors.push(error.message);
  });
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  // Test against production
  await page.goto('https://yourvisasite.vercel.app/', { timeout: 15000 });
  await page.waitForTimeout(3000);
  
  console.log('Total errors found:', errors.length);
  console.log('Errors:', errors);
  
  // Check for specific errors
  const componentErrors = errors.filter(e => 
    e.includes('is not defined') || 
    e.includes('ContentContainer') ||
    e.includes('PageHeader')
  );
  
  if (componentErrors.length > 0) {
    console.log('COMPONENT ERRORS:', componentErrors);
  }
  
  expect(componentErrors).toHaveLength(0);
});
