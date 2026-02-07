import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { UserDashboardLayout } from './components/layout/UserDashboardLayout';
import { LawyerDashboardLayout } from './components/layout/LawyerDashboardLayout';
import { AdminDashboardLayout } from './components/layout/AdminDashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/public/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/public/Register').then(m => ({ default: m.Register })));
const VisaSearch = lazy(() => import('./pages/public/VisaSearch').then(m => ({ default: m.VisaSearch })));
const VisaDetail = lazy(() => import('./pages/public/VisaDetail').then(m => ({ default: m.VisaDetail })));
const Tracker = lazy(() => import('./pages/public/Tracker').then(m => ({ default: m.Tracker })));
const LawyerDirectory = lazy(() => import('./pages/public/LawyerDirectory').then(m => ({ default: m.LawyerDirectory })));
const LawyerProfile = lazy(() => import('./pages/public/LawyerProfile').then(m => ({ default: m.LawyerProfile })));
const NewsDetail = lazy(() => import('./pages/public/NewsDetail').then(m => ({ default: m.NewsDetail })));
const Success = lazy(() => import('./pages/Success').then(m => ({ default: m.Success })));
const LawyerRegister = lazy(() => import('./pages/lawyer/LawyerRegister').then(m => ({ default: m.LawyerRegister })));
const LawyerPending = lazy(() => import('./pages/lawyer/LawyerPending').then(m => ({ default: m.LawyerPending })));

const UserDashboard = lazy(() => import('./pages/user/Dashboard').then(m => ({ default: m.UserDashboard })));
const MyVisas = lazy(() => import('./pages/user/MyVisas').then(m => ({ default: m.MyVisas })));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments').then(m => ({ default: m.MyDocuments })));
const Consultations = lazy(() => import('./pages/user/Consultations').then(m => ({ default: m.Consultations })));
const UserSettings = lazy(() => import('./pages/user/UserSettings').then(m => ({ default: m.UserSettings })));

const LawyerDashboard = lazy(() => import('./pages/lawyer/Dashboard').then(m => ({ default: m.LawyerDashboard })));
const Availability = lazy(() => import('./pages/lawyer/Availability').then(m => ({ default: m.Availability })));
const Marketing = lazy(() => import('./pages/lawyer/Marketing').then(m => ({ default: m.Marketing })));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('./pages/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const LawyerManagement = lazy(() => import('./pages/admin/LawyerManagement').then(m => ({ default: m.LawyerManagement })));
const VisaManagement = lazy(() => import('./pages/admin/VisaManagement').then(m => ({ default: m.VisaManagement })));
const PremiumContent = lazy(() => import('./pages/admin/PremiumContent').then(m => ({ default: m.PremiumContent })));
const NewsManagement = lazy(() => import('./pages/admin/NewsManagement').then(m => ({ default: m.NewsManagement })));
const TrackerManagement = lazy(() => import('./pages/admin/TrackerManagement').then(m => ({ default: m.TrackerManagement })));
const Pricing = lazy(() => import('./pages/admin/Pricing').then(m => ({ default: m.Pricing })));
const PromoCodeManagement = lazy(() => import('./pages/admin/PromoCodeManagement').then(m => ({ default: m.PromoCodeManagement })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="register/lawyer" element={<LawyerRegister />} />
                <Route path="visas" element={<VisaSearch />} />
                <Route path="visas/:id" element={<VisaDetail />} />
                <Route path="tracker" element={<Tracker />} />
                <Route path="lawyers" element={<LawyerDirectory />} />
                <Route path="lawyers/:id" element={<LawyerProfile />} />
                <Route path="news/:slug" element={<NewsDetail />} />
                <Route path="success" element={<Success />} />
              </Route>

              <Route path="dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
                <Route index element={<UserDashboard />} />
                <Route path="visas" element={<MyVisas />} />
                <Route path="documents" element={<MyDocuments />} />
                <Route path="consultations" element={<Consultations />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>

              <Route path="lawyer">
                <Route path="pending" element={<ProtectedRoute><LawyerPending /></ProtectedRoute>} />
                <Route element={<ProtectedRoute requiredRole="lawyer"><LawyerDashboardLayout /></ProtectedRoute>}>
                  <Route index element={<LawyerDashboard />} />
                  <Route path="availability" element={<Availability />} />
                  <Route path="marketing" element={<Marketing />} />
                </Route>
              </Route>

              <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="lawyers" element={<LawyerManagement />} />
                <Route path="visas" element={<VisaManagement />} />
                <Route path="premium" element={<PremiumContent />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="tracker" element={<TrackerManagement />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="promos" element={<PromoCodeManagement />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
