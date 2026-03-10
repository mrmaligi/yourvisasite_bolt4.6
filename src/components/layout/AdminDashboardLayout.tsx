import {
  LayoutDashboard,
  Users,
  Scale,
  DollarSign,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Admin navigation - 6 essential pages
const sidebarItems: SidebarItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/payments', label: 'Payments', icon: DollarSign },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

// Mobile nav items (same as sidebar for essential pages)
const mobileNavItems = sidebarItems;

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      mobileNavItems={mobileNavItems}
      title="Admin"
    >
      {children}
    </DashboardLayout>
  );
}

export { sidebarItems, mobileNavItems };
export type { SidebarItem };
