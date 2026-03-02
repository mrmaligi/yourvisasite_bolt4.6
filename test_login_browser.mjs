import { chromium } from '@playwright/test';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE ERROR: ${msg.text()}`);
        } else {
            console.log(`PAGE LOG: ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`PAGE EXCEPTION: ${error.message}\n${error.stack}`);
    });

    console.log("Navigating to login...");
    try {
        await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
        console.log("Waiting for network to settle...");
        await page.waitForTimeout(2000);

        console.log("Filling form...");
        await page.fill('input[type="email"]', 'user1@visabuild.test');
        await page.fill('input[type="password"]', 'TestPass123!');

        console.log("Submitting...");
        await page.click('button[type="submit"]');

        // Wait a bit for the error to occur
        await page.waitForTimeout(3000);
        console.log("Done waiting.");
    } catch (err) {
        console.error("Script error:", err);
    } finally {
        await browser.close();
    }
})();
