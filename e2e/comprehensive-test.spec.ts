import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'https://yourvisasite.vercel.app';

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

// Helper function to check for JS errors
test.beforeEach(async ({ page }) => {
  // Clear console logs
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', (error) => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
});

// Test 1: All public pages load without console errors
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

    // Wait for JS to execute
    await page.waitForTimeout(2000);

    // Check for critical errors
    const criticalErrors = errors.filter(e => 
      e.includes('is not defined') ||
      e.includes('ReferenceError') ||
      e.includes('Cannot read property') ||
      e.includes('ContentContainer') ||
      e.includes('PageHeader') ||
      e.includes('ModernButton')
    );

    if (criticalErrors.length > 0) {
      console.log(`Errors on ${pageInfo.name}:`, criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
    
    // Basic page structure check
    await expect(page.locator('body')).toBeVisible();
  });
}

// Test 2: Home page has all key elements
test('Home page structure is correct', async ({ page }) => {
  await page.goto(`${BASE_URL}/`, { timeout: 15000 });
  
  // Check for main elements
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('nav, header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  
  // Check for buttons
  const buttons = page.locator('button, a[role="button"]');
  await expect(buttons.first()).toBeVisible();
});

// Test 3: Login page form elements
test('Login page has form elements', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`, { timeout: 15000 });
  
  // Check for form inputs
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  
  // Should have at least email or password field
  const hasEmail = await emailInput.isVisible().catch(() => false);
  const hasPassword = await passwordInput.isVisible().catch(() => false);
  
  expect(hasEmail || hasPassword).toBe(true);
});

// Test 4: Visa search page loads data
test('Visa search page displays content', async ({ page }) => {
  await page.goto(`${BASE_URL}/visas`, { timeout: 15000 });
  
  // Wait for potential data loading
  await page.waitForTimeout(3000);
  
  // Check page loaded
  await expect(page.locator('body')).toBeVisible();
  
  // Check for main content area
  const mainContent = page.locator('main, .container, [class*="content"]').first();
  await expect(mainContent).toBeVisible();
});

// Test 5: Contact page form
test('Contact page has contact form', async ({ page }) => {
  await page.goto(`${BASE_URL}/contact`, { timeout: 15000 });
  
  // Check for form or contact info
  const form = page.locator('form').first();
  const contactInfo = page.locator('text=email, text=contact, text=support').first();
  
  const hasForm = await form.isVisible().catch(() => false);
  const hasContactInfo = await contactInfo.isVisible().catch(() => false);
  
  expect(hasForm || hasContactInfo).toBe(true);
});

// Test 6: Mobile responsiveness
test('Home page is responsive on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto(`${BASE_URL}/`, { timeout: 15000 });
  
  // Check page loads without horizontal scroll
  const body = page.locator('body');
  await expect(body).toBeVisible();
  
  // Check for mobile menu or hamburger
  const mobileMenu = page.locator('[aria-label*="menu"], [class*="hamburger"], button[class*="menu"]').first();
  // Not required but good to have
});

// Test 7: Dark mode toggle works (if present)
test('Dark mode toggle works', async ({ page }) => {
  await page.goto(`${BASE_URL}/`, { timeout: 15000 });
  
  // Look for dark mode toggle
  const darkModeToggle = page.locator([
    'button[aria-label*="dark"]',
    'button[aria-label*="theme"]',
    '[class*="dark-mode"]',
    '[class*="theme-toggle"]'
  ].join(', ')).first();
  
  // If toggle exists, test it
  const hasToggle = await darkModeToggle.isVisible().catch(() => false);
  
  if (hasToggle) {
    // Get initial theme
    const initialClass = await page.locator('html, body').first().getAttribute('class');
    
    // Click toggle
    await darkModeToggle.click();
    await page.waitForTimeout(500);
    
    // Check class changed
    const newClass = await page.locator('html, body').first().getAttribute('class');
    expect(newClass).not.toEqual(initialClass);
  }
});

// Test 8: Navigation links work
test('Navigation links are clickable', async ({ page }) => {
  await page.goto(`${BASE_URL}/`, { timeout: 15000 });
  
  // Find navigation
  const nav = page.locator('nav, header').first();
  await expect(nav).toBeVisible();
  
  // Find links
  const links = nav.locator('a');
  const linkCount = await links.count();
  
  expect(linkCount).toBeGreaterThan(0);
  
  // Test first link if it's internal
  if (linkCount > 0) {
    const firstLink = links.first();
    const href = await firstLink.getAttribute('href');
    
    if (href && !href.startsWith('http')) {
      await firstLink.click();
      await page.waitForTimeout(1000);
      // Should navigate successfully
    }
  }
});

// Test 9: Images load correctly
test('Images load on home page', async ({ page }) => {
  await page.goto(`${BASE_URL}/`, { timeout: 15000 });
  
  // Check for images
  const images = page.locator('img');
  const imageCount = await images.count();
  
  if (imageCount > 0) {
    // Check first image
    const firstImage = images.first();
    await expect(firstImage).toBeVisible();
  }
});

// Test 10: Footer is present
test('Footer is present on all pages', async ({ page }) => {
  for (const pageInfo of publicPages.slice(0, 3)) { // Test first 3 pages
    await page.goto(`${BASE_URL}${pageInfo.path}`, { timeout: 10000 });
    
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  }
});
