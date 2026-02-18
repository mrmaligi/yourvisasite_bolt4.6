import re
from playwright.sync_api import sync_playwright, expect
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture logs
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PageError: {err}"))

    # Mock API Responses
    def handle_lawyer_profile_array(route):
        print("MATCHED: Lawyer Profile")
        route.fulfill(
             status=200,
             content_type="application/json",
             body='[{"id": "lawyer-123", "profile_id": "user-123", "jurisdiction": "Mars", "practice_areas": ["Space Law"], "years_experience": 10, "bio": "Expert in space immigration.", "hourly_rate_cents": 5000, "bar_number": "12345"}]'
        )

    def handle_public_profile_array(route):
        print("MATCHED: Public Profile")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "lawyer-123", "full_name": "Martian Lawyer", "avatar_url": null}]'
        )

    def handle_user_profile(route):
         print("MATCHED: User Profile")
         route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "user-999", "full_name": "Test User", "avatar_url": null}]'
        )

    def handle_slots(route):
        print("MATCHED: Slots")
        import datetime
        tomorrow = (datetime.datetime.now() + datetime.timedelta(days=1)).isoformat()
        route.fulfill(
            status=200,
            content_type="application/json",
            body=f'[{"{id}": "slot-1", "lawyer_id": "lawyer-123", "start_time": "{tomorrow}", "end_time": "{tomorrow}", "is_booked": false}]'.replace('"{id}"', '"id"')
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

    def handle_user_docs(route):
        print("MATCHED: User Docs")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "doc-1", "file_name": "My Passport.pdf", "user_id": "user-999", "status": "verified"}]'
        )

    def handle_auth_user(route):
        print("MATCHED: Auth User")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"id": "user-999", "email": "test@example.com", "role": "authenticated", "aud": "authenticated"}'
        )

    # Routes
    page.route("**/rest/v1/profiles?select=*&id=eq.lawyer-123*", handle_lawyer_profile_array)
    page.route("**/rest/v1/profiles?select=*&id=eq.user-123*", handle_public_profile_array)
    page.route("**/rest/v1/profiles?select=*&id=eq.user-999*", handle_user_profile)
    page.route("**/rest/v1/consultation_slots*", handle_slots)
    page.route("**/rest/v1/visa_prices*", handle_visa_prices)
    page.route("**/rest/v1/visas*", handle_visas)
    page.route("**/rest/v1/user_documents*", handle_user_docs)
    page.route("**/auth/v1/user*", handle_auth_user)

    page.goto("http://localhost:5173/")

    fake_session = {
        "access_token": "fake-token",
        "refresh_token": "fake-refresh",
        "user": {
            "id": "user-999",
            "email": "test@example.com"
        }
    }

    # Corrected JS injection
    page.evaluate(f"""() => {{
        const session = {json.dumps(fake_session)};
        localStorage.setItem('sb-localhost-auth-token', JSON.stringify(session));
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    }}""")

    print("Navigating to Booking Page...")
    try:
        page.goto("http://localhost:5173/dashboard/book-consultation/lawyer-123")
        page.wait_for_timeout(5000)

        content = page.content()

        if "Book Consultation" in content:
            print("SUCCESS: On Booking Page.")

            # Check for new features
            expect(page.get_by_text("Visa Type (Optional)")).to_be_visible()
            print("SUCCESS: Visa Dropdown found.")

            expect(page.get_by_text("Questions for Lawyer")).to_be_visible()
            print("SUCCESS: Questions field found.")

            expect(page.get_by_text("Share Documents")).to_be_visible()
            print("SUCCESS: Share Documents section found.")

            page.get_by_text("Share Documents").click()
            expect(page.get_by_text("My Passport.pdf")).to_be_visible()
            print("SUCCESS: Documents list expandable.")

            page.screenshot(path="verification_booking.png")

        else:
            print("FAILED: Not on Booking Page.")
            page.screenshot(path="failed_booking.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_booking.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
