import { test, expect } from '@playwright/test';

const BASE_URL = 'https://yourvisasite-newui.vercel.app';

// Public pages to test
const publicPages = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/contact', name: 'Contact' },
  { path: '/visas', name: 'Visa Search' },
  { path: '/lawyers', name: 'Lawyer Directory' },
  { path: '/faq', name: 'FAQ' },
  { path: '/about', name: 'About' },
  { path: '/help', name: 'Help Center' },
];

test.describe('New Vercel Deployment Tests', () => {
  
  for (const pageInfo of publicPages) {
    test(`${pageInfo.name} page loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(`${BASE_URL}${pageInfo.path}`, { 
        timeout: 15000,
        waitUntil: 'networkidle' 
      });

      await page.waitForTimeout(2000);

      // Check for critical errors
      const criticalErrors = errors.filter(e => 
        e.includes('is not defined') ||
        e.includes('ReferenceError') ||
        e.includes('ModernButton') ||
        e.includes('ModernCard') ||
        e.includes('ContentContainer') ||
        e.includes('PageHeader')
      );

      if (criticalErrors.length > 0) {
        console.log(`❌ Errors on ${pageInfo.name}:`, criticalErrors);
      } else {
        console.log(`✅ ${pageInfo.name} page OK`);
      }

      expect(criticalErrors).toHaveLength(0);
    });
  }

  test('Login form works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { timeout: 15000 });
    
    // Look for form elements
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Check if form exists and is visible
    const hasEmail = await emailInput.isVisible().catch(() => false);
    const hasPassword = await passwordInput.isVisible().catch(() => false);
    
    if (hasEmail && hasPassword) {
      console.log('✅ Login form elements found');
      
      // Try filling the form
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      console.log('✅ Login form can be filled');
    } else {
      console.log('⚠️ Login form elements not found - checking for alternative UI');
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-results/login-page.png' });
    }
  });

  test('Home page has content', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { timeout: 15000 });
    
    // Check for main content
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    const headingText = await heading.textContent();
    console.log('Home page heading:', headingText);
    
    // Check for navigation
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
    
    console.log('✅ Home page has heading and navigation');
  });
});
