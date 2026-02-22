import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
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
  const { user, profile, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [lawyerStatus, setLawyerStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [checkingLawyer, setCheckingLawyer] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkLawyerStatus = async () => {
      if (profile?.role === 'lawyer' && requireVerification && user) {
        setCheckingLawyer(true);
        try {
          const { data } = await supabase
            .from('lawyer_profiles')
            .select('verification_status')
            .eq('profile_id', user.id)
            .single();

          if (mounted && data) {
            setLawyerStatus(data.verification_status as any);
          }
        } catch (error) {
          console.error('Error checking lawyer status:', error);
        } finally {
          if (mounted) {
            setCheckingLawyer(false);
          }
        }
      }
    };

    checkLawyerStatus();

    return () => {
      mounted = false;
    };
  }, [profile, requireVerification, user]);

  if (authLoading || checkingLawyer) {
    return <Loading fullScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No profile found
  if (!profile) {
    return <Navigate to="/register" replace />;
  }

  // Account disabled
  if (profile.is_active === false) {
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
    if (!lawyerStatus || lawyerStatus !== 'approved') {
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
  const { user, profile } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        setRedirectPath('/admin');
      } else if (profile.role === 'lawyer') {
        setRedirectPath('/lawyer/dashboard');
      } else {
        setRedirectPath('/dashboard');
      }
    }
  }, [user, profile]);

  if (!redirectPath) {
    return <Loading fullScreen />;
  }

  return <Navigate to={redirectPath} replace />;
}
