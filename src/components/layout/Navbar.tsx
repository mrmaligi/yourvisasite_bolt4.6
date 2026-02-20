import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from './UserMenu';
import { SearchTrigger } from '../ui/SearchTrigger';
import { useAuth } from '../../contexts/AuthContext';

function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { user, profile, role, signOut } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer';
    return '/dashboard';
  };

  if (!user) {
    return (
      <div className="px-4 py-3 space-y-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          Sign in to access your dashboard, track applications, and more.
        </p>
        <Link
          to="/login"
          onClick={onClose}
          className="flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors min-h-[44px] shadow-sm active:scale-[0.98] transform"
        >
          Sign in
        </Link>
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 mt-2">
          Don't have an account?{' '}
          <Link to="/register" onClick={onClose} className="text-primary-600 dark:text-primary-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-1">
      <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
        </div>
        {role && role !== 'user' && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
            role === 'admin'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
          }`}>
            {role}
          </span>
        )}
      </div>

      <Link
        to={getDashboardPath()}
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <LayoutDashboard className="w-5 h-5 text-neutral-400" />
        Dashboard
      </Link>

      <button
        onClick={() => { signOut(); onClose(); }}
        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        Sign out
      </button>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/tracker', label: 'Tracker' },
    { to: '/visas', label: 'Visas' },
    { to: '/lawyers', label: 'Lawyers' },
    { to: '/forum', label: 'Forum' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/news', label: 'News' },
  ];

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
            <SearchTrigger className="mr-2 w-48 xl:w-64" />
            <ThemeToggle />
            <UserMenu />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
             <SearchTrigger variant="icon" />
             <ThemeToggle />
             <button
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 border-t border-neutral-200/60 dark:border-neutral-700/60 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in overflow-y-auto">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-neutral-100 dark:border-neutral-700 my-2" />
          <MobileAuthSection onClose={() => setMobileOpen(false)} />
        </div>
      )}
    </nav>
  );
}
