import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from './UserMenu';
import { SearchTrigger } from '../ui/SearchTrigger';
import { MobileDrawer } from './MobileDrawer';

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
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} side="right">
        <div className="p-4 space-y-1">
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
          <div className="px-4 py-2 flex justify-start">
             <UserMenu />
          </div>
        </div>
      </MobileDrawer>
    </nav>
  );
}
