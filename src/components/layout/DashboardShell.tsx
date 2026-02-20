import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from '../ui/Toast';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'user' | 'lawyer' | 'admin';
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
    setProfile(data);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    toast('success', 'Signed out successfully');
  };

  // Role-specific navigation
  const getNavigation = (): NavItem[] => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/users', icon: User, label: 'Users' },
          { to: '/admin/lawyers', icon: Briefcase, label: 'Lawyers' },
          { to: '/admin/visas', icon: Shield, label: 'Visas' },
          { to: '/admin/tracker', icon: Bell, label: 'Tracker', badge: notifications },
          { to: '/admin/settings', icon: LayoutDashboard, label: 'Settings' },
        ];
      case 'lawyer':
        return [
          { to: '/lawyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/lawyer/clients', icon: User, label: 'Clients' },
          { to: '/lawyer/consultations', icon: Briefcase, label: 'Consultations' },
          { to: '/lawyer/availability', icon: LayoutDashboard, label: 'Availability' },
          { to: '/lawyer/marketing', icon: Bell, label: 'Marketing' },
          { to: '/lawyer/settings', icon: LayoutDashboard, label: 'Settings' },
        ];
      default: // user
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/dashboard/visas', icon: Briefcase, label: 'My Visas' },
          { to: '/dashboard/documents', icon: LayoutDashboard, label: 'Documents' },
          { to: '/dashboard/consultations', icon: User, label: 'Consultations' },
          { to: '/dashboard/saved', icon: Bell, label: 'Saved' },
          { to: '/dashboard/settings', icon: LayoutDashboard, label: 'Settings' },
        ];
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'lawyer': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'lawyer': return 'Migration Lawyer';
      default: return 'Visa Applicant';
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary-600">VisaBuild</Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <Link to="/" className="font-bold text-2xl text-primary-600">VisaBuild</Link>
            <p className="text-xs text-neutral-500 mt-1">{getRoleLabel()} Portal</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor()}`}>
                {role === 'admin' ? <Shield className="w-5 h-5" /> : 
                 role === 'lawyer' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 dark:text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-neutral-500 capitalize">{role}</p>
              </div>
            </div>
            
            <Button variant="secondary" size="sm" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {navigation.find(n => n.to === location.pathname)?.label || 'Dashboard'}
              </h1>
              
              <div className="flex items-center gap-4">
                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()}`}>
                  {getRoleLabel()}
                </span>
                
                {/* Notifications */}
                <button className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
