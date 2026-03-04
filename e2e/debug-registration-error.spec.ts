import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Debug Registration Error', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  DEBUGGING REGISTRATION ERROR');
  console.log('═══════════════════════════════════════════\n');
  
  // Collect all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log(text);
  });
  
  // Collect network requests
  const networkRequests: any[] = [];
  page.on('request', request => {
    if (request.url().includes('supabase') || request.url().includes('auth')) {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData()
      });
    }
  });
  
  // Collect failed responses
  const failedResponses: any[] = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  // Navigate to register
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(2000);
  
  // Fill the form
  console.log('📝 Filling form...');
  await page.fill('input[type="text"]', 'Test User');
  await page.fill('input[type="email"]', `debugtest${Date.now()}@gmail.com`);
  await page.fill('input[type="password"]', 'TestPassword123!');
  
  // Click submit and wait for response
  console.log('🚀 Submitting...');
  
  const [response] = await Promise.all([
    page.waitForResponse(resp => 
      resp.url().includes('signup') || 
      resp.url().includes('auth') ||
      resp.status() >= 400
    , { timeout: 15000 }).catch(() => null),
    page.click('button[type="submit"]')
  ]);
  
  if (response) {
    console.log(`\n📡 Response received:`);
    console.log(`  URL: ${response.url()}`);
    console.log(`  Status: ${response.status()}`);
    
    try {
      const body = await response.json();
      console.log(`  Body:`, JSON.stringify(body, null, 2));
    } catch (e) {
      const text = await response.text();
      console.log(`  Body (text): ${text.substring(0, 500)}`);
    }
  }
  
  // Wait for any error message to appear
  await page.waitForTimeout(3000);
  
  // Check for error toast/message
  const errorSelectors = [
    '[class*="toast"]',
    '[class*="error"]',
    '[role="alert"]',
    'text=/error|failed|database|unable/i'
  ];
  
  for (const selector of errorSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible().catch(() => false)) {
      const text = await element.innerText();
      if (text.trim()) {
        console.log(`\n❌ Error message found: ${text.trim()}`);
      }
    }
  }
  
  // Screenshot
  await page.screenshot({ path: 'test-results/registration-error-debug.png', fullPage: true });
  
  console.log('\n📸 Screenshot saved: test-results/registration-error-debug.png');
  console.log('\n═══════════════════════════════════════════');
});
