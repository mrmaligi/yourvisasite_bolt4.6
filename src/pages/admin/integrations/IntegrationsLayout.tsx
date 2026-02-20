import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';

interface IntegrationsLayoutProps {
  children: ReactNode;
}

export function IntegrationsLayout({ children }: IntegrationsLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  let activeTab = 'dashboard';
  if (currentPath.includes('/admin/integrations/api')) activeTab = 'api';
  else if (currentPath.includes('/admin/integrations/webhooks')) activeTab = 'webhooks';
  else if (currentPath.includes('/admin/integrations/sso')) activeTab = 'sso';
  else if (currentPath.includes('/admin/integrations/sync')) activeTab = 'sync';
  else if (currentPath.includes('/admin/integrations/platforms')) activeTab = 'platforms';

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Integrations</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage third-party connections and API settings.</p>
        </div>

        <div className="w-full overflow-x-auto pb-2">
          <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl min-w-max">
            <Link to="/admin/integrations">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Dashboard
              </button>
            </Link>
            <Link to="/admin/integrations/platforms/google">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'platforms' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Platforms
              </button>
            </Link>
            <Link to="/admin/integrations/api">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'api' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                API
              </button>
            </Link>
            <Link to="/admin/integrations/webhooks">
               <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'webhooks' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Webhooks
              </button>
            </Link>
             <Link to="/admin/integrations/sso">
               <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'sso' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                SSO
              </button>
            </Link>
             <Link to="/admin/integrations/sync">
               <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'sync' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Data Sync
              </button>
            </Link>
          </div>
        </div>

        <div className="min-h-[500px]">
          {children}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
