import { test, expect } from '@playwright/test';

test.describe('Accessibility Checks', () => {
  test('Login page has accessible elements', async ({ page }) => {
    await page.goto('/login');

    // Check login type buttons
    const applicantButton = page.getByRole('button', { name: 'Applicant' });
    const lawyerButton = page.getByRole('button', { name: 'Lawyer' });

    await expect(applicantButton).toBeVisible();
    await expect(lawyerButton).toBeVisible();

    // Verify aria-pressed attribute (should be present and correct)
    // Initially 'Applicant' is selected
    await expect(applicantButton).toHaveAttribute('aria-pressed', 'true');
    await expect(lawyerButton).toHaveAttribute('aria-pressed', 'false');

    // Click Lawyer and verify change
    await lawyerButton.click();
    await expect(applicantButton).toHaveAttribute('aria-pressed', 'false');
    await expect(lawyerButton).toHaveAttribute('aria-pressed', 'true');

    // Check password toggle button
    // It should have an accessible name like "Show password" or "Hide password"
    // Currently it doesn't, so this part will fail until fixed.
    // We use a locator that finds the button by its accessible name.
    const showPasswordButton = page.getByRole('button', { name: 'Show password' });

    // We expect this to be attached to the DOM.
    // If it's not found by role and name, this locator will fail to resolve or count as 0.
    // To be precise, let's try to locate it.
    await expect(showPasswordButton).toBeVisible();

    // Verify focus styles (class check)
    // The login type buttons should have focus-visible classes
    await expect(applicantButton).toHaveClass(/focus-visible:ring-2/);
  });
});
