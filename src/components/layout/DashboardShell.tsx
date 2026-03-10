import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  DollarSign,
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  FileText,
  Calendar,
  Star,
  MessageSquare,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          { to: '/admin/payments', icon: DollarSign, label: 'Payments' },
        ];
      case 'lawyer':
        return [
          { to: '/lawyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/lawyer/cases', icon: Briefcase, label: 'Cases' },
          { to: '/lawyer/documents', icon: FileText, label: 'Documents' },
          { to: '/lawyer/availability', icon: Calendar, label: 'Availability' },
          { to: '/lawyer/earnings', icon: DollarSign, label: 'Earnings' },
          { to: '/lawyer/reviews', icon: Star, label: 'Reviews' },
        ];
      default: // user
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
          { to: '/dashboard/documents', icon: FileText, label: 'Documents' },
          { to: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
          { to: '/dashboard/profile', icon: User, label: 'Profile' },
          { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-indigo-500/30">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-indigo-600 dark:text-indigo-400">VisaBuild</Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-6">
            <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent inline-block">
              VisaBuild
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{getRoleLabel()} Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  ) : isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${getRoleColor()}`}>
                {role === 'admin' ? <Shield className="w-5 h-5" /> : 
                 role === 'lawyer' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
              </div>
            </div>
            
            <Button variant="secondary" size="sm" onClick={handleSignOut} className="w-full justify-start rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">
                {navigation.find(n => n.to === location.pathname)?.label || 'Dashboard'}
              </h1>
              
              <div className="flex items-center gap-4 ml-auto">
                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getRoleColor()}`}>
                  {getRoleLabel()}
                </span>
                
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto">
            <div className="animate-fade-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
