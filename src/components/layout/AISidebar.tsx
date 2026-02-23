import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

interface AISidebarProps {
  groups: SidebarGroup[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AISidebar({ groups, mobileOpen = false, onMobileClose }: AISidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  // Default open all groups or manage individually. For now, let's keep them all expanded for visibility.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, group) => ({ ...acc, [group.title]: true }), {})
  );
  const location = useLocation();

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const renderContent = (isMobile: boolean) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 ease-out">
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

          {/* Mobile Close Button */}
          {isMobile && (
            <div className="lg:hidden">
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {isCollapsed && !isMobile && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors hidden lg:block"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
          {groups.map((group) => {
            const isOpen = openGroups[group.title];
            return (
              <div key={group.title}>
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center justify-between w-full px-2 py-1 mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    <span>{group.title}</span>
                    {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
                {isCollapsed && (
                   <div className="px-2 py-1 mb-1 text-center">
                     <span className="text-[10px] font-bold text-neutral-400 uppercase">{group.title.substring(0, 2)}</span>
                   </div>
                )}

                {(isOpen || isCollapsed) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          title={isCollapsed ? item.label : undefined}
                          onClick={onMobileClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                              : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
                          }`}
                        >
                          <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
