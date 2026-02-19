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
import { LawyerDashboardLayout } from './components/layout/LawyerDashboardLayout';
import { AdminDashboardLayout } from './components/layout/AdminDashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Loading } from './components/ui/Loading';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { SpeedInsights } from '@vercel/speed-insights/react';

const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/public/Login').then(m => ({ default: m.Login })));
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

const UserDashboard = lazy(() => import('./pages/user/Dashboard').then(m => ({ default: m.UserDashboard })));
const MyVisas = lazy(() => import('./pages/user/MyVisas').then(m => ({ default: m.MyVisas })));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments').then(m => ({ default: m.MyDocuments })));
const Consultations = lazy(() => import('./pages/user/Consultations').then(m => ({ default: m.Consultations })));
const BookConsultation = lazy(() => import('./pages/user/BookConsultation').then(m => ({ default: m.BookConsultation })));
const UserPremiumContent = lazy(() => import('./pages/user/PremiumContent').then(m => ({ default: m.PremiumContent })));
const UserMarketplacePurchases = lazy(() => import('./pages/user/MarketplacePurchases').then(m => ({ default: m.MarketplacePurchases })));
const UserSettings = lazy(() => import('./pages/user/UserSettings').then(m => ({ default: m.UserSettings })));
const SavedVisas = lazy(() => import('./pages/user/SavedVisas').then(m => ({ default: m.SavedVisas })));
const Referrals = lazy(() => import('./pages/user/Referrals').then(m => ({ default: m.Referrals })));

const PortalLanding = lazy(() => import('./pages/lawyer/PortalLanding').then(m => ({ default: m.PortalLanding })));
const LawyerDashboard = lazy(() => import('./pages/lawyer/Dashboard').then(m => ({ default: m.LawyerDashboard })));
const LawyerClients = lazy(() => import('./pages/lawyer/Clients').then(m => ({ default: m.Clients })));
const LawyerConsultations = lazy(() => import('./pages/lawyer/Consultations').then(m => ({ default: m.LawyerConsultations })));
const Availability = lazy(() => import('./pages/lawyer/Availability').then(m => ({ default: m.Availability })));
const Marketing = lazy(() => import('./pages/lawyer/Marketing').then(m => ({ default: m.Marketing })));
const LawyerTracker = lazy(() => import('./pages/lawyer/LawyerTracker').then(m => ({ default: m.LawyerTracker })));
const LawyerNews = lazy(() => import('./pages/lawyer/LawyerNews').then(m => ({ default: m.LawyerNews })));
const LawyerMarketplace = lazy(() => import('./pages/lawyer/Marketplace').then(m => ({ default: m.Marketplace })));
const LawyerSettings = lazy(() => import('./pages/lawyer/LawyerSettings').then(m => ({ default: m.LawyerSettings })));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
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
                    <Route path="login" element={<Login />} />
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
                  </Route>

                  <Route path="dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<UserDashboard />} />
                    <Route path="visas" element={<MyVisas />} />
                    <Route path="saved" element={<SavedVisas />} />
                    <Route path="documents" element={<MyDocuments />} />
                    <Route path="consultations" element={<Consultations />} />
                    <Route path="book-consultation/:lawyerId" element={<BookConsultation />} />
                    <Route path="premium" element={<UserPremiumContent />} />
                    <Route path="marketplace" element={<UserMarketplacePurchases />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="referrals" element={<Referrals />} />
                  </Route>

                  <Route path="lawyer">
                    <Route index element={<PortalLanding />} />
                    <Route path="pending" element={<ProtectedRoute><LawyerPending /></ProtectedRoute>} />
                    <Route element={<ProtectedRoute requiredRole="lawyer"><LawyerDashboardLayout /></ProtectedRoute>}>
                      <Route path="dashboard" element={<LawyerDashboard />} />
                      <Route path="clients" element={<LawyerClients />} />
                      <Route path="consultations" element={<LawyerConsultations />} />
                      <Route path="availability" element={<Availability />} />
                      <Route path="marketing" element={<Marketing />} />
                      <Route path="tracker" element={<LawyerTracker />} />
                      <Route path="news" element={<LawyerNews />} />
                      <Route path="marketplace" element={<LawyerMarketplace />} />
                      <Route path="settings" element={<LawyerSettings />} />
                    </Route>
                  </Route>

                  <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="activity" element={<AdminActivityLog />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="lawyers" element={<LawyerManagement />} />
                    <Route path="visas" element={<VisaManagement />} />
                    <Route path="premium" element={<PremiumContent />} />
                    <Route path="news" element={<NewsManagement />} />
                    <Route path="youtube" element={<YouTubeManagement />} />
                    <Route path="tracker" element={<TrackerManagement />} />
                    <Route path="pricing" element={<AdminPricing />} />
                    <Route path="promos" element={<PromoCodeManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                    </Route>
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
