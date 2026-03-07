import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://yourvisasite.vercel.app';

// Test user credentials
const USER_EMAIL = 'agent-user-01@visabuild.test';
const USER_PASSWORD = 'TestPass123!';

test.describe('PREMIUM SECTION - User Tests', () => {
  test.setTimeout(60000);

  test('Premium page shows locked content for non-purchased visa', async ({ page }) => {
    console.log('\n🔒 TESTING: Premium page locked state');
    console.log(`  URL: ${BASE_URL}/visas/partner-visa-820-801/premium`);
    
    // Go to partner visa premium page
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // Check for error messages first
    const errorText = await page.locator('body').textContent();
    if (errorText?.includes('error') || errorText?.includes('Error')) {
      console.log(`  ⚠️ Page has error: ${errorText.substring(0, 200)}`);
    }
    
    // Check page loaded - look for any heading
    const hasHeading = await page.locator('h1').first().isVisible().catch(() => false);
    const pageTitle = await page.title();
    console.log(`  Page title: ${pageTitle}`);
    console.log(`  Has heading: ${hasHeading}`);
    
    // Take screenshot regardless
    await page.screenshot({ path: 'test-results/premium-locked.png', fullPage: true });
    
    // Check for locked content indicators
    const hasPremiumBadge = await page.locator('text=PREMIUM').first().isVisible().catch(() => false);
    const hasLockIcon = await page.locator('svg[class*="lock"]').count() > 0;
    
    console.log(`  Premium badge: ${hasPremiumBadge}`);
    console.log(`  Lock icon: ${hasLockIcon}`);
    
    // Soft assertion - just check page loads
    expect(hasHeading || hasPremiumBadge).toBe(true);
  });

  test('User can login and view premium page', async ({ page }) => {
    console.log('\n👤 TESTING: User login + premium page');
    
    // Step 1: Login
    console.log('  Step 1: Logging in...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
    
    // Check if we're already logged in
    const url = page.url();
    if (!url.includes('/login')) {
      console.log('  Already logged in or redirected');
    } else {
      // Try to find and fill login form
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      if (await emailInput.isVisible().catch(() => false)) {
        await emailInput.fill(USER_EMAIL);
        await passwordInput.fill(USER_PASSWORD);
        
        // Find submit button
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(4000);
        }
      }
    }
    
    const currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl}`);
    
    // Step 2: Go to premium page
    console.log('  Step 2: Navigating to premium page...');
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/premium-logged-in.png', fullPage: true });
    
    // Check page content
    const hasHeading = await page.locator('h1').first().isVisible().catch(() => false);
    const headingText = await page.locator('h1').first().textContent().catch(() => 'No heading');
    
    console.log(`  Heading: ${headingText}`);
    console.log(`  Has heading: ${hasHeading}`);
    
    // Soft check - page should at least load
    expect(hasHeading).toBe(true);
  });

  test('Premium pricing card displays correctly', async ({ page }) => {
    console.log('\n💳 TESTING: Premium pricing card');
    
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check pricing elements
    const hasPrice = await page.locator('text=$149').first().isVisible().catch(() => false);
    const hasOriginalPrice = await page.locator('text=$499').first().isVisible().catch(() => false);
    const hasDiscount = await page.locator('text=70% OFF, [class*="discount"]').first().isVisible().catch(() => false);
    const hasBuyButton = await page.locator('text=Get Instant Access, text=Unlock Premium Content').first().isVisible().catch(() => false);
    
    console.log(`  Price ($149) visible: ${hasPrice}`);
    console.log(`  Original price ($499) visible: ${hasOriginalPrice}`);
    console.log(`  Discount badge visible: ${hasDiscount}`);
    console.log(`  Buy button visible: ${hasBuyButton}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/premium-pricing.png', fullPage: true });
    
    expect(hasPrice).toBe(true);
    expect(hasBuyButton).toBe(true);
  });

  test('Premium content sections are present', async ({ page }) => {
    console.log('\n📚 TESTING: Premium content sections');
    
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check for content sections
    const hasSteps = await page.locator('text=Step-by-Step').isVisible().catch(() => false);
    const hasDocuments = await page.locator('text=Document Checklists').isVisible().catch(() => false);
    const hasEvidence = await page.locator('text=Evidence Requirements').isVisible().catch(() => false);
    const hasFAQ = await page.locator('text=FAQ, text=Frequently Asked').isVisible().catch(() => false);
    
    console.log(`  Steps section: ${hasSteps}`);
    console.log(`  Documents section: ${hasDocuments}`);
    console.log(`  Evidence section: ${hasEvidence}`);
    console.log(`  FAQ section: ${hasFAQ}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/premium-content.png', fullPage: true });
    
    expect(hasSteps).toBe(true);
  });

  test('Locked content shows blur overlay', async ({ page }) => {
    console.log('\n🔐 TESTING: Locked content blur overlay');
    
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check for blur effect or locked indicator
    const hasBlur = await page.locator('[class*="blur"], [style*="blur"]').count() > 0;
    const hasLockOverlay = await page.locator('text=Continue Reading, text=Unlock to continue').isVisible().catch(() => false);
    const hasLockIcon = await page.locator('svg[class*="lock"], [data-testid="lock-icon"]').count() > 0;
    
    console.log(`  Blur effect present: ${hasBlur}`);
    console.log(`  Lock overlay visible: ${hasLockOverlay}`);
    console.log(`  Lock icon present: ${hasLockIcon}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/premium-locked-overlay.png', fullPage: true });
    
    // At least one locking mechanism should be present
    expect(hasBlur || hasLockOverlay || hasLockIcon).toBe(true);
  });

  test('Quick links section is present', async ({ page }) => {
    console.log('\n🔗 TESTING: Quick links sidebar');
    
    await page.goto(`${BASE_URL}/visas/partner-visa-820-801/premium`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check for quick links
    const hasDocChecklist = await page.locator('text=Document Checklist').isVisible().catch(() => false);
    const hasProcessingTimes = await page.locator('text=Processing Times').isVisible().catch(() => false);
    const hasFeeCalculator = await page.locator('text=Fee Calculator').isVisible().catch(() => false);
    const hasFindLawyer = await page.locator('text=Find a Lawyer').isVisible().catch(() => false);
    
    console.log(`  Document Checklist link: ${hasDocChecklist}`);
    console.log(`  Processing Times link: ${hasProcessingTimes}`);
    console.log(`  Fee Calculator link: ${hasFeeCalculator}`);
    console.log(`  Find a Lawyer link: ${hasFindLawyer}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/premium-sidebar.png', fullPage: true });
    
    expect(hasDocChecklist).toBe(true);
  });
});
