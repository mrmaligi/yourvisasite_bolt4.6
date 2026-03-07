import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Layout
import { MainLayout } from '@/layouts/MainLayout';

// Pages
import Home from '@/pages/Home';
import Visas from '@/pages/Visas';
import VisaDetail from '@/pages/VisaDetail';
import Lawyers from '@/pages/Lawyers';
import LawyerProfile from '@/pages/LawyerProfile';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Booking from '@/pages/Booking';
import Consultations from '@/pages/Consultations';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import LawyerDashboard from '@/pages/lawyer/LawyerDashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Premium from '@/pages/Premium';
import PartnerVisaPremium from '@/pages/visas/PartnerVisaPremium';

// Context
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="visas" element={<Visas />} />
                <Route path="visas/:subclass" element={<VisaDetail />} />
                <Route path="visas/partner/premium" element={<PartnerVisaPremium />} />
                <Route path="lawyers" element={<Lawyers />} />
                <Route path="lawyers/:id" element={<LawyerProfile />} />
                <Route path="premium" element={<Premium />} />
                
                {/* Auth Routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="register/lawyer" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="booking/:lawyerId" element={<Booking />} />
                <Route path="consultations" element={<Consultations />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/:section" element={<AdminDashboard />} />
                
                {/* Lawyer Routes */}
                <Route path="lawyer/dashboard" element={<LawyerDashboard />} />
                <Route path="lawyer/:section" element={<LawyerDashboard />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
