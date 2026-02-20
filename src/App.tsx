import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { SpeedInsights } from '@vercel/speed-insights/react';

// Public Pages
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

// New Public Pages
const Welcome = lazy(() => import('./pages/public/Welcome').then(m => ({ default: m.Welcome })));
const Tour = lazy(() => import('./pages/public/Tour').then(m => ({ default: m.Tour })));
const HelpCenter = lazy(() => import('./pages/public/HelpCenter').then(m => ({ default: m.HelpCenter })));
const HelpArticle = lazy(() => import('./pages/public/HelpArticle').then(m => ({ default: m.HelpArticle })));
const HelpCategory = lazy(() => import('./pages/public/HelpCategory').then(m => ({ default: m.HelpCategory })));
const LiveChat = lazy(() => import('./pages/public/LiveChat').then(m => ({ default: m.LiveChat })));
const ContactSupport = lazy(() => import('./pages/public/ContactSupport').then(m => ({ default: m.ContactSupport })));
const Tutorials = lazy(() => import('./pages/public/Tutorials').then(m => ({ default: m.Tutorials })));
const Community = lazy(() => import('./pages/public/Community').then(m => ({ default: m.Community })));

// Onboarding Pages
const GettingStarted = lazy(() => import('./pages/onboarding/GettingStarted').then(m => ({ default: m.GettingStarted })));
const OnboardingPreferences = lazy(() => import('./pages/onboarding/Preferences').then(m => ({ default: m.Preferences })));
const OnboardingComplete = lazy(() => import('./pages/onboarding/Complete').then(m => ({ default: m.Complete })));

// Lawyer Pages
const LawyerRegister = lazy(() => import('./pages/lawyer/LawyerRegister').then(m => ({ default: m.LawyerRegister })));
const LawyerPending = lazy(() => import('./pages/lawyer/LawyerPending').then(m => ({ default: m.LawyerPending })));

// Existing User Pages
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

