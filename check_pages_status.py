import os

pages = [
    # User
    'src/pages/user/Welcome.tsx',
    'src/pages/user/Tour.tsx',
    'src/pages/user/GettingStarted.tsx',
    'src/pages/user/VisaRoadmap.tsx',
    'src/pages/user/DocumentChecklist.tsx',
    'src/pages/user/ApplicationTimeline.tsx',
    'src/pages/user/DeadlineAlerts.tsx',
    'src/pages/user/Profile.tsx',
    'src/pages/user/Notifications.tsx',
    'src/pages/user/Billing.tsx',
    'src/pages/user/MyVisas.tsx',
    'src/pages/user/MyDocuments.tsx',
    'src/pages/user/Consultations.tsx',
    'src/pages/user/BookConsultation.tsx',
    'src/pages/user/PremiumContent.tsx',
    'src/pages/user/SavedVisas.tsx',
    'src/pages/user/UserSettings.tsx',
    'src/pages/user/Referrals.tsx',
    'src/pages/user/MarketplacePurchases.tsx',

    # Lawyer
    'src/pages/lawyer/PortalLanding.tsx',
    'src/pages/lawyer/LawyerRegister.tsx',
    'src/pages/lawyer/LawyerPending.tsx',
    'src/pages/lawyer/LawyerDashboard.tsx',
    'src/pages/lawyer/Clients.tsx',
    'src/pages/lawyer/Consultations.tsx',
    'src/pages/lawyer/Availability.tsx',
    'src/pages/lawyer/Marketing.tsx',
    'src/pages/lawyer/LawyerTracker.tsx',
    'src/pages/lawyer/LawyerNews.tsx',
    'src/pages/lawyer/Marketplace.tsx',
    'src/pages/lawyer/LawyerSettings.tsx',
    'src/pages/lawyer/Team.tsx',
    'src/pages/lawyer/Cases.tsx',
    'src/pages/lawyer/Documents.tsx',
    'src/pages/lawyer/Notes.tsx',
    'src/pages/lawyer/LeadCapture.tsx',
    'src/pages/lawyer/Testimonials.tsx',
    'src/pages/lawyer/ClientDetail.tsx',

    # Admin
    'src/pages/admin/AdminDashboard.tsx',
    'src/pages/admin/Content.tsx',
    'src/pages/admin/Pages.tsx',
    'src/pages/admin/Blog.tsx',
    'src/pages/admin/ActivityLog.tsx',
    'src/pages/admin/UserManagement.tsx',
    'src/pages/admin/LawyerManagement.tsx',
    'src/pages/admin/VisaManagement.tsx',
    'src/pages/admin/PremiumContent.tsx',
    'src/pages/admin/NewsManagement.tsx',
    'src/pages/admin/YouTubeManagement.tsx',
    'src/pages/admin/TrackerManagement.tsx',
    'src/pages/admin/Pricing.tsx',
    'src/pages/admin/PromoCodeManagement.tsx',
    'src/pages/admin/AdminSettings.tsx',
]

print(f"Checking {len(pages)} pages...")

for page in pages:
    if not os.path.exists(page):
        print(f"MISSING: {page}")
    else:
        size = os.path.getsize(page)
        if size < 200:
            print(f"EMPTY/SMALL: {page} ({size} bytes)")
        else:
            # print(f"OK: {page} ({size} bytes)")
            pass
