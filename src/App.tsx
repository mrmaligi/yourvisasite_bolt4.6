import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { UserDashboardLayout } from './components/layout/UserDashboardLayout';
import { LawyerDashboardLayout } from './components/layout/LawyerDashboardLayout';
import { AdminDashboardLayout } from './components/layout/AdminDashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Landing = lazy(() => import('./pages/public/Landing').then((m) => ({ default: m.Landing })));
const Tracker = lazy(() => import('./pages/public/Tracker').then((m) => ({ default: m.Tracker })));
const VisaSearch = lazy(() => import('./pages/public/VisaSearch').then((m) => ({ default: m.VisaSearch })));
const VisaDetail = lazy(() => import('./pages/public/VisaDetail').then((m) => ({ default: m.VisaDetail })));
const Login = lazy(() => import('./pages/public/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/public/Register').then((m) => ({ default: m.Register })));

const UserDashboard = lazy(() => import('./pages/user/Dashboard').then((m) => ({ default: m.UserDashboard })));
const MyVisas = lazy(() => import('./pages/user/MyVisas').then((m) => ({ default: m.MyVisas })));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments').then((m) => ({ default: m.MyDocuments })));
const Consultations = lazy(() => import('./pages/user/Consultations').then((m) => ({ default: m.Consultations })));
const UserSettings = lazy(() => import('./pages/user/UserSettings').then((m) => ({ default: m.UserSettings })));

const LawyerDashboard = lazy(() => import('./pages/lawyer/Dashboard').then((m) => ({ default: m.LawyerDashboard })));
const Availability = lazy(() => import('./pages/lawyer/Availability').then((m) => ({ default: m.Availability })));
const Marketing = lazy(() => import('./pages/lawyer/Marketing').then((m) => ({ default: m.Marketing })));
const LawyerRegister = lazy(() => import('./pages/lawyer/LawyerRegister').then((m) => ({ default: m.LawyerRegister })));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('./pages/admin/UserManagement').then((m) => ({ default: m.UserManagement })));
const LawyerManagement = lazy(() => import('./pages/admin/LawyerManagement').then((m) => ({ default: m.LawyerManagement })));
const VisaManagement = lazy(() => import('./pages/admin/VisaManagement').then((m) => ({ default: m.VisaManagement })));
const PremiumContent = lazy(() => import('./pages/admin/PremiumContent').then((m) => ({ default: m.PremiumContent })));
const NewsManagement = lazy(() => import('./pages/admin/NewsManagement').then((m) => ({ default: m.NewsManagement })));
const TrackerManagement = lazy(() => import('./pages/admin/TrackerManagement').then((m) => ({ default: m.TrackerManagement })));
const Pricing = lazy(() => import('./pages/admin/Pricing').then((m) => ({ default: m.Pricing })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

function LoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-neutral-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-extrabold text-neutral-100 mb-2">404</h1>
      <p className="text-xl font-bold text-neutral-900 mb-2">Page not found</p>
      <p className="text-neutral-500 mb-8">The page you are looking for does not exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/visas" element={<VisaSearch />} />
                <Route path="/visas/:id" element={<VisaDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/lawyer" element={<ProtectedRoute><LawyerRegister /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/dashboard"
                element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}
              >
                <Route index element={<UserDashboard />} />
                <Route path="visas" element={<MyVisas />} />
                <Route path="documents" element={<MyDocuments />} />
                <Route path="consultations" element={<Consultations />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>

              <Route
                path="/lawyer"
                element={<ProtectedRoute requiredRole="lawyer"><LawyerDashboardLayout /></ProtectedRoute>}
              >
                <Route index element={<LawyerDashboard />} />
                <Route path="availability" element={<Availability />} />
                <Route path="marketing" element={<Marketing />} />
              </Route>

              <Route
                path="/admin"
                element={<ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>}
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="lawyers" element={<LawyerManagement />} />
                <Route path="visas" element={<VisaManagement />} />
                <Route path="premium" element={<PremiumContent />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="tracker" element={<TrackerManagement />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
