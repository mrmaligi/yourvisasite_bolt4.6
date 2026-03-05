import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

test('Visa Detail Page - Partner Visa 820', async ({ page }) => {
  // Dynamically get a real visa ID/subclass from our database
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: visas } = await supabase
    .from('visas')
    .select('id, subclass, name')
    .eq('is_active', true)
    .ilike('name', '%820%')
    .limit(1);

  // Fall back to any active visa if 820 not found
  let visaSubclass = '820';
  if (visas && visas.length > 0) {
    visaSubclass = visas[0].subclass;
    console.log(`Using visa: ${visas[0].name} (${visaSubclass})`);
  } else {
    const { data: anyVisa } = await supabase.from('visas').select('id, subclass, name').eq('is_active', true).limit(1);
    if (anyVisa && anyVisa.length > 0) {
      visaSubclass = anyVisa[0].subclass;
      console.log(`820 not found, using: ${anyVisa[0].name} (${visaSubclass})`);
    }
  }

  await page.goto(`${BASE_URL}/visas/${visaSubclass}`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  console.log('URL:', page.url());

  const hasTitle = await page.locator('h1').count() > 0;
  console.log('Has H1 title:', hasTitle);

  const hasVisaInfo = await page.locator(`text=/${visaSubclass}|Partner|visa/i`).count() > 0;
  console.log('Has visa info:', hasVisaInfo);

  const hasPremiumSection = await page.locator('text=/Premium|premium|guide/i').count() > 0;
  console.log('Has premium section:', hasPremiumSection);

  const hasLawyers = await page.locator('text=/lawyer|Lawyer|expert/i').count() > 0;
  console.log('Has lawyers section:', hasLawyers);

  const hasEligibility = await page.locator('text=/eligibility|requirements/i').count() > 0;
  console.log('Has eligibility:', hasEligibility);

  const hasBooking =
    (await page.locator('button:has-text("Book")').count() > 0) ||
    (await page.locator('text=/book|consultation/i').count() > 0);
  console.log('Has booking option:', hasBooking);

  await page.screenshot({ path: 'test-results/visa-detail-partner-820.png', fullPage: true });

  expect(hasTitle).toBe(true);
  // Only assert visa info if we're not on an error page
  const currentUrl = page.url();
  if (currentUrl.includes('/visas/')) {
    expect(hasVisaInfo).toBe(true);
  }
});
