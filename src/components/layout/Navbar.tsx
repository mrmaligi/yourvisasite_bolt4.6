import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
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
      <div className="px-4 py-3 space-y-2 border-t border-navy-700">
        <p className="text-sm text-navy-200 mb-3">
          Sign in to access your dashboard, track applications, and more.
        </p>
        <Link
          to="/login"
          onClick={onClose}
          className="flex items-center justify-center w-full px-5 py-3 bg-gold-500 text-white font-semibold uppercase tracking-wider text-sm rounded hover:bg-gold-600 transition-colors"
        >
          Sign In
        </Link>
        <p className="text-xs text-center text-navy-300 mt-2">
          Don\'t have an account?{' '}
          <Link to="/register" onClick={onClose} className="text-gold-400 hover:text-gold-300 hover:underline">
            Register
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-1 border-t border-navy-700">
      <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-navy-700/50 rounded">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded object-cover" />
        ) : (
          <div className="w-10 h-10 bg-navy-500 flex items-center justify-center rounded">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-xs text-navy-300 truncate">{user.email}</p>
        </div>
        {role && role !== 'user' && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            role === 'admin'
              ? 'bg-gold-500 text-white'
              : 'bg-navy-400 text-white'
          }`}>
            {role}
          </span>
        )}
      </div>

      <Link
        to={getDashboardPath()}
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-navy-100 hover:bg-navy-700/50 transition-colors rounded"
      >
        <LayoutDashboard className="w-5 h-5 text-navy-300" />
        Dashboard
      </Link>

      <button
        onClick={() => { signOut(); onClose(); }}
        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors w-full rounded"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/visas', label: 'Visas' },
    { to: '/tracker', label: 'Tracker' },
    { to: '/lawyers', label: 'Lawyers' },
    { to: '/forum', label: 'Forum' },
    { to: '/news', label: 'News' },
  ];

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-gold-500 text-white text-center text-sm py-2 px-4">
        <span className="font-medium">Official Australian Immigration Information Platform</span>
      </div>
      
      <nav className="sticky top-0 z-40 bg-navy-600 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <Logo size="sm" variant="light" />
            </Link>

            <div className="hidden lg:flex items-center">
              {publicLinks.map((link, index) => (
                <div key={link.to} className="flex items-center">
                  <Link
                    to={link.to}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-gold-400'
                        : 'text-navy-100 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {index < publicLinks.length - 1 && (
                    <div className="w-px h-4 bg-navy-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <SearchTrigger className="w-48 xl:w-64"
                inputClassName="bg-navy-700 border-navy-600 text-white placeholder-navy-300 focus:border-gold-500 focus:ring-gold-500/20"
              />
              <div className="w-px h-6 bg-navy-500" />
              <UserMenu variant="light" />
            </div>

            <div className="flex items-center gap-2 lg:hidden">
               <SearchTrigger variant="icon" className="text-navy-100" />
               <button
                className="p-2 text-navy-100 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[calc(4rem+2rem)] bottom-0 z-[60] bg-navy-600 border-t border-navy-700 overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded ${
                    location.pathname === link.to
                      ? 'bg-navy-700 text-gold-400'
                      : 'text-navy-100 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
            <MobileAuthSection onClose={() => setMobileOpen(false)} />
          </div>
        )}
      </nav>
    </>
  );
}
