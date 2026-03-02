import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto("http://localhost:5173/login")

            # Wait for key elements to load
            await page.wait_for_selector('text=Welcome Back')
            await page.wait_for_selector('text=Sign in to your VisaBuild account')

            # Check for the three login options
            # Using specific text content for robustness if exact role not working
            await page.wait_for_selector('text=Applicant')
            await page.wait_for_selector('text=Lawyer')
            await page.wait_for_selector('text=Admin')

            # Check form elements
            await page.wait_for_selector('input[type="email"]')
            await page.wait_for_selector('input[type="password"]')
            await page.wait_for_selector('button:has-text("Sign In")')

            # Take screenshot
            await page.screenshot(path="verification/login_page.png")
            print("✅ Login UI verified and screenshot taken.")

        except Exception as e:
            print(f"❌ Verification failed: {e}")
            await page.screenshot(path="verification/login_failure.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
