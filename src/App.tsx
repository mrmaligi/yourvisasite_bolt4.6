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
import { MobileRoutes } from './routes/MobileRoutes';

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
const AIRoutes = lazy(() => import('./pages/ai/AIRoutes').then(m => ({ default: m.AIRoutes })));

// Gamification
const Achievements = lazy(() => import('./pages/user/gamification/Achievements').then(m => ({ default: m.Achievements })));
const AchievementDetail = lazy(() => import('./pages/user/gamification/AchievementDetail').then(m => ({ default: m.AchievementDetail })));
const Leaderboard = lazy(() => import('./pages/user/gamification/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Streaks = lazy(() => import('./pages/user/gamification/Streaks').then(m => ({ default: m.Streaks })));
const Rewards = lazy(() => import('./pages/user/gamification/Rewards').then(m => ({ default: m.Rewards })));
const Challenges = lazy(() => import('./pages/user/gamification/Challenges').then(m => ({ default: m.Challenges })));
const Badges = lazy(() => import('./pages/user/gamification/Badges').then(m => ({ default: m.Badges })));
const Points = lazy(() => import('./pages/user/gamification/Points').then(m => ({ default: m.Points })));
const Levels = lazy(() => import('./pages/user/gamification/Levels').then(m => ({ default: m.Levels })));
const Certificates = lazy(() => import('./pages/user/gamification/Certificates').then(m => ({ default: m.Certificates })));

// Planning
const Planner = lazy(() => import('./pages/user/planning/Planner').then(m => ({ default: m.Planner })));
const PlannerTimeline = lazy(() => import('./pages/user/planning/PlannerTimeline').then(m => ({ default: m.PlannerTimeline })));
const Budget = lazy(() => import('./pages/user/planning/Budget').then(m => ({ default: m.Budget })));
const BudgetPlanner = lazy(() => import('./pages/user/planning/BudgetPlanner').then(m => ({ default: m.BudgetPlanner })));
const ChecklistBuilder = lazy(() => import('./pages/user/planning/ChecklistBuilder').then(m => ({ default: m.ChecklistBuilder })));
const FormFiller = lazy(() => import('./pages/user/planning/FormFiller').then(m => ({ default: m.FormFiller })));
const DocumentScanner = lazy(() => import('./pages/user/planning/DocumentScanner').then(m => ({ default: m.DocumentScanner })));
const Translator = lazy(() => import('./pages/user/planning/Translator').then(m => ({ default: m.Translator })));
const Comparator = lazy(() => import('./pages/user/planning/Comparator').then(m => ({ default: m.Comparator })));
const Recommendations = lazy(() => import('./pages/user/planning/Recommendations').then(m => ({ default: m.Recommendations })));

// Social
const CommunityFeed = lazy(() => import('./pages/user/social/CommunityFeed').then(m => ({ default: m.CommunityFeed })));
const CommunityGroups = lazy(() => import('./pages/user/social/CommunityGroups').then(m => ({ default: m.CommunityGroups })));
const CommunityEvents = lazy(() => import('./pages/user/social/CommunityEvents').then(m => ({ default: m.CommunityEvents })));
const CommunityStories = lazy(() => import('./pages/user/social/CommunityStories').then(m => ({ default: m.CommunityStories })));
const CommunityMentors = lazy(() => import('./pages/user/social/CommunityMentors').then(m => ({ default: m.CommunityMentors })));
const CommunityBuddies = lazy(() => import('./pages/user/social/CommunityBuddies').then(m => ({ default: m.CommunityBuddies })));
const CommunityDiscussions = lazy(() => import('./pages/user/social/CommunityDiscussions').then(m => ({ default: m.CommunityDiscussions })));
const CommunityQuestions = lazy(() => import('./pages/user/social/CommunityQuestions').then(m => ({ default: m.CommunityQuestions })));
const CommunityResources = lazy(() => import('./pages/user/social/CommunityResources').then(m => ({ default: m.CommunityResources })));
const Network = lazy(() => import('./pages/user/social/Network').then(m => ({ default: m.Network })));

// Advanced
const AiAssistant = lazy(() => import('./pages/user/advanced/AiAssistant').then(m => ({ default: m.AiAssistant })));
const AiDocumentReview = lazy(() => import('./pages/user/advanced/AiDocumentReview').then(m => ({ default: m.AiDocumentReview })));
const EligibilityCalculator = lazy(() => import('./pages/user/advanced/EligibilityCalculator').then(m => ({ default: m.EligibilityCalculator })));
const ProcessingEstimator = lazy(() => import('./pages/user/advanced/ProcessingEstimator').then(m => ({ default: m.ProcessingEstimator })));
const CostCalculator = lazy(() => import('./pages/user/advanced/CostCalculator').then(m => ({ default: m.CostCalculator })));
const RiskAssessment = lazy(() => import('./pages/user/advanced/RiskAssessment').then(m => ({ default: m.RiskAssessment })));
const DocumentVerifier = lazy(() => import('./pages/user/advanced/DocumentVerifier').then(m => ({ default: m.DocumentVerifier })));
const SpellChecker = lazy(() => import('./pages/user/advanced/SpellChecker').then(m => ({ default: m.SpellChecker })));
const FormValidator = lazy(() => import('./pages/user/advanced/FormValidator').then(m => ({ default: m.FormValidator })));
const RequirementsChecker = lazy(() => import('./pages/user/advanced/RequirementsChecker').then(m => ({ default: m.RequirementsChecker })));

// Integrations
const Integrations = lazy(() => import('./pages/user/integrations/Integrations').then(m => ({ default: m.Integrations })));
const CalendarIntegration = lazy(() => import('./pages/user/integrations/CalendarIntegration').then(m => ({ default: m.CalendarIntegration })));
const CloudIntegration = lazy(() => import('./pages/user/integrations/CloudIntegration').then(m => ({ default: m.CloudIntegration })));
const EmailIntegration = lazy(() => import('./pages/user/integrations/EmailIntegration').then(m => ({ default: m.EmailIntegration })));
const SlackIntegration = lazy(() => import('./pages/user/integrations/SlackIntegration').then(m => ({ default: m.SlackIntegration })));
const DiscordIntegration = lazy(() => import('./pages/user/integrations/DiscordIntegration').then(m => ({ default: m.DiscordIntegration })));
const WhatsAppIntegration = lazy(() => import('./pages/user/integrations/WhatsAppIntegration').then(m => ({ default: m.WhatsAppIntegration })));
const Backup = lazy(() => import('./pages/user/integrations/Backup').then(m => ({ default: m.Backup })));
const Import = lazy(() => import('./pages/user/integrations/Import').then(m => ({ default: m.Import })));
const AdvancedSettings = lazy(() => import('./pages/user/integrations/AdvancedSettings').then(m => ({ default: m.AdvancedSettings })));

// Security Imports
const TwoFactorIntro = lazy(() => import('./pages/security/2fa/TwoFactorIntro'));
const TwoFactorMethod = lazy(() => import('./pages/security/2fa/TwoFactorMethod'));
const TwoFactorQR = lazy(() => import('./pages/security/2fa/TwoFactorQR'));
const TwoFactorVerify = lazy(() => import('./pages/security/2fa/TwoFactorVerify'));
const TwoFactorBackup = lazy(() => import('./pages/security/2fa/TwoFactorBackup'));
const TwoFactorSuccess = lazy(() => import('./pages/security/2fa/TwoFactorSuccess'));
const TwoFactorRecovery = lazy(() => import('./pages/security/2fa/TwoFactorRecovery'));
const TwoFactorHistory = lazy(() => import('./pages/security/2fa/TwoFactorHistory'));
const TwoFactorDisable = lazy(() => import('./pages/security/2fa/TwoFactorDisable'));
const TwoFactorDevices = lazy(() => import('./pages/security/2fa/TwoFactorDevices'));
const ActiveSessions = lazy(() => import('./pages/security/sessions/ActiveSessions'));
const SessionDetail = lazy(() => import('./pages/security/sessions/SessionDetail'));
const RevokeSession = lazy(() => import('./pages/security/sessions/RevokeSession'));
const TimeoutSettings = lazy(() => import('./pages/security/sessions/TimeoutSettings'));
const LoginHistory = lazy(() => import('./pages/security/sessions/LoginHistory'));
const SuspiciousActivity = lazy(() => import('./pages/security/sessions/SuspiciousActivity'));
const DeviceManagement = lazy(() => import('./pages/security/sessions/DeviceManagement'));
const SessionSecurity = lazy(() => import('./pages/security/sessions/SessionSecurity'));
const UserMonitor = lazy(() => import('./pages/security/sessions/UserMonitor'));
const ForceLogout = lazy(() => import('./pages/security/sessions/ForceLogout'));
const ComplianceDashboard = lazy(() => import('./pages/security/compliance/ComplianceDashboard'));
const GDPRRequest = lazy(() => import('./pages/security/compliance/GDPRRequest'));
const DataExport = lazy(() => import('./pages/security/compliance/DataExport'));
const DataDeletion = lazy(() => import('./pages/security/compliance/DataDeletion'));
const TermsOfService = lazy(() => import('./pages/security/compliance/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/security/compliance/PrivacyPolicy'));
const CookieSettings = lazy(() => import('./pages/security/compliance/CookieSettings'));
const AuditLogs = lazy(() => import('./pages/security/compliance/AuditLogs'));
const ComplianceReports = lazy(() => import('./pages/security/compliance/ComplianceReports'));
const RegulatorySettings = lazy(() => import('./pages/security/compliance/RegulatorySettings'));
const PrivacyDashboard = lazy(() => import('./pages/security/privacy/PrivacyDashboard'));
const ProfileVisibility = lazy(() => import('./pages/security/privacy/ProfileVisibility'));
const DataSharing = lazy(() => import('./pages/security/privacy/DataSharing'));
const SearchVisibility = lazy(() => import('./pages/security/privacy/SearchVisibility'));
const ContactPreferences = lazy(() => import('./pages/security/privacy/ContactPreferences'));
const BlockedUsers = lazy(() => import('./pages/security/privacy/BlockedUsers'));
const ActivityVisibility = lazy(() => import('./pages/security/privacy/ActivityVisibility'));
const AdPreferences = lazy(() => import('./pages/security/privacy/AdPreferences'));
const SocialAccounts = lazy(() => import('./pages/security/privacy/SocialAccounts'));
const PrivacyAudit = lazy(() => import('./pages/security/privacy/PrivacyAudit'));
const AccessDashboard = lazy(() => import('./pages/security/access/AccessDashboard'));
const RoleManagement = lazy(() => import('./pages/security/access/RoleManagement'));
const PermissionSets = lazy(() => import('./pages/security/access/PermissionSets'));
const UserAccessReview = lazy(() => import('./pages/security/access/UserAccessReview'));
const ApiKeys = lazy(() => import('./pages/security/access/ApiKeys'));
const IpWhitelist = lazy(() => import('./pages/security/access/IpWhitelist'));
const AccessLogs = lazy(() => import('./pages/security/access/AccessLogs'));
const InviteUser = lazy(() => import('./pages/security/access/InviteUser'));
const TeamAccess = lazy(() => import('./pages/security/access/TeamAccess'));
const SecurityPolicy = lazy(() => import('./pages/security/access/SecurityPolicy'));

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

                  {/* Mobile Routes */}
                  <Route path="mobile">
                    {MobileRoutes}
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

                    {/* Gamification */}
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="achievements/:id" element={<AchievementDetail />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="streaks" element={<Streaks />} />
                    <Route path="rewards" element={<Rewards />} />
                    <Route path="challenges" element={<Challenges />} />
                    <Route path="badges" element={<Badges />} />
                    <Route path="points" element={<Points />} />
                    <Route path="levels" element={<Levels />} />
                    <Route path="certificates" element={<Certificates />} />

                    {/* Planning */}
                    <Route path="planner" element={<Planner />} />
                    <Route path="planner/timeline" element={<PlannerTimeline />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="budget/planner" element={<BudgetPlanner />} />
                    <Route path="checklist-builder" element={<ChecklistBuilder />} />
                    <Route path="form-filler" element={<FormFiller />} />
                    <Route path="document-scanner" element={<DocumentScanner />} />
                    <Route path="translator" element={<Translator />} />
                    <Route path="comparator" element={<Comparator />} />
                    <Route path="recommendations" element={<Recommendations />} />

                    {/* Social */}
                    <Route path="community/feed" element={<CommunityFeed />} />
                    <Route path="community/groups" element={<CommunityGroups />} />
                    <Route path="community/events" element={<CommunityEvents />} />
                    <Route path="community/stories" element={<CommunityStories />} />
                    <Route path="community/mentors" element={<CommunityMentors />} />
                    <Route path="community/buddies" element={<CommunityBuddies />} />
                    <Route path="community/discussions" element={<CommunityDiscussions />} />
                    <Route path="community/questions" element={<CommunityQuestions />} />
                    <Route path="community/resources" element={<CommunityResources />} />
                    <Route path="network" element={<Network />} />

                    {/* Advanced */}
                    <Route path="ai-assistant" element={<AiAssistant />} />
                    <Route path="ai-document-review" element={<AiDocumentReview />} />
                    <Route path="eligibility-calculator" element={<EligibilityCalculator />} />
                    <Route path="processing-estimator" element={<ProcessingEstimator />} />
                    <Route path="cost-calculator" element={<CostCalculator />} />
                    <Route path="risk-assessment" element={<RiskAssessment />} />
                    <Route path="document-verifier" element={<DocumentVerifier />} />
                    <Route path="spell-checker" element={<SpellChecker />} />
                    <Route path="form-validator" element={<FormValidator />} />
                    <Route path="requirements-checker" element={<RequirementsChecker />} />

                    {/* Integrations */}
                    <Route path="integrations" element={<Integrations />} />
                    <Route path="integrations/calendar" element={<CalendarIntegration />} />
                    <Route path="integrations/cloud" element={<CloudIntegration />} />
                    <Route path="integrations/email" element={<EmailIntegration />} />
                    <Route path="integrations/slack" element={<SlackIntegration />} />
                    <Route path="integrations/discord" element={<DiscordIntegration />} />
                    <Route path="integrations/whatsapp" element={<WhatsAppIntegration />} />
                    <Route path="backup" element={<Backup />} />
                    <Route path="import" element={<Import />} />
                    <Route path="settings/advanced" element={<AdvancedSettings />} />
                  </Route>

                  {/* AI Routes */}
                  <Route path="ai/*" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}><AIRoutes /></ProtectedRoute>} />

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
                                    {/* Security Pages */}
                  {/* 2FA */}
                  <Route path="dashboard/security/2fa/two-factor-intro" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorIntro /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-method" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorMethod /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-q-r" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorQR /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-verify" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorVerify /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-backup" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorBackup /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-success" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorSuccess /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-recovery" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorRecovery /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorHistory /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-disable" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorDisable /> </ProtectedRoute>} />
                  <Route path="dashboard/security/2fa/two-factor-devices" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TwoFactorDevices /> </ProtectedRoute>} />
                  {/* SESSIONS */}
                  <Route path="dashboard/security/sessions/active-sessions" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ActiveSessions /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/session-detail" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SessionDetail /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/revoke-session" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <RevokeSession /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/timeout-settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TimeoutSettings /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/login-history" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <LoginHistory /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/suspicious-activity" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SuspiciousActivity /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/device-management" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <DeviceManagement /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/session-security" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SessionSecurity /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/user-monitor" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <UserMonitor /> </ProtectedRoute>} />
                  <Route path="dashboard/security/sessions/force-logout" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ForceLogout /> </ProtectedRoute>} />
                  {/* COMPLIANCE */}
                  <Route path="dashboard/security/compliance/compliance-dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ComplianceDashboard /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/g-d-p-r-request" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <GDPRRequest /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/data-export" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <DataExport /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/data-deletion" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <DataDeletion /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/terms-of-service" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TermsOfService /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/privacy-policy" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <PrivacyPolicy /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/cookie-settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <CookieSettings /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/audit-logs" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <AuditLogs /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/compliance-reports" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ComplianceReports /> </ProtectedRoute>} />
                  <Route path="dashboard/security/compliance/regulatory-settings" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <RegulatorySettings /> </ProtectedRoute>} />
                  {/* PRIVACY */}
                  <Route path="dashboard/security/privacy/privacy-dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <PrivacyDashboard /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/profile-visibility" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ProfileVisibility /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/data-sharing" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <DataSharing /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/search-visibility" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SearchVisibility /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/contact-preferences" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ContactPreferences /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/blocked-users" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <BlockedUsers /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/activity-visibility" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ActivityVisibility /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/ad-preferences" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <AdPreferences /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/social-accounts" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SocialAccounts /> </ProtectedRoute>} />
                  <Route path="dashboard/security/privacy/privacy-audit" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <PrivacyAudit /> </ProtectedRoute>} />
                  {/* ACCESS */}
                  <Route path="dashboard/security/access/access-dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <AccessDashboard /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/role-management" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <RoleManagement /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/permission-sets" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <PermissionSets /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/user-access-review" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <UserAccessReview /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/api-keys" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <ApiKeys /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/ip-whitelist" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <IpWhitelist /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/access-logs" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <AccessLogs /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/invite-user" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <InviteUser /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/team-access" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <TeamAccess /> </ProtectedRoute>} />
                  <Route path="dashboard/security/access/security-policy" element={<ProtectedRoute allowedRoles={['user', 'admin', 'lawyer']}> <SecurityPolicy /> </ProtectedRoute>} />
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
