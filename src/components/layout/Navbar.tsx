import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function Navbar() {
  const { user, profile, role, signOut, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/tracker', label: 'Tracker' },
    { to: '/visas', label: 'Visas' },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <Logo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-neutral-100/80 transition-all duration-200"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-100" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                  {role && role !== 'user' && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                      role === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {role}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-neutral-200/80 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-neutral-100 mb-1">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors mx-1.5 rounded-lg"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                        Dashboard
                      </Link>
                      <div className="border-t border-neutral-100 mt-1 pt-1 mx-1.5">
                        <button
                          onClick={() => { setDropdownOpen(false); signOut(); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200/60 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-neutral-100 my-2" />
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut(); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Sign in</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
