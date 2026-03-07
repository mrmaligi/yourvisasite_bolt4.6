import { test, expect } from '@playwright/test';

// Smoke test - verify all major pages load without errors
const pages = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/contact', name: 'Contact' },
  { path: '/visas', name: 'Visa Search' },
  { path: '/lawyers', name: 'Lawyer Directory' },
  { path: '/faq', name: 'FAQ' },
  { path: '/about', name: 'About' },
];

for (const page of pages) {
  test(`${page.name} page loads without errors`, async ({ page: p }) => {
    // Capture console errors
    const errors: string[] = [];
    p.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    p.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to page
    await p.goto(`http://localhost:5173${page.path}`, { 
      timeout: 10000,
      waitUntil: 'networkidle' 
    });

    // Wait a bit for any client-side errors
    await p.waitForTimeout(2000);

    // Check for "ContentContainer is not defined" or similar errors
    const hasComponentError = errors.some(e => 
      e.includes('is not defined') || 
      e.includes('ContentContainer') ||
      e.includes('PageHeader')
    );

    if (hasComponentError) {
      console.log(`Errors on ${page.name}:`, errors);
    }

    expect(hasComponentError).toBe(false);
    expect(errors.filter(e => e.includes('is not defined'))).toHaveLength(0);
  });
}

// Quick visual check
test('Home page has key elements', async ({ page }) => {
  await page.goto('http://localhost:5173/', { timeout: 10000 });
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('button')).toHaveCount.greaterThan(0);
});
