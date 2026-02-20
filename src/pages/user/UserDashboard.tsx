import {
  Heart,
  Briefcase,
  FileText,
  Calendar,
  ChevronRight,
  User,
  Search,
  Settings,
  LogOut,
  Gift,
  LayoutDashboard,
  Menu,
  X,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { CalendarWidget } from '../../components/dashboard/CalendarWidget';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { NotificationPanel, type Notification } from '../../components/dashboard/NotificationPanel';

export function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    savedVisas: 0,
    myVisas: 0,
    documents: 0,
    upcomingConsultations: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [recommendedVisas, setRecommendedVisas] = useState<any[]>([]);

  useEffect(() => {
    checkUserAndFetchStats();

    const subscription = supabase
      .channel('user-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_visa_purchases' }, checkUserAndFetchStats)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserAndFetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      const [
        { count: savedCount },
        { count: purchasesCount },
        { count: docsCount },
        { count: upcomingCount },
        { data: bookings },
        { data: visas }
      ] = await Promise.all([
        supabase.from('user_visa_purchases').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_visa_purchases').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', new Date().toISOString()),
        supabase.from('bookings').select('created_at, status, total_price_cents, slot_id').eq('user_id', user.id),
        supabase.from('visas').select('id, title, subclass, description').limit(3)
      ]);

      setStats({
        savedVisas: savedCount || 0,
        myVisas: purchasesCount || 0,
        documents: docsCount || 0,
        upcomingConsultations: upcomingCount || 0,
      });

      let events: any[] = [];
      if (bookings && bookings.length > 0) {
        const slotIds = bookings.map(b => b.slot_id);
        const { data: slots } = await supabase.schema('lawyer').from('consultation_slots').select('id, start_time').in('id', slotIds);

        events = (bookings || []).map(b => {
          const slot = slots?.find(s => s.id === b.slot_id);
          const date = slot ? new Date(slot.start_time) : new Date(b.created_at);
          return {
             date: date.toISOString().split('T')[0],
             title: `Consultation`,
             type: 'consultation'
          };
        });
      }
      setCalendarEvents(events);

      setRecommendedVisas(visas || []);

      setRecentActivity([
        { description: 'Logged in successfully', timestamp: new Date().toISOString() }
      ]);

      setNotifications([]);

    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  const sidebarItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/dashboard/visas', icon: Briefcase, label: 'My Visas' },
    { to: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { to: '/dashboard/consultations', icon: Calendar, label: 'Consultations' },
    { to: '/dashboard/saved', icon: Heart, label: 'Saved Visas' },
    { to: '/dashboard/referrals', icon: Gift, label: 'Referrals' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const quickActions = [
    { to: '/visas', icon: Search, label: 'Find Visa', desc: 'Check your eligibility' },
    { to: '/consultation', icon: Calendar, label: 'Book Expert', desc: 'Talk to a lawyer' },
    { to: '/dashboard/documents', icon: FileText, label: 'Upload', desc: 'Manage documents' },
    { to: '/dashboard/referrals', icon: Gift, label: 'Refer', desc: 'Invite friends' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <div>
            <Link to="/" className="font-bold text-xl text-primary-600">VisaBuild</Link>
            <p className="text-xs text-neutral-500 mt-1">Applicant Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

           <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{user?.email}</p>
              <p className="text-xs text-neutral-500">Applicant</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome Back!</h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">Here's what's happening with your visa journey</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                Applicant
              </span>
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Saved Visas"
              value={stats.savedVisas}
              icon={Heart}
              color="blue"
            />
            <StatCard
              label="My Visas"
              value={stats.myVisas}
              icon={Briefcase}
              color="green"
            />
            <StatCard
              label="Documents"
              value={stats.documents}
              icon={FileText}
              color="purple"
            />
            <StatCard
              label="Consultations"
              value={stats.upcomingConsultations}
              icon={Calendar}
              color="orange"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
                  </CardHeader>
                  <CardBody className="grid sm:grid-cols-2 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Link
                          key={action.to}
                          to={action.to}
                          className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                        >
                          <Icon className="w-6 h-6 text-blue-600 mb-2" />
                          <h3 className="font-medium text-neutral-900 dark:text-white">{action.label}</h3>
                          <p className="text-sm text-neutral-500">{action.desc}</p>
                        </Link>
                      );
                    })}
                  </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recommended for You</h2>
                    <Link to="/visas" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                    </CardHeader>
                    <CardBody>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {recommendedVisas.map((visa) => (
                            <div key={visa.id} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl flex flex-col h-full">
                                <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{visa.title} ({visa.subclass})</h3>
                                <p className="text-sm text-neutral-500 mt-1 line-clamp-2 flex-1">{visa.description}</p>
                                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => navigate(`/visas/${visa.id}`)}>
                                    Learn More
                                </Button>
                            </div>
                        ))}
                    </div>
                    </CardBody>
                </Card>

                 <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Activity</h2>
                  </CardHeader>
                  <CardBody>
                    {recentActivity.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No recent activity</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentActivity.map((activity, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <div>
                              <p className="text-sm text-neutral-700 dark:text-neutral-300">{activity.description}</p>
                              <p className="text-xs text-neutral-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
            </div>

            <div>
               <CalendarWidget events={calendarEvents} className="h-full" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
