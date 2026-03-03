import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '../../types/database';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: UserRole;
}

// TEMPORARY BYPASS FOR TESTING - Remove in production
const BYPASS_AUTH = false; // Set to true for testing without login

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading && !BYPASS_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  // TEMPORARY BYPASS FOR TESTING
  if (BYPASS_AUTH) {
    return children ? <>{children}</> : <Outlet />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    // Redirect based on the user's actual role
    if (role === 'lawyer') {
      return <Navigate to="/lawyer/dashboard" replace />;
    } else if (role === 'user') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
