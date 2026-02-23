import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profile not found - likely new user needing registration completion or error
  // Since AuthContext handles fetching, if isLoading is false and profile is null, it's missing.
  if (!profile) {
    return <Navigate to="/register" replace />;
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
    return <Navigate to="/register" replace />;
  }

  if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (profile.role === 'lawyer') {
    return <Navigate to="/lawyer/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}
