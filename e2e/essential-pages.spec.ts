import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5174';

// Public Pages
const publicPages = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/visas', name: 'Visa Search' },
  { path: '/tracker', name: 'Tracker Dashboard' },
  { path: '/tracker/submit', name: 'Submit Timeline' },
];

// Admin Pages
const adminPages = [
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/users', name: 'Admin Users' },
  { path: '/admin/lawyers', name: 'Admin Lawyers' },
  { path: '/admin/payments', name: 'Admin Payments' },
];

// User Pages
const userPages = [
  { path: '/dashboard', name: 'User Dashboard' },
  { path: '/dashboard/chat', name: 'User Chat' },
  { path: '/dashboard/documents', name: 'User Documents' },
  { path: '/dashboard/payments', name: 'User Payments' },
];

// Lawyer Pages
const lawyerPages = [
  { path: '/lawyer/dashboard', name: 'Lawyer Dashboard' },
  { path: '/lawyer/cases', name: 'Lawyer Cases' },
  { path: '/lawyer/availability', name: 'Lawyer Availability' },
  { path: '/lawyer/earnings', name: 'Lawyer Earnings' },
];

test.describe('Essential Pages Load Test', () => {
  
  // Test Public Pages
  for (const page of publicPages) {
    test(`Public: ${page.name} (${page.path})`, async ({ page: p }) => {
      const response = await p.goto(`${baseURL}${page.path}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(p.locator('body')).toBeVisible();
    });
  }

  // Test Admin Pages
  for (const page of adminPages) {
    test(`Admin: ${page.name} (${page.path})`, async ({ page: p }) => {
      const response = await p.goto(`${baseURL}${page.path}`);
      expect(response?.status()).toBeLessThan(500);
      await expect(p.locator('body')).toBeVisible();
    });
  }

  // Test User Pages
  for (const page of userPages) {
    test(`User: ${page.name} (${page.path})`, async ({ page: p }) => {
      const response = await p.goto(`${baseURL}${page.path}`);
      expect(response?.status()).toBeLessThan(500);
      await expect(p.locator('body')).toBeVisible();
    });
  }

  // Test Lawyer Pages
  for (const page of lawyerPages) {
    test(`Lawyer: ${page.name} (${page.path})`, async ({ page: p }) => {
      const response = await p.goto(`${baseURL}${page.path}`);
      expect(response?.status()).toBeLessThan(500);
      await expect(p.locator('body')).toBeVisible();
    });
  }
});

test.describe('Navigation Links Test', () => {
  test('Navbar links work on home page', async ({ page }) => {
    await page.goto(`${baseURL}/`);
    
    const navLinks = ['Tracker', 'Visas', 'Lawyers'];
    for (const link of navLinks) {
      const locator = page.getByRole('link', { name: link });
      if (await locator.count() > 0) {
        await expect(locator).toBeVisible();
      }
    }
  });
});
