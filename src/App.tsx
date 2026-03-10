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
import { ProtectedRoute } from './components/auth/RoleGuard';
import { Loading } from './components/ui/Loading';

// Public Pages
const Home = lazy(() => import('./pages/public/HomeV2').then(m => ({ default: m.HomeV2 })));
const Login = lazy(() => import('./pages/public/LoginV2').then(m => ({ default: m.LoginV2 })));
const Register = lazy(() => import('./pages/public/RegisterV2').then(m => ({ default: m.RegisterV2 })));
const RoleSelect = lazy(() => import('./pages/public/RoleSelectV2').then(m => ({ default: m.RoleSelectV2 })));
const LawyerLogin = lazy(() => import('./pages/public/LawyerLoginV2').then(m => ({ default: m.LawyerLoginV2 })));
const LawyerRegister = lazy(() => import('./pages/public/LawyerRegisterV2').then(m => ({ default: m.LawyerRegisterV2 })));
const Pricing = lazy(() => import('./pages/public/PricingV2').then(m => ({ default: m.PricingV2 })));
const VisaSearch = lazy(() => import('./pages/public/VisaSearchV2').then(m => ({ default: m.VisaSearchV2 })));
const VisaDetail = lazy(() => import('./pages/public/VisaDetailV2').then(m => ({ default: m.VisaDetailV2 })));

// Visa Pages
const VisaList = lazy(() => import('./pages/visas/VisaListV2').then(m => ({ default: m.VisaListV2 })));
const VisaDetailPage = lazy(() => import('./pages/visas/VisaDetailV2').then(m => ({ default: m.VisaDetailV2 })));

// User Pages
const ApplicationTracker = lazy(() => import('./pages/user/ApplicationTrackerV2').then(m => ({ default: m.ApplicationTrackerV2 })));
const Chat = lazy(() => import('./pages/user/ChatV2').then(m => ({ default: m.ChatV2 })));
const DocumentUpload = lazy(() => import('./pages/user/DocumentUploadV2').then(m => ({ default: m.DocumentUploadV2 })));
const PaymentMethods = lazy(() => import('./pages/user/PaymentMethodsV2').then(m => ({ default: m.PaymentMethodsV2 })));
const Profile = lazy(() => import('./pages/user/ProfileV2').then(m => ({ default: m.ProfileV2 })));
const Settings = lazy(() => import('./pages/user/SettingsV2').then(m => ({ default: m.SettingsV2 })));
const Consultations = lazy(() => import('./pages/user/ConsultationsV2').then(m => ({ default: m.ConsultationsV2 })));
const MyVisas = lazy(() => import('./pages/user/MyVisasV2').then(m => ({ default: m.MyVisasV2 })));

// Lawyer Pages
const Availability = lazy(() => import('./pages/lawyer/AvailabilityV2').then(m => ({ default: m.AvailabilityV2 })));
const CaseDashboard = lazy(() => import('./pages/lawyer/CaseDashboardV2').then(m => ({ default: m.CaseDashboardV2 })));
const Earnings = lazy(() => import('./pages/lawyer/EarningsV2').then(m => ({ default: m.EarningsV2 })));
const LawyerDocuments = lazy(() => import('./pages/lawyer/LawyerDocumentsV2').then(m => ({ default: m.LawyerDocumentsV2 })));
const MyCases = lazy(() => import('./pages/lawyer/MyCasesV2').then(m => ({ default: m.MyCasesV2 })));
const Reviews = lazy(() => import('./pages/lawyer/ReviewsV2').then(m => ({ default: m.ReviewsV2 })));

// Admin Pages (Core + Essential)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboardV2').then(m => ({ default: m.AdminDashboardV2 })));
const Lawyers = lazy(() => import('./pages/admin/LawyersV2').then(m => ({ default: m.LawyersV2 })));
const Payments = lazy(() => import('./pages/admin/PaymentsV2').then(m => ({ default: m.PaymentsV2 })));
const Users = lazy(() => import('./pages/admin/UsersV2').then(m => ({ default: m.UsersV2 })));
const Analytics = lazy(() => import('./pages/admin/AnalyticsV2').then(m => ({ default: m.AnalyticsV2 })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettingsV2').then(m => ({ default: m.AdminSettingsV2 })));

// Tracker Pages
const TrackerDashboard = lazy(() => import('./pages/tracker/TrackerDashboardV2').then(m => ({ default: m.TrackerDashboardV2 })));
const SubmitTimeline = lazy(() => import('./pages/tracker/SubmitTimelineV2').then(m => ({ default: m.SubmitTimelineV2 })));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <ToastProvider>
            <ErrorBoundary>
              <GlobalSearchProvider>
                <BrowserRouter>
                  <GlobalSearch />
                  <Suspense fallback={<Loading fullScreen />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="role-select" element={<RoleSelect />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="lawyer/login" element={<LawyerLogin />} />
                        <Route path="lawyer/register" element={<LawyerRegister />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="visas" element={<VisaSearch />} />
                        <Route path="visas/:slug" element={<VisaDetail />} />
                      </Route>

                      {/* Visa Routes */}
                      <Route path="visa-list" element={<VisaList />} />
                      <Route path="visa-detail" element={<VisaDetailPage />} />

                      {/* Tracker Routes */}
                      <Route path="tracker" element={<TrackerDashboard />} />
                      <Route path="tracker/submit" element={<SubmitTimeline />} />

                      {/* User Routes */}
                      <Route element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboardLayout /></ProtectedRoute>}>
                        <Route path="dashboard" element={<ApplicationTracker />} />
                        <Route path="dashboard/chat" element={<Chat />} />
                        <Route path="dashboard/documents" element={<DocumentUpload />} />
                        <Route path="dashboard/payments" element={<PaymentMethods />} />
                        <Route path="dashboard/profile" element={<Profile />} />
                        <Route path="dashboard/settings" element={<Settings />} />
                        <Route path="dashboard/visas" element={<MyVisas />} />
                        <Route path="dashboard/consultations" element={<Consultations />} />
                      </Route>

                      {/* Lawyer Routes */}
                      <Route element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDashboardLayout /></ProtectedRoute>}>
                        <Route path="lawyer/dashboard" element={<CaseDashboard />} />
                        <Route path="lawyer/availability" element={<Availability />} />
                        <Route path="lawyer/cases" element={<MyCases />} />
                        <Route path="lawyer/documents" element={<LawyerDocuments />} />
                        <Route path="lawyer/earnings" element={<Earnings />} />
                        <Route path="lawyer/reviews" element={<Reviews />} />
                      </Route>

                      {/* Admin Routes */}
                      <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardLayout /></ProtectedRoute>}>
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/analytics" element={<Analytics />} />
                        <Route path="admin/lawyers" element={<Lawyers />} />
                        <Route path="admin/payments" element={<Payments />} />
                        <Route path="admin/settings" element={<AdminSettings />} />
                        <Route path="admin/users" element={<Users />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </GlobalSearchProvider>
            </ErrorBoundary>
          </ToastProvider>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
