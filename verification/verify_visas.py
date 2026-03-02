from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Visa Search
        print("Navigating to Visa Search...")
        page.goto("http://localhost:5173/visas")
        page.wait_for_load_state("networkidle")

        # Take screenshot of search
        page.screenshot(path="verification/visas_search.png")
        print("Screenshot of search taken.")

        # Navigate to a visa detail (assume one exists, e.g. first card)
        # Click the first card
        # Wait for cards to load (skeleton gone)
        page.wait_for_selector(".grid .relative")

        cards = page.locator(".grid .relative")
        count = cards.count()
        if count > 0:
            print(f"Found {count} visas.")
            cards.first.click()
            page.wait_for_load_state("networkidle")
            # Wait for detail content
            page.wait_for_selector("h1")
            page.screenshot(path="verification/visa_detail.png")
            print("Screenshot of detail taken.")
        else:
            print("No visas found on search page.")

        browser.close()

if __name__ == "__main__":
    run()
