import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileDrawer } from './MobileDrawer';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ items, title, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const renderContent = (isMobile: boolean) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <div className={`flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 ease-out ${isMobile ? 'border-none' : ''}`}>
        {!isMobile && (
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
            {!isCollapsed && (
              <Link to="/" onClick={onMobileClose}>
                <Logo size="sm" />
              </Link>
            )}
            {isCollapsed && (
              <Link to="/" className="mx-auto" onClick={onMobileClose}>
                <Logo size="sm" showText={false} />
              </Link>
            )}

            {/* Desktop Collapse Button */}
            {!isMobile && (
              <div className="hidden lg:block">
                {!isCollapsed && (
                  <button
                    onClick={() => setCollapsed(true)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {isCollapsed && !isMobile && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors hidden lg:block"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {!isCollapsed && title && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{title}</p>
          </div>
        )}

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = location.pathname === item.to || (item.to !== '/admin' && item.to !== '/lawyer' && item.to !== '/dashboard' && location.pathname.startsWith(item.to + '/'));
            const exactActive = location.pathname === item.to;
            const isActive = active || exactActive;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-neutral-100 dark:border-neutral-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggle className={isCollapsed ? 'flex-col' : ''} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex h-screen sticky top-0 flex-col ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={onMobileClose || (() => {})}
        side="left"
        title={<Link to="/" onClick={onMobileClose}><Logo size="sm" /></Link>}
      >
        {renderContent(true)}
      </MobileDrawer>
    </>
  );
}
