import { LayoutDashboard, FileText, MessageSquare, CreditCard, User, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { to: '/dashboard/documents', label: 'Documents', icon: FileText },
  { to: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const mobileNavItems = sidebarItems;

interface UserDashboardLayoutProps {
  children?: React.ReactNode;
}

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  return <DashboardLayout sidebarItems={sidebarItems} mobileNavItems={mobileNavItems} title="My Dashboard">{children}</DashboardLayout>;
}
