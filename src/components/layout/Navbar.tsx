import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from './UserMenu';
import { SearchTrigger } from '../ui/SearchTrigger';
import { MobileDrawer } from './MobileDrawer';
import { Button } from '../ui/Button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/tracker', label: 'Tracker' },
    { to: '/visas', label: 'Visas' },
    { to: '/lawyers', label: 'Lawyers' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/forum', label: 'Forum' },
    { to: '/news', label: 'News' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 ml-8">
            <div className="flex gap-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-700/50">
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                    location.pathname === link.to
                      ? 'text-emerald-600 bg-white dark:bg-neutral-900 dark:text-emerald-400 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <SearchTrigger className="mr-2 w-48 xl:w-64 bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-700/50 focus-within:bg-white dark:focus-within:bg-neutral-900 transition-colors rounded-full" />
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800"></div>
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
             <SearchTrigger variant="icon" />
             <ThemeToggle />
             <button
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} side="right">
        <div className="flex flex-col h-full p-6 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-8">
            <Logo size="sm" />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3.5 rounded-2xl text-base font-medium transition-colors ${
                   location.pathname === link.to
                      ? 'bg-primary-50 text-emerald-600 dark:bg-primary-900/20 dark:text-emerald-400'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
             <UserMenu />
          </div>
        </div>
      </MobileDrawer>
    </nav>
  );
}
