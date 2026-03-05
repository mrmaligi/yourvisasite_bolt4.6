const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to visa page...');
  await page.goto('https://www.yourvisasite.com/visas/aee2382a-6e20-4164-9b94-3425c20363e4', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  // Wait for content to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'visa-page-test.png', fullPage: true });
  console.log('Screenshot saved: visa-page-test.png');
  
  // Check for errors
  const errors = await page.evaluate(() => {
    return {
      title: document.title,
      hasError: document.body.innerText.includes('Error') || document.body.innerText.includes('Failed'),
      hasPremiumBanner: document.body.innerText.includes('Unlock Premium'),
      hasDocumentChecklist: document.body.innerText.includes('Document Checklist'),
      contentText: document.body.innerText.substring(0, 1000)
    };
  });
  
  console.log('\n=== PAGE ANALYSIS ===');
  console.log('Title:', errors.title);
  console.log('Has Error:', errors.hasError);
  console.log('Has Premium Banner:', errors.hasPremiumBanner);
  console.log('Has Document Checklist:', errors.hasDocumentChecklist);
  console.log('\nFirst 1000 chars:', errors.contentText);
  
  await browser.close();
})();
