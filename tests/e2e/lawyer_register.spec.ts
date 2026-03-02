import { test, expect } from '@playwright/test';

test.describe('Lawyer Registration Flow', () => {
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const userEmail = 'lawyer@example.com';
  const fakeSignedUrl = 'http://localhost:5173/fake-upload-path';
  const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  test.beforeEach(async ({ page }) => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // 1. Mock Auth Token (Login)
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: fakeJwt,
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh',
          user: {
            id: userId,
            email: userEmail,
            aud: 'authenticated',
            role: 'authenticated',
          }
        })
      });
    });

    // 2. Mock User
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: userId,
          email: userEmail,
          aud: 'authenticated',
          role: 'authenticated',
        })
      });
    });

    // 3. Mock Profiles (GET)
    await page.route('**/rest/v1/profiles*', async route => {
      const method = route.request().method();
      if (method === 'GET') {
         await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: userId,
            email: userEmail,
            role: 'user',
            is_active: true,
            lawyer_profiles: []
          }])
        });
      } else {
        await route.continue();
      }
    });

    // Establish session by visiting login page and "logging in"
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(userEmail);
    await page.getByLabel('Password').fill('password');
    await page.locator('button[type="submit"]').click();

    // Wait for redirect to dashboard or home
    await expect(page).not.toHaveURL(/\/login/);
  });

  // FIXME: Mocking supabase-js uploadFile internal validation (createSignedUploadUrl response) is tricky.
  // The client throws "No token returned by API" regardless of the mock response structure we tried.
  test.fixme('Complete registration flow', async ({ page }) => {
    // 1. Mock Storage Upload URL Creation
    await page.route('**/storage/v1/object/upload/sign/**', async route => {
      // console.log('Intercepted Storage Sign Request');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          signedURL: fakeSignedUrl,
          signedUrl: fakeSignedUrl,
          url: fakeSignedUrl,
          path: 'lawyer-credentials/some-path',
          token: 'fake-token-for-upload',
        })
      });
    });

    // 2. Mock File Upload PUT request
    await page.route('**/fake-upload-path', async route => {
      // console.log('Intercepted PUT to fake-upload-path');
      await route.fulfill({
        status: 200,
        body: 'Upload successful',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
      });
    });

    // 3. Mock Profile Update (Submission)
    let updatePayload: any = null;
    await page.route('**/rest/v1/profiles*', async route => {
      const method = route.request().method();
      if (method === 'PATCH') {
        // console.log('Intercepted PATCH Profile');
        updatePayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
             id: userId,
             role: 'lawyer',
             verification_status: 'pending'
          }])
        });
      } else {
        await route.fallback();
      }
    });

    // Navigate to registration page
    await page.goto('/register/lawyer');

    // Step 1: Professional Details
    await page.getByLabel('Bar Number').fill('BAR-12345');
    await page.getByLabel('Jurisdiction').fill('New York');
    await page.getByLabel('Practice Areas').fill('Immigration, Family');
    await page.getByLabel('Years of Experience').fill('5');
    await page.getByLabel('Hourly Rate').fill('250');
    await page.getByLabel('Professional Bio').fill('Experienced immigration lawyer.');

    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Verification Document
    await page.setInputFiles('input[type="file"]', {
        name: 'license.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('dummy content')
    });

    await expect(page.getByText('license.pdf')).toBeVisible();

    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Review & Submit
    await page.getByRole('button', { name: 'Submit Registration' }).click();

    // Verify Submission
    await expect(page).toHaveURL(/\/lawyer\/pending/, { timeout: 10000 });

    // Verify payload
    expect(updatePayload).toBeTruthy();
    expect(updatePayload.bar_number).toBe('BAR-12345');
    expect(updatePayload.hourly_rate_cents).toBe(25000);
    expect(updatePayload.verification_document_url).toBeTruthy();
    expect(updatePayload.verification_document_url).toContain(userId);
  });

  test('Validation prevents empty submission', async ({ page }) => {
      await page.goto('/register/lawyer');

      await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();

      await page.getByLabel('Bar Number').fill('BAR-123');
      await page.getByLabel('Jurisdiction').fill('NY');
      await page.getByLabel('Hourly Rate').fill('100');

      await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });
});
