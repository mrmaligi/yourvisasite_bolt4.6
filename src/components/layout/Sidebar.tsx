import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 ease-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100 dark:border-neutral-800">
        {!collapsed && (
          <Link to="/">
            <Logo size="sm" />
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <Logo size="sm" showText={false} />
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
