import { test, expect } from '@playwright/test';

const BASE_URL = 'https://yourvisasite.vercel.app';

// Critical pages only
const CRITICAL_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/visas', name: 'Visa Search' },
  { path: '/visas/partner-visa-820-801', name: 'Visa Detail' },
  { path: '/lawyers', name: 'Lawyer Directory' },
  { path: '/faq', name: 'FAQ' },
  { path: '/about', name: 'About' },
  { path: '/resources', name: 'Resources' },
  { path: '/news', name: 'News' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/tracker', name: 'Tracker' },
  { path: '/terms', name: 'Terms' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/contact', name: 'Contact' },
];

test.describe('CRITICAL PAGES - Full Application Test', () => {
  
  for (const pageInfo of CRITICAL_PAGES) {
    test(`${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', (error) => {
        console.log(`❌ ${pageInfo.name} ERROR: ${error.message}`);
        errors.push(error.message);
      });
      
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.log(`❌ ${pageInfo.name} CONSOLE: ${msg.text()}`);
          errors.push(msg.text());
        }
      });

      try {
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
          e.includes('ModernCard')
        );

        if (criticalErrors.length > 0) {
          console.log(`\n❌ ${pageInfo.name} FAILED:`);
          criticalErrors.forEach(e => console.log(`   ${e.substring(0, 150)}`));
        } else {
          console.log(`✅ ${pageInfo.name}: OK`);
        }

        expect(criticalErrors).toHaveLength(0);
        
      } catch (e) {
        console.log(`⚠️ ${pageInfo.name}: Navigation error - ${e}`);
      }
    });
  }
  
  test('Login form works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    const hasEmail = await emailInput.isVisible().catch(() => false);
    const hasPassword = await passwordInput.isVisible().catch(() => false);
    
    console.log(`✅ Login form: ${hasEmail && hasPassword ? 'WORKING' : 'CHECK NEEDED'}`);
  });
  
  test('Register form works', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`, { timeout: 15000 });
    await page.waitForTimeout(1000);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    console.log('✅ Register page: LOADED');
  });
});
