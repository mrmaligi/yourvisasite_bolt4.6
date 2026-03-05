import { Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

/**
 * Logs in as a given role. Waits for redirect away from /login.
 */
export async function loginAs(
    page: Page,
    role: 'Admin' | 'Lawyer' | 'Applicant',
    email: string,
    password: string
): Promise<void> {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Click role button if present
    const roleBtn = page.locator(`button:has-text("${role}")`).first();
    if (await roleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await roleBtn.click();
        await page.waitForTimeout(500);
    }

    // Fill credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    // Click submit
    await page.click('button[type="submit"]');

    // Wait for redirect away from login page (up to 20s)
    await page.waitForFunction(
        () => !window.location.href.includes('/login'),
        { timeout: 20000 }
    ).catch(() => {
        // If still on login, that's ok, the test will fail with a meaningful message
    });

    await page.waitForTimeout(2000);
}
