import { test, expect } from '@playwright/test';

test.describe('Mobile Issues Reproduction', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Hamburger menu should toggle and close on link click', async ({ page }) => {
    await page.goto('/');

    // Check for hamburger menu button (visible on mobile)
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check if menu is open
    // The menu container has "fixed inset-x-0 top-16 bottom-0" classes
    const mobileMenu = page.locator('div.fixed.inset-x-0.top-16.bottom-0');
    await expect(mobileMenu).toBeVisible();

    // Verify Z-Index fix
    await expect(mobileMenu).toHaveClass(/z-\[60\]/);

    // Click on a link inside the menu
    // We scope to the mobileMenu to avoid matching the bottom nav
    const visaLink = mobileMenu.getByRole('link', { name: 'Visas' });
    await expect(visaLink).toBeVisible();
    await visaLink.click();

    // Verify we navigated
    await expect(page).toHaveURL(/\/visas/);

    // Verify menu is closed (not visible)
    await expect(mobileMenu).not.toBeVisible();
  });

  test('Sign in should work on mobile', async ({ page }) => {
    // Mock authentication flow
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
        const json = {
            access_token: 'mock-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh',
            user: {
                id: 'test-user-id',
                aud: 'authenticated',
                role: 'authenticated',
                email: 'test@example.com',
            }
        };
        await route.fulfill({ json });
    });

    await page.route('**/auth/v1/user', async (route) => {
        await route.fulfill({ json: {
            id: 'test-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'test@example.com',
        }});
    });

    await page.route('**/rest/v1/profiles*', async (route) => {
        await route.fulfill({ json: {
            id: 'test-user-id',
            role: 'user',
            full_name: 'Test User',
            is_active: true
        }});
    });

    await page.goto('/login');

    // Fill form
    await page.getByLabel('Email Address').fill('test@example.com');

    // Use exact match for Password label or use placeholder
    await page.getByPlaceholder('••••••••').fill('password123');

    // Click sign in
    const signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    // Expect navigation to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
