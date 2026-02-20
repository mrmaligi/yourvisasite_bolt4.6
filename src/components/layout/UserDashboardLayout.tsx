import { type ReactNode } from 'react';
import { LayoutDashboard, FileText, Bookmark, FolderOpen, Calendar, BookOpen, ShoppingBag, Settings, BarChart3, User } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/visas', label: 'My Visas', icon: FileText },
  { to: '/dashboard/saved', label: 'Saved Visas', icon: Bookmark },
  { to: '/dashboard/documents', label: 'My Documents', icon: FolderOpen },
  { to: '/dashboard/consultations', label: 'Consultations', icon: Calendar },
  { to: '/dashboard/premium', label: 'Premium Content', icon: BookOpen },
  { to: '/dashboard/marketplace', label: 'My Purchases', icon: ShoppingBag },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/visas', label: 'Visas', icon: FileText },
  { to: '/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Profile', icon: User },
];

export function UserDashboardLayout({ children }: { children?: ReactNode }) {
  return <DashboardLayout sidebarItems={sidebarItems} mobileNavItems={mobileNavItems} title="My Dashboard" children={children} />;
}
