import { test, expect } from '@playwright/test';

test.describe('Global Search', () => {
  test('Global Search opens and filters results correctly', async ({ page }) => {
    // 1. Mock Visas
    await page.route('**/rest/v1/visas*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: 'visa-1',
            name: 'Partner Visa',
            subclass: '820',
            category: 'Family'
          },
          {
            id: 'visa-2',
            name: 'Skilled Visa',
            subclass: '189',
            category: 'Skilled'
          }
        ])
      });
    });

    // 2. Mock Profiles (Lawyer and Public)
    await page.route('**/rest/v1/profiles*', async route => {
      const headers = route.request().headers();

      // If asking for lawyer schema
      if (headers['accept-profile'] === 'lawyer') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([
            {
              id: 'lawyer-1',
              profile_id: 'user-1',
              jurisdiction: 'NSW'
            }
          ])
        });
        return;
      }

      // If asking for public schema (for names)
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: 'user-1',
            full_name: 'John Doe'
          }
        ])
      });
    });

    // 3. Mock News
    await page.route('**/rest/v1/news_articles*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: 'news-1',
            title: 'Immigration Update 2024',
            slug: 'immigration-update-2024'
          }
        ])
      });
    });

    // Navigate to landing page
    await page.goto('/');

    // Wait for page to load
    await expect(page).toHaveTitle(/VisaBuild/);
    await expect(page.getByRole('heading', { name: 'Navigate Australian Immigration' })).toBeVisible();

    // Locate and click the search trigger
    // Desktop shows "Search...", Mobile shows icon with aria-label="Search"
    const desktopTrigger = page.getByText('Search...', { exact: true });

    // Wait for trigger to be visible
    await expect(desktopTrigger).toBeVisible();
    await desktopTrigger.click();

    // Verify modal opens
    const searchInput = page.getByPlaceholder('Search visas, lawyers, news...');
    await expect(searchInput).toBeVisible();

    // Test Visa Filtering
    await searchInput.fill('Partner');
    await expect(page.getByText('820 - Partner Visa')).toBeVisible();
    await expect(page.getByText('189 - Skilled Visa')).not.toBeVisible();

    // Test Lawyer Filtering
    await searchInput.fill('John');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Lawyer', { exact: true })).not.toBeVisible();

    // Test News Filtering
    await searchInput.fill('Update');
    await expect(page.getByText('Immigration Update 2024')).toBeVisible();

    // Test Navigation
    await searchInput.fill('Partner');
    await page.getByText('820 - Partner Visa').click();
    await expect(page).toHaveURL(/\/visas\/visa-1/);
  });
});
