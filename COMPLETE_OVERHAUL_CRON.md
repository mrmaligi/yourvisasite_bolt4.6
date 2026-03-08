# UI/UX Overhaul - Complete All Pages Cron Job
# This cron job will systematically modernize all remaining pages

name: complete-all-pages-overhaul
schedule: every 10 minutes
sessionTarget: isolated

task: |
  ## UI/UX OVERHAUL - COMPLETE ALL REMAINING PAGES
  
  ### Current Status: 15 of 183 pages completed (8%)
  ### Target: 100% completion with square-shaped V2 design
  
  ## Phase 1: Complete Public Pages (49 remaining)
  Priority order:
  1. ForumHomePage, ForumCategoryPage, ForumTopicPage
  2. NewsDetail, SuccessStoriesPage
  3. Marketplace, Checkout, Success
  4. EligibilityQuizPage
  5. Guides, Checklists, Templates, Webinars, Podcast, Events
  6. Partners, Press, ApiDocs
  7. CareersPage, Community
  8. HelpCenter, HelpArticle, HelpCategory, ContactSupport
  9. Landing, Welcome, Tour, Tutorials
  10. DirectLogin, ForgotPassword, ResetPassword
  
  ## Phase 2: User Dashboard Pages (54 remaining)
  Priority order:
  1. UserDashboard (main)
  2. MyVisas, SavedVisas
  3. MyDocuments, DocumentChecklist
  4. Consultations, BookConsultation
  5. UserPremiumContent, UserMarketplacePurchases
  6. UserSettings, UserProfile
  7. Referrals
  8. Welcome, Tour, GettingStarted
  9. VisaRoadmap, ApplicationTimeline, DeadlineAlerts
  10. All remaining user pages
  
  ## Phase 3: Lawyer Portal (26 remaining)
  Priority order:
  1. LawyerDashboard (main)
  2. LawyerClients, ClientDetail
  3. LawyerConsultations
  4. Availability
  5. Marketing
  6. LawyerTracker, LawyerNews
  7. LawyerMarketplace
  8. LawyerSettings, LawyerTeam
  9. LawyerCases, LawyerDocuments, LawyerNotes
  10. All remaining lawyer pages
  
  ## Phase 4: Admin Panel (29 remaining)
  Priority order:
  1. AdminDashboard (main)
  2. UserManagement
  3. LawyerManagement
  4. VisaManagement, AdminVisaEdit, VisaImport
  5. Content, Pages, Blog
  6. PremiumContent
  7. NewsManagement
  8. TrackerManagement
  9. Bookings, Pricing, PromoCodeManagement
  10. All remaining admin pages
  
  ## Design Requirements for ALL Pages:
  - SQUARE shapes (border-radius: 0)
  - Clean, minimal aesthetic
  - Consistent spacing (4px grid)
  - Blue (#2563EB) primary color
  - Slate background (#F8FAFC)
  - NO glassmorphism
  - NO rounded corners
  
  ## Success Criteria:
  - All 183 pages have V2 versions
  - App.tsx updated to use V2 imports
  - Build passes without errors
  - Playwright tests pass for all pages
  - Zero JavaScript errors in console
  
  ## Estimated Time:
  - 168 pages × 5 minutes = 840 minutes = 14 hours
  - With parallel processing: ~6-8 hours
  - Cron interval: Every 10 minutes
  - Completion ETA: 6-8 hours from start
  
  ## Progress Tracking:
  Update OVERHAUL_STATUS.json after each batch:
  {
    "totalPages": 183,
    "completedV2": 15,
    "remaining": 168,
    "percentage": 8,
    "lastBatch": "timestamp",
    "nextBatch": "pages_to_update"
  }
