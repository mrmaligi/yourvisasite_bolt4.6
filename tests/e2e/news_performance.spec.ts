import { test, expect } from '@playwright/test';

const generateNews = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `id-${i}`,
    title: `News Article ${i}`,
    slug: `news-article-${i}`,
    excerpt: `This is a short excerpt for article ${i}`,
    body: `This is the body content for article ${i}. It is slightly longer than the excerpt.`,
    category: i % 3 === 0 ? 'policy' : i % 3 === 1 ? 'processing' : 'regulation',
    published_at: new Date(Date.now() - i * 86400000).toISOString(),
    news_comments: [{ count: 0 }]
  }));
};

test.describe('News Performance', () => {
  test('loads large dataset efficiently', async ({ page }) => {
    const largeDataset = generateNews(100);

    await page.route('**/rest/v1/news_articles*', async route => {
        const headers = route.request().headers();
        const range = headers['range'] || headers['Range'];

        let responseBody = largeDataset;
        let contentRange = `0-${largeDataset.length-1}/${largeDataset.length}`;

        if (range) {
             const parts = range.replace('bytes=', '').split('-');
             const start = parseInt(parts[0], 10);
             const end = parts[1] ? parseInt(parts[1], 10) : largeDataset.length - 1;

             // Clamp end
             const effectiveEnd = Math.min(end, largeDataset.length - 1);

             responseBody = largeDataset.slice(start, effectiveEnd + 1);
             contentRange = `${start}-${effectiveEnd}/${largeDataset.length}`;
        } else {
             // Check if limit/offset params are used
             const url = new URL(route.request().url());
             const limit = url.searchParams.get('limit');
             const offset = url.searchParams.get('offset');

             if (limit) {
                 const l = parseInt(limit, 10);
                 const o = offset ? parseInt(offset, 10) : 0;
                 responseBody = largeDataset.slice(o, o + l);
                 contentRange = `${o}-${o + l - 1}/${largeDataset.length}`;
             }
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(responseBody),
            headers: {
                'Content-Range': contentRange
            }
        });
    });

    const startTime = Date.now();
    await page.goto('/news');

    // Check that the first item is visible
    await expect(page.getByText('News Article 0')).toBeVisible();

    const duration = Date.now() - startTime;
    console.log(`Initial load time: ${duration}ms`);

    // Verify optimization: The last item should NOT be present initially
    await expect(page.getByText('News Article 99')).not.toBeVisible();
  });
});
