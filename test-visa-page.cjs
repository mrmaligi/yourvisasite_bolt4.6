const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to visa page...');
  try {
    await page.goto('https://www.yourvisasite.com/visas/aee2382a-6e20-4164-9b94-3425c20363e4', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }
  
  // Wait for content
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/visa-page-test.png', fullPage: true });
  console.log('Screenshot saved');
  
  // Analyze page
  const analysis = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      title: document.title,
      url: window.location.href,
      hasError: text.includes('Error') || text.includes('Failed') || text.includes('Something went wrong'),
      hasPremiumBanner: text.includes('Unlock Premium') || text.includes('Unlock Now'),
      hasDocumentSection: text.includes('Document Checklist'),
      hasUnlockButton: text.includes('Unlock Document'),
      sectionCount: (text.match(/Section \d+/g) || []).length,
      premiumCount: (text.match(/Premium/g) || []).length,
      firstParagraph: text.substring(0, 500)
    };
  });
  
  console.log('\n=== PAGE ANALYSIS ===');
  console.log('Title:', analysis.title);
  console.log('URL:', analysis.url);
  console.log('Has Error:', analysis.hasError);
  console.log('Has Premium Banner:', analysis.hasPremiumBanner);
  console.log('Has Document Section:', analysis.hasDocumentSection);
  console.log('Has Unlock Button:', analysis.hasUnlockButton);
  console.log('Section mentions:', analysis.sectionCount);
  console.log('Premium mentions:', analysis.premiumCount);
  console.log('\nFirst 500 chars:', analysis.firstParagraph);
  
  // Check console errors
  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));
  
  await page.waitForTimeout(2000);
  
  console.log('\n=== CONSOLE ERRORS ===');
  const errors = logs.filter(l => l.type === 'error' || l.type === 'pageerror');
  if (errors.length > 0) {
    errors.forEach(e => console.log(e.type + ':', e.text.substring(0, 200)));
  } else {
    console.log('No console errors found');
  }
  
  await browser.close();
})();
