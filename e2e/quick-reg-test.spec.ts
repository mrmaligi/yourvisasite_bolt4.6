import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Check new registration UI', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(4000);
  
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  // Check for role buttons
  const buttons = await page.locator('button').allInnerTexts();
  console.log('Buttons found:', buttons.filter(b => b.length > 0).join(', '));
  
  // Check for role selector
  const hasApplicant = await page.locator('text=/Applicant/i').isVisible().catch(() => false);
  const hasLawyer = await page.locator('text=/Lawyer/i').isVisible().catch(() => false);
  
  console.log('Has Applicant option:', hasApplicant);
  console.log('Has Lawyer option:', hasLawyer);
  
  await page.screenshot({ path: 'test-results/new-reg-ui.png', fullPage: true });
  console.log('Screenshot saved');
});
