import {
  LayoutDashboard,
  Users,
  Scale,
  FileText,
  BookOpen,
  Newspaper,
  BarChart3,
  DollarSign,
  Tag,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/visas', label: 'Visas', icon: FileText },
  { to: '/admin/premium', label: 'Premium Content', icon: BookOpen },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/promos', label: 'Promo Codes', icon: Tag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminDashboardLayout() {
  return <DashboardLayout sidebarItems={sidebarItems} title="Admin" />;
}
