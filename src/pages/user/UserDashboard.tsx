import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  Heart, 
  User,
  Settings,
  Gift
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { VisaTrendsChart } from './dashboard/VisaTrendsChart';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { ConsultationCalendar } from './dashboard/ConsultationCalendar';
import { DocumentProgress } from './dashboard/DocumentProgress';
import { NotificationsPanel } from './dashboard/NotificationsPanel';
import { QuickActions } from './dashboard/QuickActions';
import { RecommendedVisas } from './dashboard/RecommendedVisas';

export function UserDashboard() {
  const { user } = useAuth();

  const sidebarItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/dashboard/visas', icon: Briefcase, label: 'My Visas' },
    { to: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { to: '/dashboard/consultations', icon: Calendar, label: 'Consultations' },
    { to: '/dashboard/saved', icon: Heart, label: 'Saved Visas' },
    { to: '/dashboard/referrals', icon: Gift, label: 'Referrals' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link to="/" className="font-bold text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
            VisaBuild
          </Link>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Applicant Portal</p>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, applicant.</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="hidden sm:inline-block px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">
                System Operational
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6 animate-fade-in">

          {/* Top Row: Quick Actions & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentProgress />
                <ConsultationCalendar />
              </div>
            </div>
            <div className="lg:col-span-1">
              <NotificationsPanel />
            </div>
          </div>

          {/* Middle Row: Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96">
               <VisaTrendsChart />
            </div>
            <div className="lg:col-span-1 h-96">
              <ActivityFeed />
            </div>
          </div>

          {/* Bottom Row: Recommendations */}
          <div>
            <RecommendedVisas />
          </div>

        </div>
      </main>
    </div>
  );
}
