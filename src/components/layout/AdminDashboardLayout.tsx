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
  TrendingUp,
  Ticket,
  Calendar,
  Shield,
  MessageSquare,
  BarChart,
  PieChart,
  Database,
  Lock,
  Bell,
  Wrench,
  Globe,
  Monitor,
  Smartphone,
  Map,
  FileSpreadsheet,
  Users2,
  CreditCard,
  ShoppingCart,
  Flag,
  AlertTriangle,
  HelpCircle,
  Book,
  MessageCircle,
  History,
  Ban,
  UserPlus,
  CheckSquare,
  ShieldAlert,
  Cog,
  Zap,
  Archive,
  Key,
  Webhook,
  Server,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  children?: { to: string; label: string; icon: LucideIcon }[];
}

// Desktop sidebar items (full list with all working pages)
const sidebarItems: SidebarItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/performance', label: 'Performance', icon: Gauge },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  
  // Management
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/visas', label: 'Visas', icon: FileText },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  
  // Content
  { to: '/admin/content', label: 'Content CMS', icon: Library },
  { to: '/admin/pages', label: 'Pages', icon: Files },
  { to: '/admin/blog', label: 'Blog', icon: PenTool },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/youtube', label: 'YouTube Feed', icon: Youtube },
  { to: '/admin/premium', label: 'Premium Content', icon: BookOpen },
  
  // Data & Tracking
  { to: '/admin/tracker', label: 'Tracker', icon: BarChart3 },
  
  // Analytics
  { to: '/admin/analytics/overview', label: 'Analytics', icon: TrendingUp },
  
  // Support
  { to: '/admin/support/tickets', label: 'Support', icon: Ticket },
  
  // Commerce
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/promos', label: 'Promo Codes', icon: Tag },
  
  // System
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/system/settings', label: 'System', icon: Cog },
];

// Mobile nav items (essential only - shown at bottom)
const mobileNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { to: '/admin/visas', label: 'Visas', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

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
