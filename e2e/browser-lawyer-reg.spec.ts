import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.yourvisasite.com';

test('Browser Lawyer Registration - Check if Auto-Approved', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  BROWSER LAWYER REGISTRATION TEST');
  console.log('═══════════════════════════════════════════\n');
  
  const testBar = `BROWSER-${Date.now().toString().slice(-6)}`;
  const testEmail = `browserlawyer${Date.now()}@test.com`;
  
  // Step 1: Navigate to registration
  console.log('1. Opening registration page...');
  await page.goto(`${BASE_URL}/register?role=lawyer`);
  await page.waitForTimeout(3000);
  
  // Step 2: Fill the form
  console.log('2. Filling form...');
  await page.fill('input[placeholder*="Jane Doe"]', 'Browser Test Lawyer');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'TestPass123!');
  await page.fill('input[placeholder*="Bar Number"]', testBar);
  await page.selectOption('select', 'Victoria');
  
  console.log(`   Email: ${testEmail}`);
  console.log(`   Bar: ${testBar}`);
  
  // Step 3: Submit
  console.log('3. Submitting...');
  await page.click('button[type="submit"]');
  
  // Wait for redirect
  await page.waitForTimeout(6000);
  
  const currentUrl = page.url();
  console.log(`   Redirected to: ${currentUrl}`);
  
  // Check where we ended up
  if (currentUrl.includes('/pending')) {
    console.log('   ✅ Redirected to /pending - CORRECT');
  } else if (currentUrl.includes('/lawyer/dashboard')) {
    console.log('   ❌ Redirected to /lawyer/dashboard - AUTO APPROVED!');
  } else if (currentUrl.includes('/dashboard')) {
    console.log('   ℹ️  Redirected to /dashboard');
  }
  
  await page.screenshot({ path: 'test-results/browser-reg-result.png', fullPage: true });
  
  // Step 4: Check database status via API
  console.log('\n4. Checking database status...');
  
  // Need to use the anon key to check
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';
  
  // Wait for database to sync
  await page.waitForTimeout(3000);
  
  // Use fetch to check status
  const response = await page.evaluate(async (barNumber, apiKey) => {
    const res = await fetch(`https://zogfvzzizbbmmmnlzxdg.supabase.co/rest/v1/lawyer_profiles?bar_number=eq.${barNumber}&select=verification_status,is_verified`, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return res.json();
  }, testBar, ANON_KEY);
  
  console.log(`   Database response: ${JSON.stringify(response)}`);
  
  if (response?.[0]?.verification_status === 'approved') {
    console.log('\n   ❌❌❌ AUTO APPROVED IN DATABASE! ❌❌❌');
  } else if (response?.[0]?.verification_status === 'pending') {
    console.log('\n   ✅ CORRECTLY PENDING IN DATABASE');
  } else {
    console.log('\n   ⚠️  Could not verify status');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
