import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';
const VISA_ID = '9287e029-9cf6-4f3f-befd-c1fb68b7f39b';

test('Visa Detail Page - Partner Visa 820', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas/${VISA_ID}`);
  await page.waitForTimeout(3000);
  
  console.log('URL:', page.url());
  
  // Check page loaded
  const hasTitle = await page.locator('h1').count() > 0;
  console.log('Has H1 title:', hasTitle);
  
  // Check for visa info
  const hasVisaInfo = await page.locator('text=/820|Partner|visa/i').count() > 0;
  console.log('Has visa info:', hasVisaInfo);
  
  // Check for premium content section
  const hasPremiumSection = await page.locator('text=/Premium|premium|guide/i').count() > 0;
  console.log('Has premium section:', hasPremiumSection);
  
  // Check for lawyer section
  const hasLawyers = await page.locator('text=/lawyer|Lawyer|expert/i').count() > 0;
  console.log('Has lawyers section:', hasLawyers);
  
  // Check for eligibility
  const hasEligibility = await page.locator('text=/eligibility|requirements/i').count() > 0;
  console.log('Has eligibility:', hasEligibility);
  
  // Check for booking
  const hasBooking = await page.locator('button:has-text("Book"), text=/book|consultation/i').count() > 0;
  console.log('Has booking option:', hasBooking);
  
  await page.screenshot({ path: 'test-results/visa-detail-partner-820.png', fullPage: true });
  
  expect(hasTitle).toBe(true);
  expect(hasVisaInfo).toBe(true);
});
