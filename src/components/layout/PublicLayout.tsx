import { Outlet } from 'react-router-dom';
import { Home, FileText, TrendingUp, Scale, MessageSquare, ShoppingBag, Newspaper } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export function PublicLayout() {
  const mobileNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/visas', label: 'Visas', icon: FileText },
    { to: '/tracker', label: 'Tracker', icon: TrendingUp },
    { to: '/lawyers', label: 'Lawyers', icon: Scale },
    { to: '/forum', label: 'Forum', icon: MessageSquare },
    { to: '/marketplace', label: 'Shop', icon: ShoppingBag },
    { to: '/news', label: 'News', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav items={mobileNavItems} />
    </div>
  );
}
