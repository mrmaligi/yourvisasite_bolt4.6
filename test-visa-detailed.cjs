const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== TESTING VISA PAGE ===\n');
  
  await page.goto('https://www.yourvisasite.com/visas/aee2382a-6e20-4164-9b94-3425c20363e4', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(3000);
  
  // Test 1: Check expand/collapse functionality
  console.log('TEST 1: Section Expand/Collapse');
  const sections = await page.locator('button:has-text("Section")').all();
  console.log('  Found', sections.length, 'section buttons');
  
  if (sections.length > 0) {
    try {
      await sections[0].click();
      await page.waitForTimeout(1000);
      console.log('  ✅ Section clicked successfully');
    } catch (e) {
      console.log('  ❌ Error clicking section:', e.message);
    }
  }
  
  // Test 2: Check Premium Banner
  console.log('\nTEST 2: Premium Banner');
  const premiumBanner = await page.locator('text=Unlock Premium Guide').first();
  const isVisible = await premiumBanner.isVisible().catch(() => false);
  console.log('  Premium banner visible:', isVisible ? '✅' : '❌');
  
  // Test 3: Check Document Checklist
  console.log('\nTEST 3: Document Checklist');
  const docChecklist = await page.locator('text=Document Checklist').first();
  const docVisible = await docChecklist.isVisible().catch(() => false);
  console.log('  Document checklist visible:', docVisible ? '✅' : '❌');
  
  // Test 4: Check Unlock button
  console.log('\nTEST 4: Unlock Button');
  const unlockBtn = await page.locator('button:has-text("Unlock")').first();
  const unlockVisible = await unlockBtn.isVisible().catch(() => false);
  console.log('  Unlock button visible:', unlockVisible ? '✅' : '❌');
  
  if (unlockVisible) {
    try {
      await unlockBtn.click();
      await page.waitForTimeout(2000);
      const url = page.url();
      console.log('  URL after click:', url.includes('checkout') ? '✅ Navigated to checkout' : '⚠️ Still on same page');
    } catch (e) {
      console.log('  ❌ Error clicking unlock:', e.message);
    }
  }
  
  // Test 5: Check all content sections
  console.log('\nTEST 5: Content Sections');
  const contentCards = await page.locator('section').all();
  console.log('  Found', contentCards.length, 'sections');
  
  // Test 6: Check for missing data
  console.log('\nTEST 6: Data Completeness');
  const pageText = await page.evaluate(() => document.body.innerText);
  
  const checks = [
    { name: 'Visa Name', text: 'Child' },
    { name: 'Subclass', text: '101' },
    { name: 'Cost', text: '$3,055' },
    { name: 'Processing', text: 'months' },
    { name: 'Key Requirements', text: 'Requirements' },
    { name: 'Executive Overview', text: 'Executive' },
  ];
  
  checks.forEach(check => {
    const found = pageText.includes(check.text);
    console.log(`  ${check.name}:`, found ? '✅' : '❌');
  });
  
  // Test 7: Check for layout issues
  console.log('\nTEST 7: Layout Issues');
  const hasOverlapping = await page.evaluate(() => {
    const cards = document.querySelectorAll('.card, [class*="card"]');
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return true;
    }
    return false;
  });
  console.log('  Layout issues:', hasOverlapping ? '❌ Found' : '✅ None');
  
  // Take final screenshot
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/visa-test-final.png', fullPage: true });
  console.log('\n✅ Final screenshot saved');
  
  await browser.close();
})();
