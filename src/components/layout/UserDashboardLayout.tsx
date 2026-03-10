import { LayoutDashboard, MessageSquare, FileText, CreditCard, User, Settings, Briefcase, Calendar } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/visas', label: 'My Visas', icon: Briefcase },
  { to: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { to: '/dashboard/documents', label: 'Documents', icon: FileText },
  { to: '/dashboard/consultations', label: 'Consultations', icon: Calendar },
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
