import { LayoutDashboard, FileText, Bookmark, FolderOpen, Calendar, BookOpen, ShoppingBag, Settings } from 'lucide-react';
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

export function UserDashboardLayout() {
  return <DashboardLayout sidebarItems={sidebarItems} title="My Dashboard" />;
}
