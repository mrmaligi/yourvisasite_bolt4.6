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
  Image,
  LifeBuoy,
  MessageCircle,
  ThumbsUp,
  ShieldAlert,
  TrendingUp,
  FileBarChart,
  ClipboardList,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/admin/finance', label: 'Finance', icon: DollarSign },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/visas', label: 'Visas', icon: FileText },
  { to: '/admin/premium', label: 'Premium Content', icon: BookOpen },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/youtube', label: 'YouTube Feed', icon: Youtube },
  { to: '/admin/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/admin/media', label: 'Media Library', icon: Image },
  { to: '/admin/support', label: 'Support Tickets', icon: LifeBuoy },
  { to: '/admin/chat', label: 'Live Chat', icon: MessageCircle },
  { to: '/admin/feedback', label: 'User Feedback', icon: ThumbsUp },
  { to: '/admin/abuse', label: 'Abuse Reports', icon: ShieldAlert },
  { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { to: '/admin/audit', label: 'Audit Log', icon: ClipboardList },
  { to: '/admin/performance', label: 'System Performance', icon: Zap },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/promos', label: 'Promo Codes', icon: Tag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminDashboardLayout() {
  return <DashboardLayout sidebarItems={sidebarItems} title="Admin" />;
}
