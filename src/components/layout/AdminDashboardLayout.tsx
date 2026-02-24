import {
  LayoutDashboard,
  Activity,
  Users,
  Scale,
  FileText,
  BookOpen,
  Newspaper,
  BarChart3,
  DollarSign,
  Tag,
  Settings,
  Youtube,
  Library,
  Files,
  PenTool,
  Gauge,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/performance', label: 'Performance', icon: Gauge },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/visas', label: 'Visas', icon: FileText },
  { to: '/admin/premium', label: 'Premium Content', icon: BookOpen },
  { to: '/admin/content', label: 'Content CMS', icon: Library },
  { to: '/admin/pages', label: 'Pages', icon: Files },
  { to: '/admin/blog', label: 'Blog', icon: PenTool },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/youtube', label: 'YouTube Feed', icon: Youtube },
  { to: '/admin/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/promos', label: 'Promo Codes', icon: Tag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  return <DashboardLayout sidebarItems={sidebarItems} title="Admin">{children}</DashboardLayout>;
}
