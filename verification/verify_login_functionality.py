import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            print("Navigating to login...")
            await page.goto("http://localhost:5173/login")

            # User Login
            print("Attempting User Login...")
            await page.fill('input[type="email"]', 'user1@visabuild.test')
            await page.fill('input[type="password"]', 'TestPass123!')
            await page.click('button:has-text("Sign In")')

            # Wait for redirection to dashboard
            try:
                await page.wait_for_url("**/dashboard", timeout=10000)
                print("✅ User Login Redirect Successful")
                await page.screenshot(path="verification/user_dashboard_success.png")
            except Exception as e:
                print(f"❌ User Login Redirect Failed: {e}")
                await page.screenshot(path="verification/user_login_failed.png")

            # Logout
            # Assuming hard logout for test speed if UI is complex
            await page.goto("http://localhost:5173/login")

            # Lawyer Login
            print("Attempting Lawyer Login...")
            await page.click('text=Lawyer')
            await page.fill('input[type="email"]', 'lawyer1@visabuild.test')
            await page.fill('input[type="password"]', 'TestPass123!')
            await page.click('button:has-text("Sign In")')

            try:
                await page.wait_for_url("**/lawyer/dashboard", timeout=10000)
                print("✅ Lawyer Login Redirect Successful")
                await page.screenshot(path="verification/lawyer_dashboard_success.png")
            except Exception as e:
                print(f"❌ Lawyer Login Redirect Failed: {e}")
                await page.screenshot(path="verification/lawyer_login_failed.png")

             # Logout
            await page.goto("http://localhost:5173/login")

             # Admin Login
            print("Attempting Admin Login...")
            await page.click('text=Admin')
            await page.fill('input[type="email"]', 'admin1@visabuild.test')
            await page.fill('input[type="password"]', 'TestPass123!')
            await page.click('button:has-text("Sign In")')

            try:
                await page.wait_for_url("**/admin", timeout=10000)
                print("✅ Admin Login Redirect Successful")
                await page.screenshot(path="verification/admin_dashboard_success.png")
            except Exception as e:
                print(f"❌ Admin Login Redirect Failed: {e}")
                await page.screenshot(path="verification/admin_login_failed.png")


        except Exception as e:
            print(f"❌ Verification script error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
