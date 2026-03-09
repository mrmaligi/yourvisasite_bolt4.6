
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { GlobalSearchProvider } from './contexts/GlobalSearchContext';
import { GlobalSearch } from './components/GlobalSearch';
import { PublicLayout } from './components/layout/PublicLayout';
import { UserDashboardLayout } from './components/layout/UserDashboardLayout';
import { LawyerDashboardLayout } from './components/layout/LawyerDashboardLayout';
import { AdminDashboardLayout } from './components/layout/AdminDashboardLayout';
import { ProtectedRoute, RoleRedirect } from './components/auth/RoleGuard';
import { Loading } from './components/ui/Loading';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

const Landing = lazy(() => import('./pages/public/HomeV2').then(m => ({ default: m.HomeV2 })));
const Checkout = lazy(() => import('./pages/public/CheckoutV2').then(m => ({ default: m.CheckoutV2 })));
const UnifiedLogin = lazy(() => import('./pages/public/LoginV2').then(m => ({ default: m.LoginV2 })));
const Register = lazy(() => import('./pages/public/RegisterV2').then(m => ({ default: m.RegisterV2 })));
const VisaSearch = lazy(() => import('./pages/public/VisaSearchV2').then(m => ({ default: m.VisaSearchV2 })));
const VisaCompare = lazy(() => import('./pages/public/VisaComparisonV2').then(m => ({ default: m.VisaComparisonV2 })));
const VisaDetail = lazy(() => import('./pages/public/VisaDetailV2').then(m => ({ default: m.VisaDetailV2 })));
const Tracker = lazy(() => import('./pages/public/TrackerV2').then(m => ({ default: m.TrackerV2 })));
const LawyerDirectory = lazy(() => import('./pages/public/LawyerDirectoryV2').then(m => ({ default: m.LawyerDirectoryV2 })));
const LawyerProfile = lazy(() => import('./pages/public/LawyerProfileV2').then(m => ({ default: m.LawyerProfileV2 })));
const News = lazy(() => import('./pages/public/NewsV2').then(m => ({ default: m.NewsV2 })));
const NewsDetail = lazy(() => import('./pages/public/NewsDetailV2').then(m => ({ default: m.NewsDetailV2 })));
const PublicMarketplace = lazy(() => import('./pages/public/MarketplaceV2').then(m => ({ default: m.MarketplaceV2 })));
const Success = lazy(() => import('./pages/SuccessV2').then(m => ({ default: m.SuccessV2 })));
const Pricing = lazy(() => import('./pages/public/PricingV2').then(m => ({ default: m.PricingV2 })));
const EligibilityQuizPage = lazy(() => import('./pages/public/EligibilityQuizV2').then(m => ({ default: m.EligibilityQuizV2 })));
const SuccessStoriesPage = lazy(() => import('./pages/public/SuccessStoriesPageV2').then(m => ({ default: m.SuccessStoriesPageV2 })));
const AboutPage = lazy(() => import('./pages/public/AboutV2').then(m => ({ default: m.AboutV2 })));
const ContactPage = lazy(() => import('./pages/public/ContactV2').then(m => ({ default: m.ContactV2 })));
const FAQPage = lazy(() => import('./pages/public/FAQV2').then(m => ({ default: m.FAQV2 })));
const HelpCenterPage = lazy(() => import('./pages/public/HelpCenterV2').then(m => ({ default: m.HelpCenterV2 })));
const TermsPage = lazy(() => import('./pages/public/TermsV2').then(m => ({ default: m.TermsV2 })));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyV2').then(m => ({ default: m.PrivacyV2 })));
const CareersPage = lazy(() => import('./pages/public/CareersV2').then(m => ({ default: m.CareersV2 })));
const ForumHomePage = lazy(() => import('./pages/public/ForumHomePageV2').then(m => ({ default: m.ForumHomePageV2 })));
const ForumCategoryPage = lazy(() => import('./pages/public/ForumCategoryPageV2').then(m => ({ default: m.ForumCategoryPageV2 })));
const ForumTopicPage = lazy(() => import('./pages/public/ForumTopicPageV2').then(m => ({ default: m.ForumTopicPageV2 })));
const LawyerRegister = lazy(() => import('./pages/lawyer/LawyerRegisterV2').then(m => ({ default: m.LawyerRegisterV2 })));
const LawyerPending = lazy(() => import('./pages/lawyer/LawyerPendingV2').then(m => ({ default: m.LawyerPendingV2 })));

