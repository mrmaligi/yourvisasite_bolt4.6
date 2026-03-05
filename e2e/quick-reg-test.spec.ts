import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Check new registration UI', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
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
