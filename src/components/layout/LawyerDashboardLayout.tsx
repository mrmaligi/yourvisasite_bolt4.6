import {
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  FileText,
  Star,
  DollarSign,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/lawyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', icon: Briefcase },
  { to: '/lawyer/documents', label: 'Documents', icon: FileText },
  { to: '/lawyer/availability', label: 'Availability', icon: CalendarDays },
  { to: '/lawyer/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/lawyer/reviews', label: 'Reviews', icon: Star },
];

interface LawyerDashboardLayoutProps {
  children?: React.ReactNode;
}

export function LawyerDashboardLayout({ children }: LawyerDashboardLayoutProps) {
  return <DashboardLayout sidebarItems={sidebarItems} title="Lawyer Portal">{children}</DashboardLayout>;
}
