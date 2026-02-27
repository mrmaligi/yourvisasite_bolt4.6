
import asyncio
from playwright.async_api import async_playwright, expect

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Visit Login Page and check accessibility attributes
        await page.goto("http://localhost:5173/login")
        await page.wait_for_load_state("networkidle")

        # Check Applicant button has aria-pressed
        applicant_btn = page.get_by_role("button", name="Applicant")
        await expect(applicant_btn).to_have_attribute("aria-pressed", "true")

        # Check Lawyer button has aria-pressed
        lawyer_btn = page.get_by_role("button", name="Lawyer")
        await expect(lawyer_btn).to_have_attribute("aria-pressed", "false")

        # Check Password toggle has aria-label
        # Note: We need to locate it carefully as it's an icon button inside the input wrapper
        # The accessible name should be "Show password" initially
        password_toggle = page.get_by_role("button", name="Show password")
        await expect(password_toggle).to_be_visible()

        # Take screenshot of Login page
        await page.screenshot(path="verification/login_accessibility.png")
        print("Login page accessibility verified.")

        # 2. Visit Register Page and check password toggle
        await page.goto("http://localhost:5173/register")
        await page.wait_for_load_state("networkidle")

        register_pw_toggle = page.get_by_role("button", name="Show password")
        await expect(register_pw_toggle).to_be_visible()

        # Click to toggle and check label changes
        await register_pw_toggle.click()
        register_pw_toggle_hidden = page.get_by_role("button", name="Hide password")
        await expect(register_pw_toggle_hidden).to_be_visible()

        await page.screenshot(path="verification/register_accessibility.png")
        print("Register page accessibility verified.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
