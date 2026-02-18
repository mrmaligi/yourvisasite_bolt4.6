import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture logs
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PageError: {err}"))

    # Log requests
    # page.route("**/*", lambda route: route.continue_())

    # Mock API Responses
    def handle_lawyer_profile_array(route):
        print("MATCHED: Lawyer Profile Array")
        route.fulfill(
             status=200,
             content_type="application/json",
             body='[{"id": "lawyer-123", "profile_id": "user-123", "jurisdiction": "Mars", "practice_areas": ["Space Law"], "years_experience": 10, "bio": "Expert in space immigration.", "hourly_rate_cents": 5000, "bar_number": "12345"}]'
        )

    def handle_public_profile_array(route):
        print("MATCHED: Public Profile Array")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "user-123", "full_name": "Martian Lawyer", "avatar_url": null}]'
        )

    def handle_slots(route):
        print("MATCHED: Slots")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[]'
        )

    def handle_visa_prices(route):
        print("MATCHED: Visa Prices")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"visa_id": "visa-a", "hourly_rate_cents": 7500}]'
        )

    def handle_visas(route):
        print("MATCHED: Visas")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "visa-a", "name": "Space Visa"}]'
        )

    # Lawyer Profile
    page.route("**/rest/v1/profiles?select=*&id=eq.lawyer-123*", handle_lawyer_profile_array)
    page.route("**/rest/v1/profiles?select=*&id=eq.user-123*", handle_public_profile_array)
    page.route("**/rest/v1/consultation_slots*", handle_slots)
    page.route("**/rest/v1/visa_prices*", handle_visa_prices)
    page.route("**/rest/v1/visas*", handle_visas)

    print("Navigating to Lawyer Profile...")
    try:
        page.goto("http://localhost:5173/lawyers/lawyer-123")
        page.wait_for_timeout(5000)

        # Check content
        content = page.content()

        if "Martian Lawyer" in content:
            print("SUCCESS: Martian Lawyer found.")
        else:
            print("FAILED: Martian Lawyer not found.")

        # Assertions
        expect(page.get_by_text("Martian Lawyer")).to_be_visible()
        expect(page.get_by_text("Specialized Visa Rates")).to_be_visible()
        expect(page.get_by_text("Space Visa")).to_be_visible()
        expect(page.get_by_text("$75/hr")).to_be_visible()

        print("Lawyer Profile verification successful!")
        page.screenshot(path="verification_lawyer_profile.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_lawyer_profile.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