// Password Reset Pages
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));

const Resources = lazy(() => import('./pages/public/ResourcesV2').then(m => ({ default: m.ResourcesV2 })));
const Guides = lazy(() => import('./pages/public/GuidesV2').then(m => ({ default: m.GuidesV2 })));
const Checklists = lazy(() => import('./pages/public/ChecklistsV2').then(m => ({ default: m.ChecklistsV2 })));
const Templates = lazy(() => import('./pages/public/Templates').then(m => ({ default: m.Templates })));
const Webinars = lazy(() => import('./pages/public/Webinars').then(m => ({ default: m.Webinars })));
const Podcast = lazy(() => import('./pages/public/Podcast').then(m => ({ default: m.Podcast })));
const Events = lazy(() => import('./pages/public/Events').then(m => ({ default: m.Events })));
const Partners = lazy(() => import('./pages/public/Partners').then(m => ({ default: m.Partners })));
const Press = lazy(() => import('./pages/public/Press').then(m => ({ default: m.Press })));
const ApiDocs = lazy(() => import('./pages/public/ApiDocs').then(m => ({ default: m.ApiDocs })));

const UserDashboard = lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const MyVisas = lazy(() => import('./pages/user/MyVisasV2').then(m => ({ default: m.MyVisasV2 })));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments').then(m => ({ default: m.MyDocuments })));
const Consultations = lazy(() => import('./pages/user/ConsultationsV2').then(m => ({ default: m.ConsultationsV2 })));
const BookConsultation = lazy(() => import('./pages/user/BookConsultation').then(m => ({ default: m.BookConsultation })));
const UserPremiumContent = lazy(() => import('./pages/user/PremiumContent').then(m => ({ default: m.PremiumContent })));
const UserMarketplacePurchases = lazy(() => import('./pages/user/MarketplacePurchases').then(m => ({ default: m.MarketplacePurchases })));
const UserSettings = lazy(() => import('./pages/user/UserSettingsV2').then(m => ({ default: m.UserSettingsV2 })));
const SavedVisas = lazy(() => import('./pages/user/SavedVisasV2').then(m => ({ default: m.SavedVisasV2 })));
const Referrals = lazy(() => import('./pages/user/Referrals').then(m => ({ default: m.Referrals })));

const Welcome = lazy(() => import('./pages/user/Welcome').then(m => ({ default: m.Welcome })));
const Tour = lazy(() => import('./pages/user/Tour').then(m => ({ default: m.Tour })));
const GettingStarted = lazy(() => import('./pages/user/GettingStarted').then(m => ({ default: m.GettingStarted })));
const VisaRoadmap = lazy(() => import('./pages/user/VisaRoadmap').then(m => ({ default: m.VisaRoadmap })));
const DocumentChecklist = lazy(() => import('./pages/user/DocumentChecklist').then(m => ({ default: m.DocumentChecklist })));
const ApplicationTimeline = lazy(() => import('./pages/user/ApplicationTimeline').then(m => ({ default: m.ApplicationTimeline })));
const DeadlineAlerts = lazy(() => import('./pages/user/DeadlineAlerts').then(m => ({ default: m.DeadlineAlerts })));
const UserProfile = lazy(() => import('./pages/user/Profile').then(m => ({ default: m.Profile })));
const Notifications = lazy(() => import('./pages/user/Notifications').then(m => ({ default: m.Notifications })));
const Billing = lazy(() => import('./pages/user/BillingV2').then(m => ({ default: m.BillingV2 })));

