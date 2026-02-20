import {
  Users,
  Briefcase,
  Activity,
  DollarSign,
  Shield,
  FileText,
  AlertTriangle,
  Settings,
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
  CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { DashboardChart } from '../../components/dashboard/DashboardChart';
import { ActivityFeed, type ActivityItem } from '../../components/dashboard/ActivityFeed';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { NotificationPanel, type Notification } from '../../components/dashboard/NotificationPanel';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    verifiedLawyers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    pendingTrackerEntries: 0,
    totalVisas: 0,
    recentSignups: 0,
  });
  const [alerts, setAlerts] = useState<{ type: 'warning' | 'info'; message: string; link: string }[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    checkUser();
    fetchStats();

    const subscription = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'lawyer', table: 'profiles' }, fetchStats)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
  };

  const fetchStats = async () => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [
        { count: userCount },
        { count: lawyerCount },
        { count: verifiedLawyerCount },
        { count: pendingLawyerCount },
        { count: bookingCount },
        { count: visaCount },
        { count: trackerCount },
        { data: bookings },
        { data: purchases },
        { count: recentUserCount },
        { data: recentProfiles },
        { data: recentLawyers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.schema('lawyer').from('profiles').select('*', { count: 'exact', head: true }),
        supabase.schema('lawyer').from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.schema('lawyer').from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        supabase.from('bookings').select('total_price_cents, created_at, status'),
        supabase.from('visas').select('*', { count: 'exact', head: true }),
        supabase.from('tracker_entries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('total_price_cents, created_at').eq('payment_status', 'paid').gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('user_visa_purchases').select('amount_cents, purchased_at').gte('purchased_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('profiles').select('id, full_name, created_at, role').order('created_at', { ascending: false }).limit(5),
        supabase.schema('lawyer').from('profiles').select('id, jurisdiction, created_at, verification_status').order('created_at', { ascending: false }).limit(5),
      ]);

      const allBookingsRevenue = (bookings || []).reduce((acc, curr) => acc + (curr.total_price_cents || 0), 0);
      const totalRevenue = (allBookingsRevenue + ((purchases || []).reduce((acc, curr) => acc + (curr.amount_cents || 0), 0))) / 100;

      setStats({
        totalUsers: userCount || 0,
        totalLawyers: lawyerCount || 0,
        verifiedLawyers: verifiedLawyerCount || 0,
        pendingVerifications: pendingLawyerCount || 0,
        totalBookings: bookingCount || 0,
        totalRevenue,
        pendingTrackerEntries: trackerCount || 0,
        totalVisas: visaCount || 0,
        recentSignups: recentUserCount || 0,
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueByMonth: Record<string, number> = {};

      [...(bookings || []), ...(purchases || [])].forEach((item: any) => {
        const date = new Date(item.created_at || item.purchased_at);
        const key = `${months[date.getMonth()]}`;
        const amount = (item.total_price_cents || item.amount_cents || 0) / 100;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + amount;
      });

      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return months[d.getMonth()];
      });
      const finalRevenueData = last6Months.map(month => ({ name: month, value: revenueByMonth[month] || 0 }));
      setRevenueData(finalRevenueData);

      const finalUserGrowthData = last6Months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 50) + 10
      }));
      setUserGrowthData(finalUserGrowthData);

      const activities: ActivityItem[] = [];
      recentProfiles?.forEach(p => {
        if (p.role === 'user') {
          activities.push({
            id: `user-${p.id}`,
            type: 'user_signup',
            title: 'New User Signup',
            description: p.full_name || 'Anonymous user',
            timestamp: p.created_at,
          });
        }
      });
      recentLawyers?.forEach(l => {
        activities.push({
          id: `lawyer-${l.id}`,
          type: 'lawyer_registration',
          title: l.verification_status === 'pending' ? 'Lawyer Pending Verification' : 'Lawyer Registered',
          description: l.jurisdiction,
          timestamp: l.created_at,
        });
      });
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(activities);

      const newAlerts: { type: 'warning' | 'info'; message: string; link: string }[] = [];
      if ((pendingLawyerCount || 0) > 0) {
        newAlerts.push({
          type: 'warning',
          message: `${pendingLawyerCount} lawyers waiting for verification`,
          link: '/admin/lawyers',
        });
      }
      setAlerts(newAlerts);

      if ((pendingLawyerCount || 0) > 0) {
        setNotifications([{
          id: '1',
          title: 'Verification Request',
          message: `${pendingLawyerCount} new lawyer profiles require verification.`,
          type: 'warning',
          read: false,
          timestamp: new Date().toISOString()
        }]);
      } else {
          setNotifications([]);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
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
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/lawyers', icon: Briefcase, label: 'Lawyer Management' },
    { to: '/admin/visas', icon: FileText, label: 'Visa Content' },
    { to: '/admin/tracker', icon: Activity, label: 'Tracker Review' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
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
            <p className="text-xs text-neutral-500 mt-1">Admin Portal</p>
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
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
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
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{user?.email}</p>
              <p className="text-xs text-neutral-500">Administrator</p>
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
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">System metrics and management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl flex items-center justify-between ${
                    alert.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                    <span className={alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-800 dark:text-blue-200'}>
                      {alert.message}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate(alert.link)}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="blue"
              trend={{ value: 12, label: 'vs last month', positive: true }}
            />
            <StatCard
              label="Verified Lawyers"
              value={stats.verifiedLawyers}
              icon={Briefcase}
              color="green"
              trend={{ value: 5, label: 'vs last month', positive: true }}
            />
            <StatCard
              label="Total Bookings"
              value={stats.totalBookings}
              icon={Activity}
              color="purple"
              trend={{ value: 8, label: 'vs last month', positive: true }}
            />
            <StatCard
              label="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="orange"
              trend={{ value: 15, label: 'vs last month', positive: true }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <DashboardChart
              title="Revenue Trends (6 Months)"
              data={revenueData}
              type="area"
              dataKey="value"
              color="#8b5cf6"
              height={300}
            />
            <DashboardChart
              title="User Growth (Mock)"
              data={userGrowthData}
              type="bar"
              dataKey="value"
              color="#3b82f6"
              height={300}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed items={recentActivities} />
            </div>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Link to="/admin/lawyers" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">Verify Lawyers</h3>
                    <p className="text-sm text-neutral-500">{stats.pendingVerifications} pending</p>
                  </div>
                  <Button variant="secondary" size="sm">Review</Button>
                </Link>
                
                <Link to="/admin/visas" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">Manage Visas</h3>
                    <p className="text-sm text-neutral-500">{stats.totalVisas} visa types</p>
                  </div>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>

                <Link to="/admin/tracker" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">Review Tracker</h3>
                    <p className="text-sm text-neutral-500">{stats.pendingTrackerEntries} pending</p>
                  </div>
                  <Button variant="secondary" size="sm">Review</Button>
                </Link>

                <button
                   onClick={() => {/* Implement export */}}
                   className="w-full flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">Export Data</h3>
                    <p className="text-sm text-neutral-500">Download CSV reports</p>
                  </div>
                  <Button variant="secondary" size="sm">Export</Button>
                </button>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
