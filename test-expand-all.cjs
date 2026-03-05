const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== EXPANDING ALL SECTIONS ===\n');
  
  await page.goto('https://www.yourvisasite.com/visas/aee2382a-6e20-4164-9b94-3425c20363e4', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(2000);
  
  // Click all section buttons to expand them
  const buttons = await page.locator('button').all();
  console.log('Total buttons found:', buttons.length);
  
  let expanded = 0;
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    try {
      const text = await buttons[i].textContent();
      if (text && (text.includes('Section') || text.includes('Overview') || text.includes('Requirements'))) {
        await buttons[i].click();
        await page.waitForTimeout(500);
        expanded++;
      }
    } catch (e) {}
  }
  console.log('Expanded', expanded, 'sections\n');
  
  await page.waitForTimeout(2000);
  
  // Check full page content
  const content = await page.evaluate(() => {
    return {
      fullText: document.body.innerText,
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText),
      cards: document.querySelectorAll('.card, [class*="Card"]').length,
      buttons: document.querySelectorAll('button').length,
      badges: Array.from(document.querySelectorAll('[class*="badge"], [class*="Badge"]')).map(b => b.innerText)
    };
  });
  
  console.log('=== FULL CONTENT ANALYSIS ===');
  console.log('\nHeadings found:');
  content.headings.slice(0, 10).forEach(h => console.log('  -', h.substring(0, 50)));
  
  console.log('\nCards found:', content.cards);
  console.log('Buttons found:', content.buttons);
  
  console.log('\nBadges:');
  content.badges.slice(0, 10).forEach(b => console.log('  -', b));
  
  // Check for specific content
  console.log('\n=== CONTENT CHECKS ===');
  const text = content.fullText;
  const checks = [
    ['Subclass 101', text.includes('Subclass 101') || text.includes('101')],
    ['AUD $3,055', text.includes('$3,055') || text.includes('3,055')],
    ['24 months', text.includes('24 months') || text.includes('months')],
    ['Permanent Resident', text.includes('Permanent Resident')],
    ['Key Requirements', text.includes('Key Requirements') || text.includes('Requirements')],
    ['Document Checklist', text.includes('Document Checklist')],
    ['Unlock Premium', text.includes('Unlock Premium')],
    ['Executive Overview', text.includes('Executive Overview')],
    ['Eligibility', text.includes('Eligibility')],
    ['Processing Times', text.includes('Processing Times')]
  ];
  
  checks.forEach(([name, found]) => {
    console.log(`  ${name}:`, found ? '✅' : '❌');
  });
  
  // Take expanded screenshot
  await page.screenshot({ path: '/home/openclaw/.openclaw/workspace/visa-expanded.png', fullPage: true });
  console.log('\n✅ Expanded screenshot saved');
  
  await browser.close();
})();
