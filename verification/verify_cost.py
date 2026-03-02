import sys
import json
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Mock the Supabase response for visas
    def handle_visas_route(route):
        url = route.request.url
        print(f"Intercepted: {url}")

        if "id=eq.1" in url:
             # Detail page
            response_body = {
                "id": "1",
                "subclass": "186",
                "name": "Employer Nomination Scheme",
                "country": "Australia",
                "category": "work",
                "base_cost_aud": 4770,
                "is_active": True,
                "description": "Mock Visa",
                "summary": "Mock Visa Summary",
                "processing_time_range": "3-6 months",
                "official_link": "https://immi.homeaffairs.gov.au",
                "duration": "Permanent"
            }
            # Handle single object response expectation
            headers = route.request.headers
            if "application/vnd.pgrst.object+json" in headers.get("accept", ""):
                 route.fulfill(status=200, content_type="application/json", body=json.dumps(response_body))
            else:
                 route.fulfill(status=200, content_type="application/json", body=json.dumps([response_body]))
        else:
            # Search page
            response_body = [
                {
                    "id": "1",
                    "subclass": "186",
                    "name": "Employer Nomination Scheme",
                    "country": "Australia",
                    "category": "work",
                    "base_cost_aud": 4770,
                    "is_active": True,
                    "description": "Mock Visa",
                    "summary": "Mock Visa Summary"
                }
            ]
            route.fulfill(status=200, content_type="application/json", body=json.dumps(response_body))

    # Mock other potential calls to avoid errors
    page.route("**/rest/v1/tracker_stats*", lambda route: route.fulfill(status=200, body=json.dumps([])))
    page.route("**/rest/v1/products*", lambda route: route.fulfill(status=200, body=json.dumps([])))
    page.route("**/rest/v1/user_visa_purchases*", lambda route: route.fulfill(status=200, body=json.dumps([])))
    page.route("**/rest/v1/tracker_entries*", lambda route: route.fulfill(status=200, body=json.dumps([])))
    page.route("**/rest/v1/news_articles*", lambda route: route.fulfill(status=200, body=json.dumps([])))

    page.route("**/rest/v1/visas*", handle_visas_route)

    try:
        print("Navigating to Visa Search...")
        page.goto("http://localhost:5173/visas")
        page.wait_for_selector("text=Employer Nomination Scheme", timeout=10000)

        # Check if cost is formatted correctly ($4,770)
        # Using a relaxed text match because it might be in a span or div
        if page.get_by_text("$4,770").count() > 0:
            print("Visa Search: SUCCESS - Cost formatted correctly as $4,770")
        else:
            print("Visa Search: FAILURE - Cost not found")

        print("Navigating to Visa Detail...")
        page.goto("http://localhost:5173/visas/1")
        page.wait_for_selector("text=Employer Nomination Scheme", timeout=10000)

        # Check cost on detail page
        # It might be in the header or the grid
        if page.get_by_text("$4,770").count() > 0:
            print("Visa Detail: SUCCESS - Cost formatted correctly as $4,770")
        else:
            print("Visa Detail: FAILURE - Cost not found")

        page.screenshot(path="verification.png", full_page=True)
        print("Screenshot saved to verification.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
