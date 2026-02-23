import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import {
  Activity,
  Settings,
  TestTube,
  Book,
  LayoutDashboard
} from 'lucide-react';

export function PerformanceLayout() {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/admin/performance', icon: LayoutDashboard, exact: true },
    { name: 'Monitoring', path: '/admin/performance/monitoring', icon: Activity },
    { name: 'Optimization', path: '/admin/performance/optimization', icon: Settings },
    { name: 'Testing', path: '/admin/performance/testing', icon: TestTube },
    { name: 'Documentation', path: '/admin/performance/docs', icon: Book },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Performance Center</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Monitor, optimize, test, and document your application performance.
          </p>
        </div>

        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? location.pathname === tab.path
                : location.pathname.startsWith(tab.path);

              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${isActive
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="min-h-[500px]">
          <Outlet />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
