import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { type LucideIcon, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import { SearchTrigger } from '../ui/SearchTrigger';

interface DashboardLayoutProps {
  sidebarItems: { to: string; label: string; icon: LucideIcon }[];
  mobileNavItems?: { to: string; label: string; icon: LucideIcon }[];
  title?: string;
  children?: React.ReactNode;
}

export function DashboardLayout({ sidebarItems, mobileNavItems, title, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <SearchTrigger variant="icon" />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      <div className="flex flex-1 relative">
        <Sidebar
          items={sidebarItems}
          title={title}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className={`flex-1 w-full overflow-y-auto overflow-x-hidden ${mobileNavItems ? 'pb-16 lg:pb-0' : ''}`}>
          {/* Desktop Header Actions */}
          <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-transparent gap-3">
             <SearchTrigger className="mr-2" />
             <ThemeToggle />
             <UserMenu />
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {mobileNavItems && <MobileNav items={mobileNavItems} />}
    </div>
  );
}