const PortalLanding = lazy(() => import('./pages/lawyer/PortalLandingV2').then(m => ({ default: m.PortalLandingV2 })));
const LawyerDashboard = lazy(() => import('./pages/lawyer/LawyerDashboardV2').then(m => ({ default: m.LawyerDashboardV2 })));
const LawyerClients = lazy(() => import('./pages/lawyer/ClientsV2').then(m => ({ default: m.ClientsV2 })));
const LawyerConsultations = lazy(() => import('./pages/lawyer/ConsultationsV2').then(m => ({ default: m.ConsultationsV2 })));
const Availability = lazy(() => import('./pages/lawyer/AvailabilityV2').then(m => ({ default: m.AvailabilityV2 })));
const Marketing = lazy(() => import('./pages/lawyer/MarketingV2').then(m => ({ default: m.MarketingV2 })));
const LawyerTracker = lazy(() => import('./pages/lawyer/LawyerTrackerV2').then(m => ({ default: m.LawyerTrackerV2 })));
const LawyerNews = lazy(() => import('./pages/lawyer/LawyerNewsV2').then(m => ({ default: m.LawyerNewsV2 })));
const LawyerMarketplace = lazy(() => import('./pages/lawyer/MarketplaceV2').then(m => ({ default: m.MarketplaceV2 })));
const LawyerSettings = lazy(() => import('./pages/lawyer/LawyerSettingsV2').then(m => ({ default: m.LawyerSettingsV2 })));
const LawyerTeam = lazy(() => import('./pages/lawyer/TeamV2').then(m => ({ default: m.TeamV2 })));
const LawyerCases = lazy(() => import('./pages/lawyer/CasesV2').then(m => ({ default: m.CasesV2 })));
const LawyerDocuments = lazy(() => import('./pages/lawyer/DocumentsV2').then(m => ({ default: m.DocumentsV2 })));
const LawyerNotes = lazy(() => import('./pages/lawyer/NotesV2').then(m => ({ default: m.NotesV2 })));
const LawyerLeadCapture = lazy(() => import('./pages/lawyer/LeadCaptureV2').then(m => ({ default: m.LeadCaptureV2 })));
const LawyerTestimonials = lazy(() => import('./pages/lawyer/TestimonialsV2').then(m => ({ default: m.TestimonialsV2 })));
const LawyerClientDetail = lazy(() => import('./pages/lawyer/ClientDetail').then(m => ({ default: m.ClientDetail })));
const LawyerDocumentDashboard = lazy(() => import('./pages/lawyer/DocumentDashboard').then(m => ({ default: m.DocumentDashboard })));

