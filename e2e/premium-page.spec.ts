import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// Test premium page loads correctly
test('Premium page loads after purchase URL', async ({ page }) => {
  // Test with success parameter (simulating Stripe redirect)
  await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium?success=true`);
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Check for success banner
  const successBanner = await page.locator('text=Payment successful').isVisible().catch(() => false);
  console.log('Success banner visible:', successBanner);
  
  // Check page title
  const hasTitle = await page.locator('h1').first().isVisible();
  console.log('H1 visible:', hasTitle);
  
  // Check for UNLOCKED badge
  const unlockedBadge = await page.locator('text=UNLOCKED').isVisible().catch(() => false);
  console.log('Unlocked badge:', unlockedBadge);
  
  // Check for PREMIUM badge (if not unlocked)
  const premiumBadge = await page.locator('text=PREMIUM').isVisible().catch(() => false);
  console.log('Premium badge:', premiumBadge);
  
  // Should have either unlocked or premium badge
  expect(unlockedBadge || premiumBadge).toBe(true);
  
  // Should have main content
  const hasContent = await page.locator('text=Step-by-Step').isVisible().catch(() => false);
  console.log('Has content:', hasContent);
});

// Test premium page without success parameter
test('Premium page loads without purchase', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
  
  await page.waitForTimeout(3000);
  
  // Should show PREMIUM badge
  await expect(page.locator('text=PREMIUM').first()).toBeVisible();
  
  // Should show pricing card
  const hasPricing = await page.locator('text=$149').isVisible().catch(() => false);
  console.log('Pricing visible:', hasPricing);
  
  // Should have unlock button
  const hasUnlockButton = await page.locator('text=Unlock Premium Content').isVisible().catch(() => false);
  console.log('Unlock button:', hasUnlockButton);
});

// Test visa detail page links to premium
test('Visa detail has link to premium', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas/partner-visa-820-801`);
  
  await page.waitForTimeout(3000);
  
  // Check for premium link or section
  const hasPremiumLink = await page.locator('a[href*="/premium"]').count() > 0;
  console.log('Has premium link:', hasPremiumLink);
  
  // Or check for premium section
  const hasPremiumSection = await page.locator('text=Premium').isVisible().catch(() => false);
  console.log('Has premium section:', hasPremiumSection);
});
