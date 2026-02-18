import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

export function DashboardHeader() {
  const { user, profile, role, signOut, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer';
    return '/dashboard';
  };

  return (
    <header className="hidden lg:flex items-center justify-end h-16 px-8 bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 max-w-[120px] truncate">
                {profile?.full_name || 'User'}
              </span>
              {role && role !== 'user' && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                  role === 'admin'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                }`}>
                  {role}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-elevated border border-neutral-200/80 dark:border-neutral-800 py-2 z-20 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors mx-1.5 rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                    Dashboard
                  </Link>
                  <div className="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1 mx-1.5">
                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full rounded-lg transition-colors"
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
    </header>
  );
}