// Premium Visa Page
const PartnerVisaPremium = lazy(() => import('./pages/visas/PartnerVisaPremium').then(m => ({ default: m.default })));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboardV2').then(m => ({ default: m.AdminDashboardV2 })));
const AdminContent = lazy(() => import('./pages/admin/ContentV2').then(m => ({ default: m.ContentV2 })));
const AdminPages = lazy(() => import('./pages/admin/PagesV2').then(m => ({ default: m.PagesV2 })));
const AdminBlog = lazy(() => import('./pages/admin/BlogV2').then(m => ({ default: m.BlogV2 })));
const AdminActivityLog = lazy(() => import('./pages/admin/ActivityLogV2').then(m => ({ default: m.ActivityLogV2 })));
const UserManagement = lazy(() => import('./pages/admin/UserManagementV2').then(m => ({ default: m.UserManagementV2 })));
const LawyerManagement = lazy(() => import('./pages/admin/LawyerManagementV2').then(m => ({ default: m.LawyerManagementV2 })));
const VisaManagement = lazy(() => import('./pages/admin/VisaManagementV2').then(m => ({ default: m.VisaManagementV2 })));
const AdminVisaEdit = lazy(() => import('./pages/admin/VisaEditV2').then(m => ({ default: m.VisaEditV2 })));
const VisaImport = lazy(() => import('./pages/admin/VisaImportV2').then(m => ({ default: m.VisaImportV2 })));
const PremiumContent = lazy(() => import('./pages/admin/PremiumContentV2').then(m => ({ default: m.PremiumContentV2 })));
const NewsManagement = lazy(() => import('./pages/admin/NewsManagementV2').then(m => ({ default: m.NewsManagementV2 })));
const TrackerManagement = lazy(() => import('./pages/admin/TrackerManagementV2').then(m => ({ default: m.TrackerManagementV2 })));
const AdminPricing = lazy(() => import('./pages/admin/PricingV2').then(m => ({ default: m.PricingV2 })));
const PromoCodeManagement = lazy(() => import('./pages/admin/PromoCodeManagementV2').then(m => ({ default: m.PromoCodeManagementV2 })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettingsV2').then(m => ({ default: m.AdminSettingsV2 })));
const YouTubeManagement = lazy(() => import('./pages/admin/YouTubeManagementV2').then(m => ({ default: m.YouTubeManagementV2 })));
const PerformanceRouter = lazy(() => import('./pages/admin/performance/PerformanceRouter').then(m => ({ default: m.PerformanceRouter })));
const Bookings = lazy(() => import('./pages/admin/BookingsV2').then(m => ({ default: m.BookingsV2 })));

const AdminContentArticles = lazy(() => import('./pages/admin/content/Articles').then(m => ({ default: m.Articles })));
const AdminContentCreateArticle = lazy(() => import('./pages/admin/content/CreateArticle').then(m => ({ default: m.CreateArticle })));
const AdminContentEditArticle = lazy(() => import('./pages/admin/content/EditArticle').then(m => ({ default: m.EditArticle })));
const AdminContentMediaLibrary = lazy(() => import('./pages/admin/content/MediaLibrary').then(m => ({ default: m.MediaLibrary })));
const AdminContentCategories = lazy(() => import('./pages/admin/content/Categories').then(m => ({ default: m.Categories })));
const AdminContentTags = lazy(() => import('./pages/admin/content/Tags').then(m => ({ default: m.Tags })));
const AdminContentComments = lazy(() => import('./pages/admin/content/Comments').then(m => ({ default: m.Comments })));
const AdminContentSEO = lazy(() => import('./pages/admin/content/SEO').then(m => ({ default: m.SEO })));
const AdminContentTemplates = lazy(() => import('./pages/admin/content/Templates').then(m => ({ default: m.Templates })));
const AdminContentWorkflow = lazy(() => import('./pages/admin/content/Workflow').then(m => ({ default: m.Workflow })));
const AdminUsersUserList = lazy(() => import('./pages/admin/users/UserList').then(m => ({ default: m.UserList })));
const AdminUsersCreateUser = lazy(() => import('./pages/admin/users/CreateUser').then(m => ({ default: m.CreateUser })));
const AdminUsersEditUser = lazy(() => import('./pages/admin/users/EditUser').then(m => ({ default: m.EditUser })));
const AdminUsersRoles = lazy(() => import('./pages/admin/users/Roles').then(m => ({ default: m.Roles })));
const AdminUsersPermissions = lazy(() => import('./pages/admin/users/Permissions').then(m => ({ default: m.Permissions })));
const AdminUsersGroups = lazy(() => import('./pages/admin/users/Groups').then(m => ({ default: m.Groups })));
const AdminUsersActivity = lazy(() => import('./pages/admin/users/Activity').then(m => ({ default: m.Activity })));
const AdminUsersBannedUsers = lazy(() => import('./pages/admin/users/BannedUsers').then(m => ({ default: m.BannedUsers })));
const AdminUsersVerificationRequests = lazy(() => import('./pages/admin/users/VerificationRequests').then(m => ({ default: m.VerificationRequests })));
const AdminUsersInvitations = lazy(() => import('./pages/admin/users/Invitations').then(m => ({ default: m.Invitations })));
const AdminSupportTickets = lazy(() => import('./pages/admin/support/Tickets').then(m => ({ default: m.Tickets })));
const AdminSupportTicketDetail = lazy(() => import('./pages/admin/support/TicketDetail').then(m => ({ default: m.TicketDetail })));
const AdminSupportKnowledgeBase = lazy(() => import('./pages/admin/support/KnowledgeBase').then(m => ({ default: m.KnowledgeBase })));
const AdminSupportChatLogs = lazy(() => import('./pages/admin/support/ChatLogs').then(m => ({ default: m.ChatLogs })));
const AdminSupportReports = lazy(() => import('./pages/admin/support/Reports').then(m => ({ default: m.Reports })));
const AdminSupportModerationQueue = lazy(() => import('./pages/admin/support/ModerationQueue').then(m => ({ default: m.ModerationQueue })));
const AdminSupportFeedback = lazy(() => import('./pages/admin/support/Feedback').then(m => ({ default: m.Feedback })));
const AdminSupportAutomatedResponses = lazy(() => import('./pages/admin/support/AutomatedResponses').then(m => ({ default: m.AutomatedResponses })));
const AdminSupportEscalations = lazy(() => import('./pages/admin/support/Escalations').then(m => ({ default: m.Escalations })));
const AdminSupportSLADashboard = lazy(() => import('./pages/admin/support/SLADashboard').then(m => ({ default: m.SLADashboard })));
const AdminAnalyticsOverview = lazy(() => import('./pages/admin/analytics/Overview').then(m => ({ default: m.Overview })));
const AdminAnalyticsTraffic = lazy(() => import('./pages/admin/analytics/Traffic').then(m => ({ default: m.Traffic })));
const AdminAnalyticsUsers = lazy(() => import('./pages/admin/analytics/Users').then(m => ({ default: m.Users })));
const AdminAnalyticsRevenue = lazy(() => import('./pages/admin/analytics/Revenue').then(m => ({ default: m.Revenue })));
const AdminAnalyticsContentPerformance = lazy(() => import('./pages/admin/analytics/ContentPerformance').then(m => ({ default: m.ContentPerformance })));
const AdminAnalyticsConversionRates = lazy(() => import('./pages/admin/analytics/ConversionRates').then(m => ({ default: m.ConversionRates })));
const AdminAnalyticsGeography = lazy(() => import('./pages/admin/analytics/Geography').then(m => ({ default: m.Geography })));
const AdminAnalyticsDevices = lazy(() => import('./pages/admin/analytics/Devices').then(m => ({ default: m.Devices })));
const AdminAnalyticsCustomReports = lazy(() => import('./pages/admin/analytics/CustomReports').then(m => ({ default: m.CustomReports })));
const AdminAnalyticsExportData = lazy(() => import('./pages/admin/analytics/ExportData').then(m => ({ default: m.ExportData })));
const AdminSystemSettings = lazy(() => import('./pages/admin/system/Settings').then(m => ({ default: m.Settings })));
const AdminSystemLogs = lazy(() => import('./pages/admin/system/Logs').then(m => ({ default: m.Logs })));
const AdminSystemBackup = lazy(() => import('./pages/admin/system/Backup').then(m => ({ default: m.Backup })));
const AdminSystemSecurity = lazy(() => import('./pages/admin/system/Security').then(m => ({ default: m.Security })));
const AdminSystemIntegrations = lazy(() => import('./pages/admin/system/Integrations').then(m => ({ default: m.Integrations })));
const AdminSystemAPIKeys = lazy(() => import('./pages/admin/system/APIKeys').then(m => ({ default: m.APIKeys })));
const AdminSystemWebhooks = lazy(() => import('./pages/admin/system/Webhooks').then(m => ({ default: m.Webhooks })));
const AdminSystemMaintenance = lazy(() => import('./pages/admin/system/Maintenance').then(m => ({ default: m.Maintenance })));
const AdminSystemNotifications = lazy(() => import('./pages/admin/system/Notifications').then(m => ({ default: m.Notifications })));
const AdminSystemSystemHealth = lazy(() => import('./pages/admin/system/SystemHealth').then(m => ({ default: m.SystemHealth })));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
        <ToastProvider>
          <ErrorBoundary>
            <PWAInstallPrompt />
            <BrowserRouter>
              <GlobalSearchProvider>
                <GlobalSearch />
                <Suspense fallback={<Loading fullScreen />}>
                  <Routes>
                    <Route element={<PublicLayout />}>
                    <Route index element={<Landing />} />
                    <Route path="login" element={<UnifiedLogin />} />
                    <Route path="role-select" element={<RoleRedirect />} />
                    <Route path="register" element={<Register />} />
                    <Route path="register/lawyer" element={<LawyerRegister />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="visas" element={<VisaSearch />} />
                    <Route path="visas/compare" element={<VisaCompare />} />
                    <Route path="visas/:slug" element={<VisaDetail />} />
                    <Route path="visas/:slug/premium" element={<PartnerVisaPremium />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="tracker" element={<Tracker />} />
                    <Route path="lawyers" element={<LawyerDirectory />} />
                    <Route path="lawyers/:id" element={<LawyerProfile />} />
                    <Route path="news" element={<News />} />
                    <Route path="news/:slug" element={<NewsDetail />} />
                    <Route path="marketplace" element={<PublicMarketplace />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="success" element={<Success />} />
                    <Route path="quiz" element={<EligibilityQuizPage />} />
                    <Route path="stories" element={<SuccessStoriesPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="help" element={<HelpCenterPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="careers" element={<CareersPage />} />
                    <Route path="forum" element={<ForumHomePage />} />
                    <Route path="forum/:categorySlug" element={<ForumCategoryPage />} />
                    <Route path="forum/:categorySlug/:topicSlug" element={<ForumTopicPage />} />

                    <Route path="resources" element={<Resources />} />
                    <Route path="resources/guides" element={<Guides />} />
                    <Route path="resources/checklists" element={<Checklists />} />
                    <Route path="resources/templates" element={<Templates />} />
                    <Route path="resources/webinars" element={<Webinars />} />
                    <Route path="resources/podcast" element={<Podcast />} />
                    <Route path="resources/events" element={<Events />} />
                    <Route path="partners" element={<Partners />} />
                    <Route path="press" element={<Press />} />
                    <Route path="api-docs" element={<ApiDocs />} />
                  </Route>

                  {/* User Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboardLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="dashboard/visas" element={<MyVisas />} />
                    <Route path="dashboard/saved" element={<SavedVisas />} />
                    <Route path="dashboard/documents" element={<MyDocuments />} />
                    <Route path="dashboard/consultations" element={<Consultations />} />
                    <Route path="dashboard/book-consultation/:lawyerId" element={<BookConsultation />} />
                    <Route path="dashboard/premium" element={<UserPremiumContent />} />
                    <Route path="dashboard/marketplace" element={<UserMarketplacePurchases />} />
                    <Route path="dashboard/settings" element={<UserSettings />} />
                    <Route path="dashboard/referrals" element={<Referrals />} />

                    {/* New User Pages */}
                    <Route path="dashboard/welcome" element={<Welcome />} />
                    <Route path="dashboard/tour" element={<Tour />} />
                    <Route path="dashboard/getting-started" element={<GettingStarted />} />
                    <Route path="dashboard/roadmap" element={<VisaRoadmap />} />
                    <Route path="dashboard/checklist" element={<DocumentChecklist />} />
                    <Route path="dashboard/timeline" element={<ApplicationTimeline />} />
                    <Route path="dashboard/deadlines" element={<DeadlineAlerts />} />
                    <Route path="dashboard/profile" element={<UserProfile />} />
                    <Route path="dashboard/notifications" element={<Notifications />} />
                    <Route path="dashboard/billing" element={<Billing />} />
                  </Route>

                  {/* Lawyer Routes */}
                  <Route path="lawyer" element={<PortalLanding />} />
                  <Route path="lawyer/pending" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerPending /></ProtectedRoute>} />

                  <Route element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDashboardLayout /></ProtectedRoute>}>
                    <Route path="lawyer/dashboard" element={<LawyerDashboard />} />
                    <Route path="lawyer/clients" element={<LawyerClients />} />
                    <Route path="lawyer/consultations" element={<LawyerConsultations />} />
                    <Route path="lawyer/availability" element={<Availability />} />
                    <Route path="lawyer/marketing" element={<Marketing />} />
                    <Route path="lawyer/tracker" element={<LawyerTracker />} />
                    <Route path="lawyer/news" element={<LawyerNews />} />
                    <Route path="lawyer/marketplace" element={<LawyerMarketplace />} />
                    <Route path="lawyer/settings" element={<LawyerSettings />} />
                    <Route path="lawyer/team" element={<LawyerTeam />} />
                    <Route path="lawyer/cases" element={<LawyerCases />} />
                    <Route path="lawyer/documents" element={<LawyerDocuments />} />
                    <Route path="lawyer/notes" element={<LawyerNotes />} />
                    <Route path="lawyer/leads" element={<LawyerLeadCapture />} />
                    <Route path="lawyer/testimonials" element={<LawyerTestimonials />} />
                    <Route path="lawyer/clients/:id" element={<LawyerClientDetail />} />
                    <Route path="lawyer/clients/:id/documents" element={<LawyerDocumentDashboard />} />
                  </Route>

                  {/* Admin Routes - Wrapped in Layout */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardLayout /></ProtectedRoute>}>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/activity" element={<AdminActivityLog />} />
                    <Route path="admin/users" element={<UserManagement />} />
                    <Route path="admin/lawyers" element={<LawyerManagement />} />
                    <Route path="admin/visas" element={<VisaManagement />} />
<Route path="admin/visas/:id/edit" element={<AdminVisaEdit />} />
<Route path="admin/visas/import" element={<VisaImport />} />
                    <Route path="admin/bookings" element={<Bookings />} />
                    <Route path="admin/premium" element={<PremiumContent />} />
                    <Route path="admin/news" element={<NewsManagement />} />
                    <Route path="admin/youtube" element={<YouTubeManagement />} />
                    <Route path="admin/tracker" element={<TrackerManagement />} />
                    <Route path="admin/pricing" element={<AdminPricing />} />
                    <Route path="admin/promos" element={<PromoCodeManagement />} />
                    <Route path="admin/settings" element={<AdminSettings />} />
                  </Route>

                  {/* Admin Routes - Internal Layout */}
                  <Route path="admin/performance/*" element={<ProtectedRoute allowedRoles={['admin']}><PerformanceRouter /></ProtectedRoute>} />
                  <Route path="admin/content" element={<ProtectedRoute allowedRoles={['admin']}><AdminContent /></ProtectedRoute>} />
                  <Route path="admin/pages" element={<ProtectedRoute allowedRoles={['admin']}><AdminPages /></ProtectedRoute>} />
                  <Route path="admin/blog" element={<ProtectedRoute allowedRoles={['admin']}><AdminBlog /></ProtectedRoute>} />
                  <Route path="admin/content/articles" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentArticles /></ProtectedRoute>} />
                  <Route path="admin/content/create-article" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentCreateArticle /></ProtectedRoute>} />
                  <Route path="admin/content/edit-article" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentEditArticle /></ProtectedRoute>} />
                  <Route path="admin/content/media-library" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentMediaLibrary /></ProtectedRoute>} />
                  <Route path="admin/content/categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentCategories /></ProtectedRoute>} />
                  <Route path="admin/content/tags" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentTags /></ProtectedRoute>} />
                  <Route path="admin/content/comments" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentComments /></ProtectedRoute>} />
                  <Route path="admin/content/seo" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentSEO /></ProtectedRoute>} />
                  <Route path="admin/content/templates" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentTemplates /></ProtectedRoute>} />
                  <Route path="admin/content/workflow" element={<ProtectedRoute allowedRoles={['admin']}><AdminContentWorkflow /></ProtectedRoute>} />
                  <Route path="admin/users/user-list" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersUserList /></ProtectedRoute>} />
                  <Route path="admin/users/create-user" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersCreateUser /></ProtectedRoute>} />
                  <Route path="admin/users/edit-user" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersEditUser /></ProtectedRoute>} />
                  <Route path="admin/users/roles" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersRoles /></ProtectedRoute>} />
                  <Route path="admin/users/permissions" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPermissions /></ProtectedRoute>} />
                  <Route path="admin/users/groups" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersGroups /></ProtectedRoute>} />
                  <Route path="admin/users/activity" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersActivity /></ProtectedRoute>} />
                  <Route path="admin/users/banned-users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersBannedUsers /></ProtectedRoute>} />
                  <Route path="admin/users/verification-requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersVerificationRequests /></ProtectedRoute>} />
                  <Route path="admin/users/invitations" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersInvitations /></ProtectedRoute>} />
                  <Route path="admin/support/tickets" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportTickets /></ProtectedRoute>} />
                  <Route path="admin/support/ticket-detail" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportTicketDetail /></ProtectedRoute>} />
                  <Route path="admin/support/knowledge-base" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportKnowledgeBase /></ProtectedRoute>} />
                  <Route path="admin/support/chat-logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportChatLogs /></ProtectedRoute>} />
                  <Route path="admin/support/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportReports /></ProtectedRoute>} />
                  <Route path="admin/support/moderation-queue" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportModerationQueue /></ProtectedRoute>} />
                  <Route path="admin/support/feedback" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportFeedback /></ProtectedRoute>} />
                  <Route path="admin/support/automated-responses" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportAutomatedResponses /></ProtectedRoute>} />
                  <Route path="admin/support/escalations" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportEscalations /></ProtectedRoute>} />
                  <Route path="admin/support/sla-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportSLADashboard /></ProtectedRoute>} />
                  <Route path="admin/analytics/overview" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsOverview /></ProtectedRoute>} />
                  <Route path="admin/analytics/traffic" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsTraffic /></ProtectedRoute>} />
                  <Route path="admin/analytics/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsUsers /></ProtectedRoute>} />
                  <Route path="admin/analytics/revenue" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsRevenue /></ProtectedRoute>} />
                  <Route path="admin/analytics/content-performance" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsContentPerformance /></ProtectedRoute>} />
                  <Route path="admin/analytics/conversion-rates" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsConversionRates /></ProtectedRoute>} />
                  <Route path="admin/analytics/geography" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsGeography /></ProtectedRoute>} />
                  <Route path="admin/analytics/devices" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsDevices /></ProtectedRoute>} />
                  <Route path="admin/analytics/custom-reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsCustomReports /></ProtectedRoute>} />
                  <Route path="admin/analytics/export-data" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsExportData /></ProtectedRoute>} />
                  <Route path="admin/system/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemSettings /></ProtectedRoute>} />
                  <Route path="admin/system/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemLogs /></ProtectedRoute>} />
                  <Route path="admin/system/backup" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemBackup /></ProtectedRoute>} />
                  <Route path="admin/system/security" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemSecurity /></ProtectedRoute>} />
                  <Route path="admin/system/integrations" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemIntegrations /></ProtectedRoute>} />
                  <Route path="admin/system/api-keys" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemAPIKeys /></ProtectedRoute>} />
                  <Route path="admin/system/webhooks" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemWebhooks /></ProtectedRoute>} />
                  <Route path="admin/system/maintenance" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemMaintenance /></ProtectedRoute>} />
                  <Route path="admin/system/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemNotifications /></ProtectedRoute>} />
                  <Route path="admin/system/system-health" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemSystemHealth /></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </GlobalSearchProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </ToastProvider>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
