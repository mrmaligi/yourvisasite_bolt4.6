import { NavLink } from 'react-router-dom';
import { Home, Search, FileText, User, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileBottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/mobile/dashboard' },
    { icon: Search, label: 'Search', path: '/mobile/visa-search' },
    { icon: FileText, label: 'Tracker', path: '/mobile/tracker' },
    { icon: Bell, label: 'Alerts', path: '/mobile/notifications' },
    { icon: User, label: 'Profile', path: '/mobile/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