// New User Pages
const VisaRoadmap = lazy(() => import('./pages/user/VisaRoadmap').then(m => ({ default: m.VisaRoadmap })));
const DocumentChecklist = lazy(() => import('./pages/user/DocumentChecklist').then(m => ({ default: m.DocumentChecklist })));
const ApplicationTimeline = lazy(() => import('./pages/user/ApplicationTimeline').then(m => ({ default: m.ApplicationTimeline })));
const DeadlineAlerts = lazy(() => import('./pages/user/DeadlineAlerts').then(m => ({ default: m.DeadlineAlerts })));
const Milestones = lazy(() => import('./pages/user/Milestones').then(m => ({ default: m.Milestones })));
const ProgressDashboard = lazy(() => import('./pages/user/ProgressDashboard').then(m => ({ default: m.ProgressDashboard })));
const Tasks = lazy(() => import('./pages/user/Tasks').then(m => ({ default: m.Tasks })));
const Reminders = lazy(() => import('./pages/user/Reminders').then(m => ({ default: m.Reminders })));
const CalendarPage = lazy(() => import('./pages/user/Calendar').then(m => ({ default: m.Calendar })));
const Activity = lazy(() => import('./pages/user/Activity').then(m => ({ default: m.Activity })));
const Profile = lazy(() => import('./pages/user/Profile').then(m => ({ default: m.Profile })));
const ProfileEdit = lazy(() => import('./pages/user/ProfileEdit').then(m => ({ default: m.ProfileEdit })));
const Notifications = lazy(() => import('./pages/user/Notifications').then(m => ({ default: m.Notifications })));
const NotificationSettings = lazy(() => import('./pages/user/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const Billing = lazy(() => import('./pages/user/Billing').then(m => ({ default: m.Billing })));
const BillingInvoices = lazy(() => import('./pages/user/BillingInvoices').then(m => ({ default: m.BillingInvoices })));
const PaymentMethods = lazy(() => import('./pages/user/PaymentMethods').then(m => ({ default: m.PaymentMethods })));
const Security = lazy(() => import('./pages/user/Security').then(m => ({ default: m.Security })));
const SecurityLogins = lazy(() => import('./pages/user/SecurityLogins').then(m => ({ default: m.SecurityLogins })));
const PrivacySettings = lazy(() => import('./pages/user/PrivacySettings').then(m => ({ default: m.PrivacySettings })));
const Feedback = lazy(() => import('./pages/user/Feedback').then(m => ({ default: m.Feedback })));
const ReportIssue = lazy(() => import('./pages/user/ReportIssue').then(m => ({ default: m.ReportIssue })));
const Documents = lazy(() => import('./pages/user/Documents').then(m => ({ default: m.Documents })));
const DocumentsUpload = lazy(() => import('./pages/user/DocumentsUpload').then(m => ({ default: m.DocumentsUpload })));
const DocumentsOrganize = lazy(() => import('./pages/user/DocumentsOrganize').then(m => ({ default: m.DocumentsOrganize })));
const DocumentsShare = lazy(() => import('./pages/user/DocumentsShare').then(m => ({ default: m.DocumentsShare })));
const Notes = lazy(() => import('./pages/user/Notes').then(m => ({ default: m.Notes })));
const NoteDetail = lazy(() => import('./pages/user/NoteDetail').then(m => ({ default: m.NoteDetail })));
const Expenses = lazy(() => import('./pages/user/Expenses').then(m => ({ default: m.Expenses })));
const ExpenseReport = lazy(() => import('./pages/user/ExpenseReport').then(m => ({ default: m.ExpenseReport })));
const Templates = lazy(() => import('./pages/user/Templates').then(m => ({ default: m.Templates })));
const TemplateDetail = lazy(() => import('./pages/user/TemplateDetail').then(m => ({ default: m.TemplateDetail })));
const Messages = lazy(() => import('./pages/user/Messages').then(m => ({ default: m.Messages })));
const MessageThread = lazy(() => import('./pages/user/MessageThread').then(m => ({ default: m.MessageThread })));
const ConsultationHistory = lazy(() => import('./pages/user/ConsultationHistory').then(m => ({ default: m.ConsultationHistory })));
const SavedLawyers = lazy(() => import('./pages/user/SavedLawyers').then(m => ({ default: m.SavedLawyers })));
const MyReviews = lazy(() => import('./pages/user/MyReviews').then(m => ({ default: m.MyReviews })));


// Lawyer Portal Pages
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

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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

                    {/* New Public Routes */}
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="tour" element={<Tour />} />
                    <Route path="help-center" element={<HelpCenter />} />
                    <Route path="help-center/article/:slug" element={<HelpArticle />} />
                    <Route path="help-center/category/:category" element={<HelpCategory />} />
                    <Route path="live-chat" element={<LiveChat />} />
                    <Route path="contact-support" element={<ContactSupport />} />
                    <Route path="tutorials" element={<Tutorials />} />
                    <Route path="community" element={<Community />} />

                    {/* Onboarding Routes */}
                    <Route path="getting-started" element={<GettingStarted />} />
                    <Route path="onboarding/preferences" element={<OnboardingPreferences />} />
                    <Route path="onboarding/complete" element={<OnboardingComplete />} />
                  </Route>

                  {/* User Routes - Each has its own layout or uses UserDashboardLayout */}
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

                  {/* New User Routes (Using UserDashboardLayout) */}
                  <Route element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboardLayout /></ProtectedRoute>}>
                    <Route path="visa-roadmap" element={<VisaRoadmap />} />
                    <Route path="document-checklist" element={<DocumentChecklist />} />
                    <Route path="application-timeline" element={<ApplicationTimeline />} />
                    <Route path="deadline-alerts" element={<DeadlineAlerts />} />
                    <Route path="milestones" element={<Milestones />} />
                    <Route path="progress-dashboard" element={<ProgressDashboard />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="reminders" element={<Reminders />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="activity" element={<Activity />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/edit" element={<ProfileEdit />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="notifications/settings" element={<NotificationSettings />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="billing/invoices" element={<BillingInvoices />} />
                    <Route path="billing/payment-methods" element={<PaymentMethods />} />
                    <Route path="security" element={<Security />} />
                    <Route path="security/logins" element={<SecurityLogins />} />
                    <Route path="privacy-settings" element={<PrivacySettings />} />
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="report-issue" element={<ReportIssue />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="documents/upload" element={<DocumentsUpload />} />
                    <Route path="documents/organize" element={<DocumentsOrganize />} />
                    <Route path="documents/share" element={<DocumentsShare />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="notes/:id" element={<NoteDetail />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="expenses/report" element={<ExpenseReport />} />
                    <Route path="templates" element={<Templates />} />
                    <Route path="templates/:id" element={<TemplateDetail />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:id" element={<MessageThread />} />
                    <Route path="consultations/history" element={<ConsultationHistory />} />
                    <Route path="lawyers/saved" element={<SavedLawyers />} />
                    <Route path="reviews/my-reviews" element={<MyReviews />} />
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

                  {/* Admin Routes - Each has its own layout */}
                  <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="activity" element={<AdminActivityLog />} />
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
                  </Routes>
                </Suspense>
              </GlobalSearchProvider>
            </BrowserRouter>
            <SpeedInsights />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
