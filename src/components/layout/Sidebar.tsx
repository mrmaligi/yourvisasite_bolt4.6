import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Logo } from '../ui/Logo';

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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 ease-out">
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
        {!collapsed && (
          <Link to="/" onClick={onMobileClose}>
            <Logo size="sm" />
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto" onClick={onMobileClose}>
            <Logo size="sm" showText={false} />
          </Link>
        )}

        {/* Desktop Collapse Button */}
        <div className="hidden lg:block">
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Close Button */}
        <div className="lg:hidden">
           <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors hidden lg:block"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {!collapsed && title && (
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
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex h-screen sticky top-0 flex-col ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
           {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-neutral-900 shadow-xl animate-slide-in-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
