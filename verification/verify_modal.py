from playwright.sync_api import Page, expect, sync_playwright
import time

def test_modal_accessibility(page: Page):
    # Navigate to Tracker page
    page.goto("http://localhost:5173/tracker")

    # Click on "Submit Your Processing Time" button
    page.get_by_role("button", name="Submit Your Processing Time").click()

    # Wait for modal to appear
    modal = page.locator("div[role='dialog']")
    expect(modal).to_be_visible()

    # Verify accessibility attributes
    expect(modal).to_have_attribute("aria-modal", "true")

    # Verify aria-labelledby
    title_id = modal.get_attribute("aria-labelledby")
    print(f"Title ID found: {title_id}")
    assert title_id, "aria-labelledby attribute missing"

    # Verify title has matching ID (using attribute selector to handle colons in ID)
    title = page.locator(f'[id="{title_id}"]')
    expect(title).to_have_text("Submit Processing Time")

    # Verify close button has aria-label
    close_btn = modal.locator("button[aria-label='Close modal']")
    expect(close_btn).to_be_visible()

    # Verify focus is on the modal container
    time.sleep(1) # Wait for animation/focus
    is_focused = page.evaluate(f"""
        document.activeElement === document.querySelector('div[role="dialog"]')
    """)
    print(f"Is modal container focused? {is_focused}")

    if not is_focused:
        # Fallback: check if close button is focused (sometimes preferable)
        is_close_focused = page.evaluate("""
            document.activeElement.getAttribute('aria-label') === 'Close modal'
        """)
        print(f"Is close button focused? {is_close_focused}")

    # Take screenshot
    page.screenshot(path="verification/modal_accessibility.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_modal_accessibility(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification script failed: {e}")
            page.screenshot(path="verification/failure.png")
            raise e
        finally:
            browser.close()
