import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Megaphone,
  BarChart3,
  Newspaper,
  Store,
  Settings,
  Briefcase,
  FileText,
  StickyNote,
  UserPlus,
  Star,
  UserCog,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/lawyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lawyer/clients', label: 'My Clients', icon: Users },
  { to: '/lawyer/team', label: 'Team', icon: UserCog },
  { to: '/lawyer/cases', label: 'Cases', icon: Briefcase },
  { to: '/lawyer/documents', label: 'Documents', icon: FileText },
  { to: '/lawyer/notes', label: 'Notes', icon: StickyNote },
  { to: '/lawyer/leads', label: 'Lead Capture', icon: UserPlus },
  { to: '/lawyer/testimonials', label: 'Testimonials', icon: Star },
  { to: '/lawyer/availability', label: 'Availability', icon: CalendarDays },
  { to: '/lawyer/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/lawyer/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/lawyer/news', label: 'News', icon: Newspaper },
  { to: '/lawyer/marketplace', label: 'Marketplace', icon: Store },
  { to: '/lawyer/settings', label: 'Settings', icon: Settings },
];

interface LawyerDashboardLayoutProps {
  children?: React.ReactNode;
}

export function LawyerDashboardLayout({ children }: LawyerDashboardLayoutProps) {
  return <DashboardLayout sidebarItems={sidebarItems} title="Lawyer Portal">{children}</DashboardLayout>;
}
