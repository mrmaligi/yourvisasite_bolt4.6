import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Settings,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { DashboardChart } from '../../components/dashboard/DashboardChart';
import { CalendarWidget } from '../../components/dashboard/CalendarWidget';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { NotificationPanel, type Notification } from '../../components/dashboard/NotificationPanel';

export function LawyerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingConsultations: 0,
    completedConsultations: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingReviews: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [earningsData, setEarningsData] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  useEffect(() => {
    checkUserAndFetchStats();
  }, []);

  const checkUserAndFetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      const { data: profile, error } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error || !profile) {
        console.error('Lawyer profile not found:', error);
        return;
      }
      setLawyerProfile(profile);

      const [
        { data: bookings },
        { count: upcomingCount },
        { count: completedCount },
      ] = await Promise.all([
        supabase.from('bookings').select('user_id, total_price_cents, status, payment_status, created_at, slot_id').eq('lawyer_id', profile.id),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('lawyer_id', profile.id).eq('status', 'confirmed').gte('created_at', new Date().toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('lawyer_id', profile.id).eq('status', 'completed'),
      ]);

      const uniqueClients = new Set(bookings?.map(b => b.user_id)).size;
      const earnings = bookings?.filter(b => b.payment_status === 'paid').reduce((acc, curr) => acc + (curr.total_price_cents || 0), 0) || 0;

      setStats({
        totalClients: uniqueClients || 0,
        upcomingConsultations: upcomingCount || 0,
        completedConsultations: completedCount || 0,
        totalEarnings: earnings / 100,
        averageRating: 4.8,
        pendingReviews: 2,
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const earningsByMonth: Record<string, number> = {};
      bookings?.filter(b => b.payment_status === 'paid').forEach(b => {
        const date = new Date(b.created_at);
        const key = months[date.getMonth()];
        earningsByMonth[key] = (earningsByMonth[key] || 0) + (b.total_price_cents || 0) / 100;
      });

      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return months[d.getMonth()];
      });
      const finalEarningsData = last6Months.map(month => ({ name: month, value: earningsByMonth[month] || 0 }));
      setEarningsData(finalEarningsData);

      let events: any[] = [];
      if (bookings && bookings.length > 0) {
        const slotIds = bookings.map(b => b.slot_id);
        const { data: slots } = await supabase.schema('lawyer').from('consultation_slots').select('id, start_time').in('id', slotIds);

        events = (bookings || []).map(b => {
          const slot = slots?.find(s => s.id === b.slot_id);
          if (!slot) return null;
          const date = new Date(slot.start_time);
          return {
             date: date.toISOString().split('T')[0],
             title: `Consultation (${b.status})`,
             type: 'consultation'
          };
        }).filter(Boolean);
      }
      if (events.length === 0) {
         const today = new Date();
         events.push({
             date: today.toISOString().split('T')[0],
             title: 'Mock Consultation',
             type: 'consultation'
         });
      }
      setCalendarEvents(events);


       if (!profile.is_verified) {
        setNotifications([{
            id: '1',
            title: 'Verification Pending',
            message: 'Your profile is under review by the admin team.',
            type: 'warning',
            read: false,
            timestamp: new Date().toISOString()
        }]);
       } else {
           setNotifications([]);
       }

    } catch (error) {
      console.error('Error fetching lawyer stats:', error);
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

  const isVerified = lawyerProfile?.is_verified;

  const sidebarItems = [
    { to: '/lawyer', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/lawyer/clients', icon: Users, label: 'Clients' },
    { to: '/lawyer/consultations', icon: Calendar, label: 'Consultations' },
    { to: '/lawyer/availability', icon: Clock, label: 'Availability' },
    { to: '/lawyer/marketing', icon: TrendingUp, label: 'Marketing' },
    { to: '/lawyer/settings', icon: Settings, label: 'Settings' },
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
            <p className="text-xs text-neutral-500 mt-1">Legal Portal</p>
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
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
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
             <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{user?.email}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-neutral-500">Lawyer</p>
                {isVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
              </div>
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
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lawyer Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">Manage your practice and clients</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                isVerified 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              }`}>
                {isVerified ? 'Verified Lawyer' : 'Pending Verification'}
              </span>
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {!isVerified && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Verification Pending</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Your account is being reviewed. You'll be able to accept clients once verified.
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Clients"
              value={stats.totalClients}
              icon={Users}
              color="blue"
              trend={{ value: 8, label: 'vs last month', positive: true }}
            />
            <StatCard
              label="Total Earnings"
              value={`$${stats.totalEarnings.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              trend={{ value: 12, label: 'vs last month', positive: true }}
            />
            <StatCard
              label="Completed"
              value={stats.completedConsultations}
              icon={CheckCircle}
              color="purple"
            />
             <StatCard
              label="Avg Rating"
              value={stats.averageRating}
              icon={Star}
              color="yellow"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <DashboardChart
                  title="Earnings Overview"
                  data={earningsData}
                  type="area"
                  dataKey="value"
                  color="#10b981"
                  height={350}
               />
            </div>
            <div>
               <CalendarWidget events={calendarEvents} className="h-full" />
            </div>
          </div>

           <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Link to="/lawyer/availability" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">Set Availability</h3>
                      <p className="text-sm text-neutral-500">Manage your consultation slots</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Manage</Button>
                </Link>

                <Link to="/lawyer/marketing" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">Marketing</h3>
                      <p className="text-sm text-neutral-500">Promote your services</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Promote</Button>
                </Link>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Reviews</h2>
              </CardHeader>
              <CardBody>
                 <div className="text-center py-8 text-neutral-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No reviews yet</p>
                  </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
