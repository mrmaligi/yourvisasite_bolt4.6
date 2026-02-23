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
import { ProtectedRoute, RoleRedirect } from './components/auth/RoleGuard';
import { Loading } from './components/ui/Loading';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const UnifiedLogin = lazy(() => import('./pages/public/UnifiedLogin').then(m => ({ default: m.UnifiedLogin })));
const Register = lazy(() => import('./pages/public/Register').then(m => ({ default: m.Register })));
const VisaSearch = lazy(() => import('./pages/public/VisaSearch').then(m => ({ default: m.VisaSearch })));
const VisaCompare = lazy(() => import('./pages/public/VisaCompare').then(m => ({ default: m.VisaCompare })));
const VisaDetail = lazy(() => import('./pages/public/VisaDetail').then(m => ({ default: m.VisaDetail })));
const Tracker = lazy(() => import('./pages/public/Tracker').then(m => ({ default: m.Tracker })));
const LawyerDirectory = lazy(() => import('./pages/public/LawyerDirectory').then(m => ({ default: m.LawyerDirectory })));
const LawyerProfile = lazy(() => import('./pages/public/LawyerProfile').then(m => ({ default: m.LawyerProfile })));
const News = lazy(() => import('./pages/public/News').then(m => ({ default: m.News })));
const NewsDetail = lazy(() => import('./pages/public/NewsDetail').then(m => ({ default: m.NewsDetail })));
const PublicMarketplace = lazy(() => import('./pages/public/Marketplace').then(m => ({ default: m.Marketplace })));
const Success = lazy(() => import('./pages/Success').then(m => ({ default: m.Success })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const EligibilityQuizPage = lazy(() => import('./pages/public/EligibilityQuizPage').then(m => ({ default: m.EligibilityQuizPage })));
const SuccessStoriesPage = lazy(() => import('./pages/public/SuccessStoriesPage').then(m => ({ default: m.SuccessStoriesPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/public/FAQPage').then(m => ({ default: m.FAQPage })));
const TermsPage = lazy(() => import('./pages/public/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const CareersPage = lazy(() => import('./pages/public/CareersPage').then(m => ({ default: m.CareersPage })));
const ForumHomePage = lazy(() => import('./pages/public/ForumHomePage').then(m => ({ default: m.ForumHomePage })));
const ForumCategoryPage = lazy(() => import('./pages/public/ForumCategoryPage').then(m => ({ default: m.ForumCategoryPage })));
const ForumTopicPage = lazy(() => import('./pages/public/ForumTopicPage').then(m => ({ default: m.ForumTopicPage })));
const LawyerRegister = lazy(() => import('./pages/lawyer/LawyerRegister').then(m => ({ default: m.LawyerRegister })));
const LawyerPending = lazy(() => import('./pages/lawyer/LawyerPending').then(m => ({ default: m.LawyerPending })));

const Resources = lazy(() => import('./pages/public/Resources').then(m => ({ default: m.Resources })));
const Guides = lazy(() => import('./pages/public/Guides').then(m => ({ default: m.Guides })));
const Checklists = lazy(() => import('./pages/public/Checklists').then(m => ({ default: m.Checklists })));
const Templates = lazy(() => import('./pages/public/Templates').then(m => ({ default: m.Templates })));
const Webinars = lazy(() => import('./pages/public/Webinars').then(m => ({ default: m.Webinars })));
const Podcast = lazy(() => import('./pages/public/Podcast').then(m => ({ default: m.Podcast })));
const Events = lazy(() => import('./pages/public/Events').then(m => ({ default: m.Events })));
const Partners = lazy(() => import('./pages/public/Partners').then(m => ({ default: m.Partners })));
const Press = lazy(() => import('./pages/public/Press').then(m => ({ default: m.Press })));
const ApiDocs = lazy(() => import('./pages/public/ApiDocs').then(m => ({ default: m.ApiDocs })));

const UserDashboard = lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const MyVisas = lazy(() => import('./pages/user/MyVisas').then(m => ({ default: m.MyVisas })));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments').then(m => ({ default: m.MyDocuments })));
const Consultations = lazy(() => import('./pages/user/Consultations').then(m => ({ default: m.Consultations })));
const BookConsultation = lazy(() => import('./pages/user/BookConsultation').then(m => ({ default: m.BookConsultation })));
const UserPremiumContent = lazy(() => import('./pages/user/PremiumContent').then(m => ({ default: m.PremiumContent })));
const UserMarketplacePurchases = lazy(() => import('./pages/user/MarketplacePurchases').then(m => ({ default: m.MarketplacePurchases })));
const UserSettings = lazy(() => import('./pages/user/UserSettings').then(m => ({ default: m.UserSettings })));
const SavedVisas = lazy(() => import('./pages/user/SavedVisas').then(m => ({ default: m.SavedVisas })));
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
const Billing = lazy(() => import('./pages/user/Billing').then(m => ({ default: m.Billing })));

const PortalLanding = lazy(() => import('./pages/lawyer/PortalLanding').then(m => ({ default: m.PortalLanding })));
const LawyerDashboard = lazy(() => import('./pages/lawyer/LawyerDashboard').then(m => ({ default: m.LawyerDashboard })));
const LawyerClients = lazy(() => import('./pages/lawyer/Clients').then(m => ({ default: m.Clients })));
const LawyerConsultations = lazy(() => import('./pages/lawyer/Consultations').then(m => ({ default: m.LawyerConsultations })));
const Availability = lazy(() => import('./pages/lawyer/Availability').then(m => ({ default: m.Availability })));
const Marketing = lazy(() => import('./pages/lawyer/Marketing').then(m => ({ default: m.Marketing })));
const LawyerTracker = lazy(() => import('./pages/lawyer/LawyerTracker').then(m => ({ default: m.LawyerTracker })));
const LawyerNews = lazy(() => import('./pages/lawyer/LawyerNews').then(m => ({ default: m.LawyerNews })));
const LawyerMarketplace = lazy(() => import('./pages/lawyer/Marketplace').then(m => ({ default: m.Marketplace })));
const LawyerSettings = lazy(() => import('./pages/lawyer/LawyerSettings').then(m => ({ default: m.LawyerSettings })));
const LawyerTeam = lazy(() => import('./pages/lawyer/Team').then(m => ({ default: m.Team })));
const LawyerCases = lazy(() => import('./pages/lawyer/Cases').then(m => ({ default: m.Cases })));
const LawyerDocuments = lazy(() => import('./pages/lawyer/Documents').then(m => ({ default: m.Documents })));
const LawyerNotes = lazy(() => import('./pages/lawyer/Notes').then(m => ({ default: m.Notes })));
const LawyerLeadCapture = lazy(() => import('./pages/lawyer/LeadCapture').then(m => ({ default: m.LeadCapture })));
const LawyerTestimonials = lazy(() => import('./pages/lawyer/Testimonials').then(m => ({ default: m.Testimonials })));
const LawyerClientDetail = lazy(() => import('./pages/lawyer/ClientDetail').then(m => ({ default: m.ClientDetail })));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminContent = lazy(() => import('./pages/admin/Content').then(m => ({ default: m.Content })));
const AdminPages = lazy(() => import('./pages/admin/Pages').then(m => ({ default: m.Pages })));
const AdminBlog = lazy(() => import('./pages/admin/Blog').then(m => ({ default: m.Blog })));
const AdminActivityLog = lazy(() => import('./pages/admin/ActivityLog').then(m => ({ default: m.ActivityLog })));
const UserManagement = lazy(() => import('./pages/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const LawyerManagement = lazy(() => import('./pages/admin/LawyerManagement').then(m => ({ default: m.LawyerManagement })));
const VisaManagement = lazy(() => import('./pages/admin/VisaManagement').then(m => ({ default: m.VisaManagement })));
const PremiumContent = lazy(() => import('./pages/admin/PremiumContent').then(m => ({ default: m.PremiumContent })));
const NewsManagement = lazy(() => import('./pages/admin/NewsManagement').then(m => ({ default: m.NewsManagement })));
const TrackerManagement = lazy(() => import('./pages/admin/TrackerManagement').then(m => ({ default: m.TrackerManagement })));
const AdminPricing = lazy(() => import('./pages/admin/Pricing').then(m => ({ default: m.Pricing })));
const PromoCodeManagement = lazy(() => import('./pages/admin/PromoCodeManagement').then(m => ({ default: m.PromoCodeManagement })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const YouTubeManagement = lazy(() => import('./pages/admin/YouTubeManagement').then(m => ({ default: m.YouTubeManagement })));

// Integrations
const IntegrationsDashboard = lazy(() => import('./pages/admin/integrations/IntegrationsDashboard').then(m => ({ default: m.IntegrationsDashboard })));
const GoogleIntegration = lazy(() => import('./pages/admin/integrations/platforms/GoogleIntegration').then(m => ({ default: m.GoogleIntegration })));
const MicrosoftIntegration = lazy(() => import('./pages/admin/integrations/platforms/MicrosoftIntegration').then(m => ({ default: m.MicrosoftIntegration })));
const SlackIntegration = lazy(() => import('./pages/admin/integrations/platforms/SlackIntegration').then(m => ({ default: m.SlackIntegration })));
const ZoomIntegration = lazy(() => import('./pages/admin/integrations/platforms/ZoomIntegration').then(m => ({ default: m.ZoomIntegration })));
const SalesforceIntegration = lazy(() => import('./pages/admin/integrations/platforms/SalesforceIntegration').then(m => ({ default: m.SalesforceIntegration })));
const HubSpotIntegration = lazy(() => import('./pages/admin/integrations/platforms/HubSpotIntegration').then(m => ({ default: m.HubSpotIntegration })));
const StripeIntegration = lazy(() => import('./pages/admin/integrations/platforms/StripeIntegration').then(m => ({ default: m.StripeIntegration })));
const PayPalIntegration = lazy(() => import('./pages/admin/integrations/platforms/PayPalIntegration').then(m => ({ default: m.PayPalIntegration })));
const ZapierIntegration = lazy(() => import('./pages/admin/integrations/platforms/ZapierIntegration').then(m => ({ default: m.ZapierIntegration })));
const MailchimpIntegration = lazy(() => import('./pages/admin/integrations/platforms/MailchimpIntegration').then(m => ({ default: m.MailchimpIntegration })));
const DropboxIntegration = lazy(() => import('./pages/admin/integrations/platforms/DropboxIntegration').then(m => ({ default: m.DropboxIntegration })));
const JiraIntegration = lazy(() => import('./pages/admin/integrations/platforms/JiraIntegration').then(m => ({ default: m.JiraIntegration })));
const TrelloIntegration = lazy(() => import('./pages/admin/integrations/platforms/TrelloIntegration').then(m => ({ default: m.TrelloIntegration })));
const AsanaIntegration = lazy(() => import('./pages/admin/integrations/platforms/AsanaIntegration').then(m => ({ default: m.AsanaIntegration })));
const NotionIntegration = lazy(() => import('./pages/admin/integrations/platforms/NotionIntegration').then(m => ({ default: m.NotionIntegration })));
const TwilioIntegration = lazy(() => import('./pages/admin/integrations/platforms/TwilioIntegration').then(m => ({ default: m.TwilioIntegration })));
const SendGridIntegration = lazy(() => import('./pages/admin/integrations/platforms/SendGridIntegration').then(m => ({ default: m.SendGridIntegration })));
const AWSIntegration = lazy(() => import('./pages/admin/integrations/platforms/AWSIntegration').then(m => ({ default: m.AWSIntegration })));
const XeroIntegration = lazy(() => import('./pages/admin/integrations/platforms/XeroIntegration').then(m => ({ default: m.XeroIntegration })));
const QuickBooksIntegration = lazy(() => import('./pages/admin/integrations/platforms/QuickBooksIntegration').then(m => ({ default: m.QuickBooksIntegration })));
const ShopifyIntegration = lazy(() => import('./pages/admin/integrations/platforms/ShopifyIntegration').then(m => ({ default: m.ShopifyIntegration })));
const IntercomIntegration = lazy(() => import('./pages/admin/integrations/platforms/IntercomIntegration').then(m => ({ default: m.IntercomIntegration })));

const ApiDashboard = lazy(() => import('./pages/admin/integrations/api/ApiDashboard').then(m => ({ default: m.ApiDashboard })));
const ApiKeys = lazy(() => import('./pages/admin/integrations/api/ApiKeys').then(m => ({ default: m.ApiKeys })));
const ApiLogs = lazy(() => import('./pages/admin/integrations/api/ApiLogs').then(m => ({ default: m.ApiLogs })));
const ApiRateLimits = lazy(() => import('./pages/admin/integrations/api/ApiRateLimits').then(m => ({ default: m.ApiRateLimits })));
const AdminApiDocs = lazy(() => import('./pages/admin/integrations/api/ApiDocs').then(m => ({ default: m.ApiDocs })));
const ApiSettings = lazy(() => import('./pages/admin/integrations/api/ApiSettings').then(m => ({ default: m.ApiSettings })));
const ApiScopes = lazy(() => import('./pages/admin/integrations/api/ApiScopes').then(m => ({ default: m.ApiScopes })));
const ApiTokens = lazy(() => import('./pages/admin/integrations/api/ApiTokens').then(m => ({ default: m.ApiTokens })));

const WebhookDashboard = lazy(() => import('./pages/admin/integrations/webhooks/WebhookDashboard').then(m => ({ default: m.WebhookDashboard })));
const WebhookList = lazy(() => import('./pages/admin/integrations/webhooks/WebhookList').then(m => ({ default: m.WebhookList })));
const WebhookCreate = lazy(() => import('./pages/admin/integrations/webhooks/WebhookCreate').then(m => ({ default: m.WebhookCreate })));
const WebhookEvents = lazy(() => import('./pages/admin/integrations/webhooks/WebhookEvents').then(m => ({ default: m.WebhookEvents })));
const WebhookHistory = lazy(() => import('./pages/admin/integrations/webhooks/WebhookHistory').then(m => ({ default: m.WebhookHistory })));
const WebhookSecurity = lazy(() => import('./pages/admin/integrations/webhooks/WebhookSecurity').then(m => ({ default: m.WebhookSecurity })));
const WebhookRetryPolicy = lazy(() => import('./pages/admin/integrations/webhooks/WebhookRetryPolicy').then(m => ({ default: m.WebhookRetryPolicy })));

const SsoDashboard = lazy(() => import('./pages/admin/integrations/sso/SsoDashboard').then(m => ({ default: m.SsoDashboard })));
const SsoProviders = lazy(() => import('./pages/admin/integrations/sso/SsoProviders').then(m => ({ default: m.SsoProviders })));
const SamlConfiguration = lazy(() => import('./pages/admin/integrations/sso/SamlConfiguration').then(m => ({ default: m.SamlConfiguration })));
const OidcConfiguration = lazy(() => import('./pages/admin/integrations/sso/OidcConfiguration').then(m => ({ default: m.OidcConfiguration })));
const SsoAuditLogs = lazy(() => import('./pages/admin/integrations/sso/SsoAuditLogs').then(m => ({ default: m.SsoAuditLogs })));
const SsoSettings = lazy(() => import('./pages/admin/integrations/sso/SsoSettings').then(m => ({ default: m.SsoSettings })));

const SyncDashboard = lazy(() => import('./pages/admin/integrations/sync/SyncDashboard').then(m => ({ default: m.SyncDashboard })));
const SyncStatus = lazy(() => import('./pages/admin/integrations/sync/SyncStatus').then(m => ({ default: m.SyncStatus })));
const SyncHistory = lazy(() => import('./pages/admin/integrations/sync/SyncHistory').then(m => ({ default: m.SyncHistory })));
const SyncMapping = lazy(() => import('./pages/admin/integrations/sync/SyncMapping').then(m => ({ default: m.SyncMapping })));
const SyncConflicts = lazy(() => import('./pages/admin/integrations/sync/SyncConflicts').then(m => ({ default: m.SyncConflicts })));
const SyncSchedule = lazy(() => import('./pages/admin/integrations/sync/SyncSchedule').then(m => ({ default: m.SyncSchedule })));

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
                    <Route path="visas" element={<VisaSearch />} />
                    <Route path="visas/compare" element={<VisaCompare />} />
                    <Route path="visas/:id" element={<VisaDetail />} />
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

                  {/* User Routes - Each has its own layout */}
                  <Route path="dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />
                  <Route path="dashboard/visas" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyVisas /></ProtectedRoute>} />
                  <Route path="dashboard/saved" element={<ProtectedRoute allowedRoles={['user', 'admin']}><SavedVisas /></ProtectedRoute>} />
                  <Route path="dashboard/documents" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyDocuments /></ProtectedRoute>} />
                  <Route path="dashboard/consultations" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Consultations /></ProtectedRoute>} />
                  <Route path="dashboard/book-consultation/:lawyerId" element={<ProtectedRoute allowedRoles={['user', 'admin']}><BookConsultation /></ProtectedRoute>} />
                  <Route path="dashboard/premium" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserPremiumContent /></ProtectedRoute>} />
                  <Route path="dashboard/marketplace" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserMarketplacePurchases /></ProtectedRoute>} />
                  <Route path="dashboard/settings" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserSettings /></ProtectedRoute>} />
                  <Route path="dashboard/referrals" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Referrals /></ProtectedRoute>} />

                  {/* New User Pages with Layout */}
                  <Route element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboardLayout /></ProtectedRoute>}>
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

                  {/* Lawyer Routes - Each has its own layout */}
                  <Route path="lawyer" element={<PortalLanding />} />
                  <Route path="lawyer/pending" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerPending /></ProtectedRoute>} />
                  <Route path="lawyer/dashboard" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDashboard /></ProtectedRoute>} />
                  <Route path="lawyer/clients" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerClients /></ProtectedRoute>} />
                  <Route path="lawyer/consultations" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerConsultations /></ProtectedRoute>} />
                  <Route path="lawyer/availability" element={<ProtectedRoute allowedRoles={['lawyer']}><Availability /></ProtectedRoute>} />
                  <Route path="lawyer/marketing" element={<ProtectedRoute allowedRoles={['lawyer']}><Marketing /></ProtectedRoute>} />
                  <Route path="lawyer/tracker" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerTracker /></ProtectedRoute>} />
                  <Route path="lawyer/news" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerNews /></ProtectedRoute>} />
                  <Route path="lawyer/marketplace" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerMarketplace /></ProtectedRoute>} />
                  <Route path="lawyer/settings" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerSettings /></ProtectedRoute>} />
                  <Route path="lawyer/team" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerTeam /></ProtectedRoute>} />
                  <Route path="lawyer/cases" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerCases /></ProtectedRoute>} />
                  <Route path="lawyer/documents" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDocuments /></ProtectedRoute>} />
                  <Route path="lawyer/notes" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerNotes /></ProtectedRoute>} />
                  <Route path="lawyer/leads" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerLeadCapture /></ProtectedRoute>} />
                  <Route path="lawyer/testimonials" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerTestimonials /></ProtectedRoute>} />
                  <Route path="lawyer/clients/:id" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerClientDetail /></ProtectedRoute>} />

                  {/* Admin Routes - Each has its own layout */}
                  <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="activity" element={<AdminActivityLog />} />
                    <Route path="admin/content" element={<ProtectedRoute allowedRoles={['admin']}><AdminContent /></ProtectedRoute>} />
                    <Route path="admin/pages" element={<ProtectedRoute allowedRoles={['admin']}><AdminPages /></ProtectedRoute>} />
                    <Route path="admin/blog" element={<ProtectedRoute allowedRoles={['admin']}><AdminBlog /></ProtectedRoute>} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="lawyers" element={<LawyerManagement />} />
                    <Route path="visas" element={<VisaManagement />} />
                    <Route path="premium" element={<PremiumContent />} />
                    <Route path="admin/news" element={<ProtectedRoute allowedRoles={['admin']}><NewsManagement /></ProtectedRoute>} />
                  <Route path="admin/youtube" element={<ProtectedRoute allowedRoles={['admin']}><YouTubeManagement /></ProtectedRoute>} />
                  <Route path="admin/tracker" element={<ProtectedRoute allowedRoles={['admin']}><TrackerManagement /></ProtectedRoute>} />
                  <Route path="admin/pricing" element={<ProtectedRoute allowedRoles={['admin']}><AdminPricing /></ProtectedRoute>} />
                  <Route path="admin/promos" element={<ProtectedRoute allowedRoles={['admin']}><PromoCodeManagement /></ProtectedRoute>} />
                  <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

                  {/* Admin Integrations */}
                  <Route path="admin/integrations" element={<ProtectedRoute allowedRoles={['admin']}><IntegrationsDashboard /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/google" element={<ProtectedRoute allowedRoles={['admin']}><GoogleIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/microsoft" element={<ProtectedRoute allowedRoles={['admin']}><MicrosoftIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/slack" element={<ProtectedRoute allowedRoles={['admin']}><SlackIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/zoom" element={<ProtectedRoute allowedRoles={['admin']}><ZoomIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/salesforce" element={<ProtectedRoute allowedRoles={['admin']}><SalesforceIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/hubspot" element={<ProtectedRoute allowedRoles={['admin']}><HubSpotIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/stripe" element={<ProtectedRoute allowedRoles={['admin']}><StripeIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/paypal" element={<ProtectedRoute allowedRoles={['admin']}><PayPalIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/zapier" element={<ProtectedRoute allowedRoles={['admin']}><ZapierIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/mailchimp" element={<ProtectedRoute allowedRoles={['admin']}><MailchimpIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/dropbox" element={<ProtectedRoute allowedRoles={['admin']}><DropboxIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/jira" element={<ProtectedRoute allowedRoles={['admin']}><JiraIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/trello" element={<ProtectedRoute allowedRoles={['admin']}><TrelloIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/asana" element={<ProtectedRoute allowedRoles={['admin']}><AsanaIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/notion" element={<ProtectedRoute allowedRoles={['admin']}><NotionIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/twilio" element={<ProtectedRoute allowedRoles={['admin']}><TwilioIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/sendgrid" element={<ProtectedRoute allowedRoles={['admin']}><SendGridIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/aws" element={<ProtectedRoute allowedRoles={['admin']}><AWSIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/xero" element={<ProtectedRoute allowedRoles={['admin']}><XeroIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/quickbooks" element={<ProtectedRoute allowedRoles={['admin']}><QuickBooksIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/shopify" element={<ProtectedRoute allowedRoles={['admin']}><ShopifyIntegration /></ProtectedRoute>} />
                  <Route path="admin/integrations/platforms/intercom" element={<ProtectedRoute allowedRoles={['admin']}><IntercomIntegration /></ProtectedRoute>} />

                  <Route path="admin/integrations/api" element={<ProtectedRoute allowedRoles={['admin']}><ApiDashboard /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/keys" element={<ProtectedRoute allowedRoles={['admin']}><ApiKeys /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/logs" element={<ProtectedRoute allowedRoles={['admin']}><ApiLogs /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/limits" element={<ProtectedRoute allowedRoles={['admin']}><ApiRateLimits /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/docs" element={<ProtectedRoute allowedRoles={['admin']}><AdminApiDocs /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/settings" element={<ProtectedRoute allowedRoles={['admin']}><ApiSettings /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/scopes" element={<ProtectedRoute allowedRoles={['admin']}><ApiScopes /></ProtectedRoute>} />
                  <Route path="admin/integrations/api/tokens" element={<ProtectedRoute allowedRoles={['admin']}><ApiTokens /></ProtectedRoute>} />

                  <Route path="admin/integrations/webhooks" element={<ProtectedRoute allowedRoles={['admin']}><WebhookDashboard /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/list" element={<ProtectedRoute allowedRoles={['admin']}><WebhookList /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/create" element={<ProtectedRoute allowedRoles={['admin']}><WebhookCreate /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/events" element={<ProtectedRoute allowedRoles={['admin']}><WebhookEvents /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/history" element={<ProtectedRoute allowedRoles={['admin']}><WebhookHistory /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/security" element={<ProtectedRoute allowedRoles={['admin']}><WebhookSecurity /></ProtectedRoute>} />
                  <Route path="admin/integrations/webhooks/retry" element={<ProtectedRoute allowedRoles={['admin']}><WebhookRetryPolicy /></ProtectedRoute>} />

                  <Route path="admin/integrations/sso" element={<ProtectedRoute allowedRoles={['admin']}><SsoDashboard /></ProtectedRoute>} />
                  <Route path="admin/integrations/sso/providers" element={<ProtectedRoute allowedRoles={['admin']}><SsoProviders /></ProtectedRoute>} />
                  <Route path="admin/integrations/sso/saml" element={<ProtectedRoute allowedRoles={['admin']}><SamlConfiguration /></ProtectedRoute>} />
                  <Route path="admin/integrations/sso/oidc" element={<ProtectedRoute allowedRoles={['admin']}><OidcConfiguration /></ProtectedRoute>} />
                  <Route path="admin/integrations/sso/audit" element={<ProtectedRoute allowedRoles={['admin']}><SsoAuditLogs /></ProtectedRoute>} />
                  <Route path="admin/integrations/sso/settings" element={<ProtectedRoute allowedRoles={['admin']}><SsoSettings /></ProtectedRoute>} />

                  <Route path="admin/integrations/sync" element={<ProtectedRoute allowedRoles={['admin']}><SyncDashboard /></ProtectedRoute>} />
                  <Route path="admin/integrations/sync/status" element={<ProtectedRoute allowedRoles={['admin']}><SyncStatus /></ProtectedRoute>} />
                  <Route path="admin/integrations/sync/history" element={<ProtectedRoute allowedRoles={['admin']}><SyncHistory /></ProtectedRoute>} />
                  <Route path="admin/integrations/sync/mapping" element={<ProtectedRoute allowedRoles={['admin']}><SyncMapping /></ProtectedRoute>} />
                  <Route path="admin/integrations/sync/conflicts" element={<ProtectedRoute allowedRoles={['admin']}><SyncConflicts /></ProtectedRoute>} />
                  <Route path="admin/integrations/sync/schedule" element={<ProtectedRoute allowedRoles={['admin']}><SyncSchedule /></ProtectedRoute>} />
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
