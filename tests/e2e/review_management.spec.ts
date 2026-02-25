import { test, expect } from '@playwright/test';

test.describe('Review Management', () => {
  const lawyerId = '123e4567-e89b-12d3-a456-426614174000';
  const internalLawyerId = 'lawyer-internal-id-123';
  const reviewId = 'review-123';
  const clientId = 'client-456';
  const clientName = 'John Client';
  const reviewText = 'This lawyer helped me with my visa application.';
  const replyText = 'Thank you for your feedback, John!';

  test.beforeEach(async ({ page }) => {
    // Mock Auth - User
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: lawyerId,
          aud: 'authenticated',
          role: 'authenticated',
          email: 'lawyer@visabuild.local',
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: {},
          created_at: '2023-01-01T00:00:00.000000Z',
          updated_at: '2023-01-01T00:00:00.000000Z',
        }),
      });
    });

    // Mock Auth - Session
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: lawyerId,
            aud: 'authenticated',
            role: 'authenticated',
            email: 'lawyer@visabuild.local',
          },
        }),
      });
    });

    // Mock Public Profile (for User Context)
    await page.route(`**/rest/v1/profiles?select=*&id=eq.${lawyerId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: lawyerId,
            full_name: 'Jane Lawyer',
            role: 'lawyer', // Important: role must be lawyer
            is_active: true,
          },
        ]),
      });
    });

    // Mock Lawyer Profile (Internal ID Lookup)
    // Matches: supabase.schema('lawyer').from('profiles').select('id').eq('profile_id', user!.id).maybeSingle()
    await page.route('**/rest/v1/profiles?select=id&profile_id=eq.*', async (route) => {
      const headers = route.request().headers();
      if (headers['accept-profile'] === 'lawyer') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: internalLawyerId }), // maybeSingle returns object, not array
        });
      } else {
        await route.continue();
      }
    });

    // Mock Lawyer Profile (Full Details for Settings Page)
    // Matches: supabase.schema('lawyer').from('profiles').select('*').eq('profile_id', profile.id).maybeSingle()
    await page.route('**/rest/v1/profiles?select=*&profile_id=eq.*', async (route) => {
        const headers = route.request().headers();
        if (headers['accept-profile'] === 'lawyer') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: internalLawyerId,
              profile_id: lawyerId,
              jurisdiction: 'New South Wales',
              bar_number: 'L-123456',
              years_experience: 10,
              specializations: ['Work Visa', 'Family Visa'],
              bio: 'Experienced immigration lawyer.',
              hourly_rate_cents: 30000,
              verification_status: 'approved', // IMPORTANT for redirect logic
              is_verified: true,
            }),
          });
        } else {
          await route.continue();
        }
    });

    // Mock Reviews Fetch
    // Matches: supabase.from('lawyer_reviews').select('*').eq('lawyer_id', lawyerProfile.id).order('created_at', { ascending: false })
    await page.route(`**/rest/v1/lawyer_reviews?select=*&lawyer_id=eq.${internalLawyerId}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: reviewId,
            lawyer_id: internalLawyerId,
            user_id: clientId,
            rating: 5,
            review_text: reviewText,
            reply_text: null, // Initially no reply
            replied_at: null,
            created_at: '2023-05-20T10:00:00Z',
          },
        ]),
      });
    });

    // Mock Client Profile Fetch (for Review Author Name)
    // Matches: supabase.from('profiles').select('id, full_name').in('id', userIds)
    await page.route(`**/rest/v1/profiles?select=id%2Cfull_name&id=in.%28${clientId}%29`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: clientId,
            full_name: clientName,
          },
        ]),
      });
    });

    // Mock Reply Submission (PATCH)
    // Matches: supabase.from('lawyer_reviews').update({...}).eq('id', reviewId)
    await page.route(`**/rest/v1/lawyer_reviews?id=eq.${reviewId}`, async (route) => {
      if (route.request().method() === 'PATCH') {
        const postData = route.request().postDataJSON();
        expect(postData.reply_text).toBe(replyText);
        expect(postData.replied_at).toBeTruthy();

        await route.fulfill({
          status: 200, // 204 No Content is typical for update, but 200 with body is also fine if Select is not used
          contentType: 'application/json',
          body: JSON.stringify([]), // Supabase update returns empty array if select() is not chained (or array of updated rows if select() is chained)
        });
      } else {
        await route.continue();
      }
    });
  });

  test('Lawyer can view reviews and post a reply', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('lawyer@visabuild.local');
    await page.getByLabel('Password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // 2. Wait for redirection to dashboard (or we force navigation to settings)
    // Even if it redirects to /lawyer/pending or /lawyer/dashboard, we can navigate to settings immediately.
    // But to be clean, let's wait for ANY navigation away from login
    await page.waitForURL(url => !url.toString().includes('/login'));

    // 3. Navigate to Lawyer Settings
    await page.goto('/lawyer/settings');

    // 4. Verify Review is Visible
    await expect(page.getByText('Reviews & Reputation')).toBeVisible();
    await expect(page.getByText(clientName)).toBeVisible(); // "John Client"
    await expect(page.getByText(reviewText)).toBeVisible(); // "This lawyer helped me..."

    // 5. Interact with Reply
    // Assuming "Reply" button exists
    const replyButton = page.getByRole('button', { name: 'Reply' });
    await expect(replyButton).toBeVisible();
    await replyButton.click();

    // 6. Type Reply
    const replyInput = page.getByPlaceholder('Write a reply to this review...');
    await expect(replyInput).toBeVisible();
    await replyInput.fill(replyText);

    // 7. Submit Reply
    const postButton = page.getByRole('button', { name: 'Post Reply' });
    await expect(postButton).toBeVisible();

    // We need to update the reviews mock to reflect the reply after submission,
    // because the component refetches reviews after posting.
    await page.route(`**/rest/v1/lawyer_reviews?select=*&lawyer_id=eq.${internalLawyerId}*`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: reviewId,
              lawyer_id: internalLawyerId,
              user_id: clientId,
              rating: 5,
              review_text: reviewText,
              reply_text: replyText, // Now includes reply
              replied_at: new Date().toISOString(),
              created_at: '2023-05-20T10:00:00Z',
            },
          ]),
        });
      });

    await postButton.click();

    // 8. Verify Success Toast
    await expect(page.getByText('Reply posted successfully')).toBeVisible();

    // 9. Verify Reply is displayed in the UI (User's Reply section)
    await expect(page.getByText('Your Reply')).toBeVisible();
    await expect(page.getByText(replyText)).toBeVisible();
  });
});
