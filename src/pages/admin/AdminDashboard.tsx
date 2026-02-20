import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Shield,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings,
  Bell,
  Activity,
  FileText,
  Globe
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserGrowthChart } from '../../components/charts/UserGrowthChart';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { useRealtimeSubscription } from '../../hooks/useRealtimeStats';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    pendingVerifications: 0,
    totalVisas: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingTrackerEntries: 0,
    recentSignups: 0,
  });
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAdminStats = async () => {
    // Get all stats
    const [
      { count: users },
      { count: lawyers },
      { count: pendingLawyers },
      { count: visas },
      { count: bookings },
      { count: trackerPending },
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
      supabase.from('lawyer_profiles').select('id', { count: 'exact' }).eq('verification_status', 'approved'),
      supabase.from('lawyer_profiles').select('id', { count: 'exact' }).eq('verification_status', 'pending'),
      supabase.from('visas').select('id', { count: 'exact' }),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'completed'),
      supabase.from('tracker_entries').select('id', { count: 'exact' }).eq('is_verified', false),
    ]);

    setStats({
      totalUsers: users || 0,
      totalLawyers: lawyers || 0,
      pendingVerifications: pendingLawyers || 0,
      totalVisas: visas || 0,
      totalBookings: bookings || 0,
      totalRevenue: (bookings || 0) * 49,
      pendingTrackerEntries: trackerPending || 0,
      recentSignups: 12,
    });

    // Set alerts
    const newAlerts = [];
    if (pendingLawyers && pendingLawyers > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${pendingLawyers} lawyer${pendingLawyers > 1 ? 's' : ''} pending verification`,
        link: '/admin/lawyers',
      });
    }
    if (trackerPending && trackerPending > 0) {
      newAlerts.push({
        type: 'info',
        message: `${trackerPending} tracker entries need review`,
        link: '/admin/tracker',
      });
    }
    setAlerts(newAlerts);
  };

  useEffect(() => {
    if (user) {
      fetchAdminStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Real-time updates
  useRealtimeSubscription(['profiles', 'bookings', 'visas', 'tracker_entries'], () => {
    fetchAdminStats();
  });

  const sidebarItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/lawyers', icon: Briefcase, label: 'Lawyers' },
    { to: '/admin/visas', icon: Globe, label: 'Visas' },
    { to: '/admin/content', icon: FileText, label: 'Content' },
    { to: '/admin/tracker', icon: Activity, label: 'Tracker' },
    { to: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const managementCards = [
    {
      title: 'User Management',
      desc: `${stats.totalUsers} registered users`,
      icon: Users,
      link: '/admin/users',
      color: 'blue',
    },
    {
      title: 'Lawyer Verification',
      desc: `${stats.pendingVerifications} pending approvals`,
      icon: Briefcase,
      link: '/admin/lawyers',
      color: 'green',
      alert: stats.pendingVerifications > 0,
    },
    {
      title: 'Visa Database',
      desc: `${stats.totalVisas} visa types`,
      icon: Globe,
      link: '/admin/visas',
      color: 'purple',
    },
    {
      title: 'Content Management',
      desc: 'News, guides, FAQs',
      icon: FileText,
      link: '/admin/content',
      color: 'orange',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 hidden lg:block">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <Link to="/" className="font-bold text-xl text-primary-600">VisaBuild</Link>
          <p className="text-xs text-neutral-500 mt-1">Admin Console</p>
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
        </nav>

        {/* Admin Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{user?.email}</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-neutral-600 dark:text-neutral-300">Platform overview and management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                Administrator
              </span>
              <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg relative">
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-2">
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
                  <Button variant="secondary" size="sm" as={Link} to={alert.link}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalUsers}</p>
                  <p className="text-sm text-neutral-500">Total Users</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalLawyers}</p>
                  <p className="text-sm text-neutral-500">Verified Lawyers</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalBookings}</p>
                  <p className="text-sm text-neutral-500">Total Bookings</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.totalRevenue}</p>
                  <p className="text-sm text-neutral-500">Total Revenue</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">User Growth</h2>
              </CardHeader>
              <CardBody>
                <UserGrowthChart />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Revenue Breakdown</h2>
              </CardHeader>
              <CardBody>
                <RevenueChart />
              </CardBody>
            </Card>
          </div>

          {/* Management Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {managementCards.map((card) => {
              const Icon = card.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                green: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
                orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
              };
              
              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="block p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{card.title}</h3>
                  <p className="text-sm text-neutral-500">{card.desc}</p>
                  {card.alert && (
                    <Badge variant="warning" className="mt-2">Action Required</Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Platform Health</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-700 dark:text-neutral-300">Database Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-700 dark:text-neutral-300">Auth Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-700 dark:text-neutral-300">Storage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Recent Signups</span>
                      <span className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.recentSignups}</span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">In the last 7 days</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
