from playwright.sync_api import sync_playwright
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Mock Data
    user_id = "test-user-id-123"
    email = "test@visabuild.com"

    # Track if correct query was made
    query_by_id_made = False
    query_by_email_made = False

    def handle_route(route):
        url = route.request.url
        print(f"Request: {url}")

        # Mock SignIn
        if "token?grant_type=password" in url:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({
                    "access_token": "fake-access-token",
                    "token_type": "bearer",
                    "expires_in": 3600,
                    "refresh_token": "fake-refresh-token",
                    "user": {
                        "id": user_id,
                        "aud": "authenticated",
                        "role": "authenticated",
                        "email": email,
                        "phone": "",
                        "confirmation_sent_at": "2023-01-01T00:00:00.000000Z",
                        "app_metadata": {
                            "provider": "email",
                            "providers": ["email"]
                        },
                        "user_metadata": {},
                        "identities": [],
                        "created_at": "2023-01-01T00:00:00.000000Z",
                        "updated_at": "2023-01-01T00:00:00.000000Z"
                    }
                })
            )
            return

        # Mock GetUser
        if "/auth/v1/user" in url:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({
                    "id": user_id,
                    "aud": "authenticated",
                    "role": "authenticated",
                    "email": email
                })
            )
            return

        # Check for Profile Query
        if "/rest/v1/profiles" in url:
            # Decode URL to check query params easily
            decoded_url = url.replace("%2C", ",").replace("%28", "(").replace("%29", ")")

            nonlocal query_by_id_made, query_by_email_made
            if f"id=eq.{user_id}" in decoded_url:
                print("SUCCESS: Query by ID detected!")
                query_by_id_made = True

            if f"email=eq.{email}" in decoded_url:
                print("FAILURE: Query by EMAIL detected!")
                query_by_email_made = True

            # Return a valid profile so login completes
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({
                    "role": "user",
                    "is_active": True,
                    "lawyer_profiles": []
                })
            )
            return

        route.continue_()

    # Intercept all requests
    page.route("**/*", handle_route)

    # Go to login page
    page.goto("http://localhost:5173/login")

    # Fill in credentials
    page.get_by_placeholder("you@example.com").fill(email)
    page.get_by_placeholder("••••••••").fill("Test123456!")

    # Click Sign In
    page.locator("form button[type='submit']").click()

    # Wait for network requests to happen
    page.wait_for_timeout(3000)

    # Verify results
    if query_by_id_made and not query_by_email_made:
        print("VERIFICATION PASSED: Login flow uses user ID for profile lookup.")
    elif query_by_email_made:
        print("VERIFICATION FAILED: Login flow still uses EMAIL for profile lookup.")
    else:
        print("VERIFICATION FAILED: No relevant profile lookup detected.")

    # Screenshot
    page.screenshot(path="verification_result.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
