from playwright.sync_api import sync_playwright

def verify_public_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Verify Lawyer Directory
        print("Navigating to Lawyer Directory...")
        page.goto("http://localhost:5173/lawyers")
        page.wait_for_load_state("networkidle")

        # Take screenshot
        page.screenshot(path="/home/jules/verification/lawyer_directory.png")
        print("Screenshot saved to /home/jules/verification/lawyer_directory.png")

        browser.close()

if __name__ == "__main__":
    verify_public_pages()
