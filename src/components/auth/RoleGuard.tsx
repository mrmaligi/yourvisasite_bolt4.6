import { Navigate, useLocation } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Loading } from '../ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'lawyer' | 'admin')[];
  requireVerification?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'lawyer', 'admin'],
  requireVerification = false 
}: ProtectedRouteProps) {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] isLoading:', isLoading, 'user:', !!user, 'profile:', !!profile);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Not logged in
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User exists but no profile - could be a new user or DB issue
  // Don't redirect to login (causes loop), wait longer or redirect to register
  if (!profile) {
    console.log('[ProtectedRoute] User exists but no profile, showing setup screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8 text-center">
          <div className="flex justify-center mb-6">
            <Loading size="lg" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Setting Up Your Account
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Please wait while we prepare your profile. This should only take a moment.
          </p>
          <Button
            variant="outline"
            onClick={() => refreshProfile()}
            className="w-full gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Check Again
          </Button>
        </div>
      </div>
    );
  }

  // Account disabled
  if (!profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Account Disabled</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Your account has been disabled. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Check role permissions
  if (!allowedRoles.includes(profile.role as any)) {
    // Redirect to appropriate dashboard based on role
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (profile.role === 'lawyer') {
      return <Navigate to="/lawyer/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check lawyer verification
  if (requireVerification && profile.role === 'lawyer') {
    const lawyerProfile = (profile as any).lawyer_profiles?.[0];
    if (!lawyerProfile || lawyerProfile.verification_status !== 'approved') {
      return <Navigate to="/lawyer/pending" replace />;
    }
  }

  return <>{children}</>;
}

// Role-specific guards
export function UserOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function LawyerOnly({ children, requireVerification = true }: { children: React.ReactNode; requireVerification?: boolean }) {
  return (
    <ProtectedRoute allowedRoles={['lawyer']} requireVerification={requireVerification}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

// Auto-redirect based on role
export function RoleRedirect() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    // Should generally not happen for logged in users unless data issue
    // Redirect to dashboard where ProtectedRoute will show the setup screen
    return <Navigate to="/dashboard" replace />;
  }

  if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (profile.role === 'lawyer') {
    return <Navigate to="/lawyer/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}
