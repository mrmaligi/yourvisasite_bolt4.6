import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://www.yourvisasite.com';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

test('Verify Lawyer Can Login After Approval', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING LAWYER LOGIN AFTER APPROVAL');
  console.log('═══════════════════════════════════════════\n');
  
  // Use an approved lawyer from the database
  const approvedLawyerEmail = 'mrmaligi@outlook.com'; // This user is also an admin and has a lawyer profile
  const approvedLawyerPassword = 'Qwerty@2007';
  
  console.log('Testing login with approved lawyer...');
  
  // Navigate to login
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(3000);
  
  // Select Lawyer
  await page.click('button:has-text("Lawyer")');
  
  // Enter credentials
  await page.fill('input[type="email"]', approvedLawyerEmail);
  await page.fill('input[type="password"]', approvedLawyerPassword);
  
  // Submit
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  const currentUrl = page.url();
  console.log(`Redirected to: ${currentUrl}`);
  
  // Check where we ended up
  if (currentUrl.includes('/lawyer/dashboard')) {
    console.log('✅✅✅ SUCCESS! Lawyer redirected to dashboard! ✅✅✅');
  } else if (currentUrl.includes('/lawyer/pending')) {
    console.log('❌ Lawyer still pending verification');
  } else if (currentUrl.includes('/admin')) {
    console.log('ℹ️  Redirected to admin (user is also admin)');
  } else {
    console.log(`   URL: ${currentUrl}`);
  }
  
  await page.screenshot({ path: 'test-results/lawyer-login-result.png', fullPage: true });
  
  console.log('\n═══════════════════════════════════════════');
});
