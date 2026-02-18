import { Outlet } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  sidebarItems: { to: string; label: string; icon: LucideIcon }[];
  title?: string;
}

export function DashboardLayout({ sidebarItems, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="lg:hidden">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} title={title} />
        <main className="flex-1 overflow-y-auto">
          <DashboardHeader />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
