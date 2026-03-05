import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('Quiz Page Test', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  TESTING QUIZ PAGE');
  console.log('═══════════════════════════════════════════\n');
  
  // Capture errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ ${msg.text()}`);
    }
  });
  
  await page.goto(`${BASE_URL}/quiz`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('📍 URL:', page.url());
  console.log('📄 Title:', await page.title());
  
  // Check for quiz elements
  const hasHeading = await page.locator('h1, h2').isVisible().catch(() => false);
  const hasQuestions = await page.locator('text=/question|quiz|visa|eligible/i').count() > 0;
  const hasButtons = await page.locator('button').count() > 0;
  
  console.log('');
  console.log('✅ Page elements:');
  console.log(`  Heading visible: ${hasHeading}`);
  console.log(`  Quiz content: ${hasQuestions}`);
  console.log(`  Buttons: ${hasButtons}`);
  
  // Get page text
  const text = await page.locator('body').innerText();
  console.log(`  Contains 'Quiz': ${text.includes('Quiz')}`);
  console.log(`  Contains 'Visa': ${text.includes('Visa')}`);
  console.log(`  Contains 'Eligible': ${text.includes('Eligible')}`);
  
  await page.screenshot({ path: 'test-results/quiz-page.png', fullPage: true });
  
  if (errors.length === 0) {
    console.log('\n✅ No console errors');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
