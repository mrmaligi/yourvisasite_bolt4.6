import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Megaphone,
  BarChart3,
  Newspaper,
  Store,
  Settings,
  Calendar,
  Star,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/lawyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lawyer/clients', label: 'My Clients', icon: Users },
  { to: '/lawyer/consultations', label: 'Consultations', icon: Calendar },
  { to: '/lawyer/availability', label: 'Availability', icon: CalendarDays },
  { to: '/lawyer/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/lawyer/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/lawyer/reviews', label: 'Reviews', icon: Star },
  { to: '/lawyer/news', label: 'News', icon: Newspaper },
  { to: '/lawyer/marketplace', label: 'Marketplace', icon: Store },
  { to: '/lawyer/settings', label: 'Settings', icon: Settings },
];

const mobileNavItems = [
  { to: '/lawyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lawyer/clients', label: 'Clients', icon: Users },
  { to: '/lawyer/consultations', label: 'Consultations', icon: Calendar },
  { to: '/lawyer/availability', label: 'Availability', icon: CalendarDays },
];

export function LawyerDashboardLayout() {
  return <DashboardLayout sidebarItems={sidebarItems} mobileNavItems={mobileNavItems} title="Lawyer Portal" />;
}
