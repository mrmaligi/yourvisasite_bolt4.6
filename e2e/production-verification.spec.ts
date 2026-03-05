import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Verify Production Deployment', async ({ page }) => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTING PRODUCTION DEPLOYMENT');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Test homepage
  console.log('1. Testing Homepage...');
  await page.goto(BASE_URL);
  await page.waitForTimeout(3000);
  
  const homeTitle = await page.title();
  console.log(`   Title: ${homeTitle}`);
  
  const homeLoaded = await page.locator('text=/VisaBuild|visa|immigration/i').count() > 0;
  console.log(`   Content loaded: ${homeLoaded}`);
  
  // Test visa detail page
  console.log('\n2. Testing Visa Detail Page...');
  await page.goto(`${BASE_URL}/visas/1fc2675f-ce81-47b2-b48c-8caed01bc526`);
  await page.waitForTimeout(4000);
  
  const visaTitle = await page.title();
  console.log(`   Title: ${visaTitle}`);
  
  // Check for visa data
  const hasVisaName = await page.locator('h1, h2').isVisible().catch(() => false);
  const hasProcessingTime = await page.locator('text=/processing|Processing|time|Time/i').count() > 0;
  const hasCost = await page.locator('text=/cost|Cost|$|AUD/i').count() > 0;
  const hasRequirements = await page.locator('text=/requirements|Requirements/i').count() > 0;
  
  console.log(`   Visa name visible: ${hasVisaName}`);
  console.log(`   Processing time shown: ${hasProcessingTime}`);
  console.log(`   Cost shown: ${hasCost}`);
  console.log(`   Requirements shown: ${hasRequirements}`);
  
  // Get page text for verification
  const pageText = await page.locator('body').innerText();
  console.log(`\n   Page contains visa info: ${pageText.includes('visa') || pageText.includes('Visa')}`);
  
  // Screenshot
  await page.screenshot({ path: 'test-results/production-visa-page.png', fullPage: true });
  
  // Test login page
  console.log('\n3. Testing Login Page...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(3000);
  
  const loginLoaded = await page.locator('text=/login|Login|sign in|Sign In/i').count() > 0;
  console.log(`   Login page loaded: ${loginLoaded}`);
  
  await page.screenshot({ path: 'test-results/production-login.png', fullPage: true });
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  DEPLOYMENT VERIFICATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
});
