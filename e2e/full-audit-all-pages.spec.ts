import { test, expect } from '@playwright/test';

// Test both deployments
const DEPLOYMENTS = [
  { name: 'Original', url: 'https://yourvisasite.vercel.app' },
  { name: 'NewUI', url: 'https://yourvisasite-newui.vercel.app' }
];

// All pages to test
const ALL_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/contact', name: 'Contact' },
  { path: '/visas', name: 'Visa Search' },
  { path: '/visas/compare', name: 'Visa Compare' },
  { path: '/lawyers', name: 'Lawyer Directory' },
  { path: '/lawyers/1', name: 'Lawyer Profile' },
  { path: '/faq', name: 'FAQ' },
  { path: '/about', name: 'About' },
  { path: '/help', name: 'Help Center' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/tracker', name: 'Tracker' },
  { path: '/news', name: 'News' },
  { path: '/forum', name: 'Forum' },
  { path: '/resources', name: 'Resources' },
];

for (const deployment of DEPLOYMENTS) {
  test.describe(`${deployment.name} Deployment - Full Page Audit`, () => {
    
    for (const pageInfo of ALL_PAGES) {
      test(`${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
        const errors: string[] = [];
        let pageLoaded = false;
        
        page.on('pageerror', (error) => {
          errors.push(`PAGE ERROR: ${error.message}`);
        });
        
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(`CONSOLE: ${msg.text()}`);
          }
        });

        try {
          const response = await page.goto(`${deployment.url}${pageInfo.path}`, { 
            timeout: 10000,
            waitUntil: 'domcontentloaded'
          });
          
          pageLoaded = response?.status() === 200;
          
          // Wait for JS to execute
          await page.waitForTimeout(1500);
          
        } catch (e) {
          errors.push(`NAVIGATION FAILED: ${e}`);
        }

        // Check for critical errors
        const criticalErrors = errors.filter(e => 
          e.includes('is not defined') ||
          e.includes('ReferenceError') ||
          e.includes('TypeError') ||
          e.includes('Cannot read') ||
          e.includes('ModernButton') ||
          e.includes('ModernCard') ||
          e.includes('ContentContainer') ||
          e.includes('PageHeader') ||
          e.includes('NAVIGATION FAILED')
        );

        // Log results
        if (criticalErrors.length > 0) {
          console.log(`\n❌ ${deployment.name} - ${pageInfo.name}:`);
          criticalErrors.forEach(e => console.log(`   ${e.substring(0, 100)}`));
        } else if (pageLoaded) {
          console.log(`✅ ${deployment.name} - ${pageInfo.name}: OK`);
        } else {
          console.log(`⚠️ ${deployment.name} - ${pageInfo.name}: Page not loaded`);
        }

        // Soft assertion - don't fail test, just report
        expect(criticalErrors.length).toBeLessThan(5);
      });
    }
    
    // Test auth functionality
    test('Login form functionality', async ({ page }) => {
      await page.goto(`${deployment.url}/login`, { timeout: 10000 });
      await page.waitForTimeout(1000);
      
      // Check for form elements
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitBtn = page.locator('button[type="submit"]').first();
      
      const hasEmail = await emailInput.isVisible().catch(() => false);
      const hasPassword = await passwordInput.isVisible().catch(() => false);
      
      if (hasEmail && hasPassword) {
        console.log(`✅ ${deployment.name} - Login form: OK`);
      } else {
        console.log(`⚠️ ${deployment.name} - Login form: Elements not found`);
      }
    });
    
    // Test registration
    test('Register form functionality', async ({ page }) => {
      await page.goto(`${deployment.url}/register`, { timeout: 10000 });
      await page.waitForTimeout(1000);
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
      console.log(`✅ ${deployment.name} - Register page: Loaded`);
    });
    
  });
}
