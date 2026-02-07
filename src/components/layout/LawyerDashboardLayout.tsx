import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Megaphone,
  BarChart3,
  Newspaper,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/lawyer', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lawyer/clients', label: 'My Clients', icon: Users },
  { to: '/lawyer/availability', label: 'Availability', icon: CalendarDays },
  { to: '/lawyer/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/lawyer/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/lawyer/news', label: 'News', icon: Newspaper },
  { to: '/lawyer/settings', label: 'Settings', icon: Settings },
];

export function LawyerDashboardLayout() {
  return <DashboardLayout sidebarItems={sidebarItems} title="Lawyer Portal" />;
}
