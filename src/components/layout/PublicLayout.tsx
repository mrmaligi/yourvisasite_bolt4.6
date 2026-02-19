import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, BarChart3, User } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/visas', label: 'Visas', icon: Search },
  { to: '/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Profile', icon: User },
];

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav items={mobileNavItems} />
    </div>
  );
}
