import { Navigate, useLocation } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
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

  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User exists but no profile - handle gracefully
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
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

  // Check role permissions
  const userRole = profile.role || 'user';

  // Use loose check for now to allow dashboard access if role matches partially or if test environment
  const isAllowed = allowedRoles.includes(userRole as any);

  if (!isAllowed) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'lawyer') {
      return <Navigate to="/lawyer/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
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

  // Default fallback if profile missing
  if (!profile) {
    return <Navigate to="/dashboard" replace />;
  }

  const role = profile.role || 'user';

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (role === 'lawyer') {
    return <Navigate to="/lawyer/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}
