import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon, ChevronLeft, ChevronRight, X, Home } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileDrawer } from './MobileDrawer';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Group items for mobile sidebar
const getGroupedItems = (items: SidebarItem[]) => {
  return {
    main: items.filter(i => ['Dashboard', 'Performance', 'Activity Log'].includes(i.label)),
    management: items.filter(i => ['Users', 'Lawyers', 'Visas'].includes(i.label)),
    content: items.filter(i => ['Content CMS', 'Pages', 'Blog', 'News', 'YouTube Feed', 'Premium Content'].includes(i.label)),
    data: items.filter(i => ['Tracker', 'Analytics'].includes(i.label)),
    commerce: items.filter(i => ['Pricing', 'Promo Codes'].includes(i.label)),
    system: items.filter(i => ['Settings'].includes(i.label)),
  };
};

export function Sidebar({ items, title, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const groupedItems = getGroupedItems(items);

  const isActive = (item: SidebarItem) => {
    return location.pathname === item.to || 
      (item.to !== '/admin' && item.to !== '/lawyer' && item.to !== '/dashboard' && 
       location.pathname.startsWith(item.to + '/'));
  };

  const DesktopSidebar = () => (
    <aside className={`hidden lg:flex h-screen sticky top-0 flex-col ${collapsed ? 'w-[72px]' : 'w-64'}`}>
      <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          {!collapsed ? (
            <Link to="/">
              <Logo size="sm" />
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <Logo size="sm" showText={false} />
            </Link>
          )}

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand Button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Title */}
        {!collapsed && title && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{title}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-neutral-100 dark:border-neutral-800 ${collapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggle className={collapsed ? 'flex-col' : ''} />
        </div>
      </div>
    </aside>
  );

  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
        <Link to="/" onClick={onMobileClose} className="flex items-center gap-3">
          <Logo size="sm" />
        </Link>
        <button
          onClick={onMobileClose}
          className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">Main</p>
          <div className="space-y-1">
            {groupedItems.main.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={`flex items-center gap-4 px-3 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-neutral-500'}`} />
                  </div>
                  <span className="text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Management Section */}
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">Management</p>
          <div className="space-y-1">
            {groupedItems.management.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={`flex items-center gap-4 px-3 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-neutral-500'}`} />
                  </div>
                  <span className="text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">Content</p>
          <div className="grid grid-cols-2 gap-2">
            {groupedItems.content.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-neutral-500'}`} />
                  <span className="text-xs text-center">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Data & Analytics */}
        {(groupedItems.data.length > 0 || groupedItems.commerce.length > 0) && (
          <div className="px-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">Data & Commerce</p>
            <div className="space-y-1">
              {[...groupedItems.data, ...groupedItems.commerce].map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onMobileClose}
                    className={`flex items-center gap-4 px-3 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      active ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-neutral-500'}`} />
                    </div>
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* System */}
        <div className="px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">System</p>
          <div className="space-y-1">
            {groupedItems.system.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onMobileClose}
                  className={`flex items-center gap-4 px-3 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-neutral-500'}`} />
                  </div>
                  <span className="text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={onMobileClose || (() => {})}
        side="left"
        title={null}
      >
        <MobileSidebarContent />
      </MobileDrawer>
    </>
  );
}
