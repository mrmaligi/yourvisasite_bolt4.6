import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut, LayoutDashboard, User } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from './UserMenu';
import { MobileDrawer } from './MobileDrawer';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/tracker', label: 'Tracker' },
    { to: '/visas', label: 'Visas' },
    { to: '/lawyers', label: 'Lawyers' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/news', label: 'News' },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <Logo size="sm" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
             <ThemeToggle />
             <button
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          <div className="space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800 my-4" />

          <div className="space-y-1">
            {user ? (
              <>
                <div className="px-4 py-2 mb-2 flex items-center gap-3">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                    </div>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-neutral-400" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </>
            ) : (
                <div className="px-4">
                    <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full py-2.5 text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-sm"
                    >
                        Sign in
                    </Link>
                </div>
            )}
          </div>
      </MobileDrawer>
    </nav>
  );
}
