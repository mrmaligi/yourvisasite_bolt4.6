import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Bell,
  Activity,
  FileText,
  Globe,
  Download,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Profile, LawyerProfile } from '../../types/database';

interface UserGrowthData {
  date: string;
  count: number;
}

interface RevenueSourceData {
  name: string;
  value: number;
  color: string;
}

interface PendingLawyer extends LawyerProfile {
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

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
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueSourceData[]>([]);
  const [pendingLawyers, setPendingLawyers] = useState<PendingLawyer[]>([]);
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    // Parallel Fetch
    const [
      usersRes,
      lawyersRes,
      pendingLawyersRes,
      visasRes,
      trackerPendingRes,
      userGrowthRes,
      recentUsersRes,
      bookingsRes,
      purchasesRes
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
      supabase.from('lawyer_profiles').select('id', { count: 'exact' }).eq('verification_status', 'approved'),
      supabase.from('lawyer_profiles').select('*, profiles:user_id(full_name, email)').eq('verification_status', 'pending'),
      supabase.from('visas').select('id', { count: 'exact' }),
      supabase.from('tracker_entries').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('profiles').select('created_at').eq('role', 'user').order('created_at', { ascending: true }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('bookings').select('amount_cents').eq('status', 'completed'),
      supabase.from('user_visa_purchases').select('amount_cents')
    ]);

    // Process Stats
    // Calculate total revenue from bookings and purchases (in cents then converted to dollars)
    const bookingRevenue = bookingsRes.data?.reduce((acc, curr) => acc + (curr.amount_cents || 0), 0) || 0;
    const purchaseRevenue = purchasesRes.data?.reduce((acc, curr) => acc + (curr.amount_cents || 0), 0) || 0;
    const totalRevenue = (bookingRevenue + purchaseRevenue) / 100;

    // Calculate Recent Signups (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = userGrowthRes.data?.filter(p => new Date(p.created_at) > sevenDaysAgo).length || 0;

    setStats({
      totalUsers: usersRes.count || 0,
      totalLawyers: lawyersRes.count || 0,
      pendingVerifications: pendingLawyersRes.data?.length || 0,
      totalVisas: visasRes.count || 0,
      totalBookings: bookingsRes.data?.length || 0,
      totalRevenue: totalRevenue,
      pendingTrackerEntries: trackerPendingRes.count || 0,
      recentSignups: recentCount,
    });

    // Process User Growth Chart
    if (userGrowthRes.data) {
      const growthMap = new Map<string, number>();
      userGrowthRes.data.forEach(profile => {
        const date = new Date(profile.created_at);
        const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        growthMap.set(key, (growthMap.get(key) || 0) + 1);
      });
      const chartData = Array.from(growthMap.entries()).map(([date, count]) => ({ date, count }));
      setUserGrowthData(chartData);
    }

    // Process Revenue Chart
    setRevenueData([
      { name: 'Consultations', value: bookingRevenue / 100, color: '#8b5cf6' },
      { name: 'Visa Guides', value: purchaseRevenue / 100, color: '#ec4899' },
    ]);

    // Process Tables
    if (pendingLawyersRes.data) {
      setPendingLawyers(pendingLawyersRes.data as unknown as PendingLawyer[]);
    }
    if (recentUsersRes.data) {
      setRecentUsers(recentUsersRes.data);
    }

    // Alerts
    const newAlerts = [];
    if (pendingLawyersRes.data && pendingLawyersRes.data.length > 0) {
      newAlerts.push({
        type: 'warning',
        message: `${pendingLawyersRes.data.length} lawyer${pendingLawyersRes.data.length > 1 ? 's' : ''} pending verification`,
        link: '/admin/lawyers',
      });
    }
    if (trackerPendingRes.count && trackerPendingRes.count > 0) {
      newAlerts.push({
        type: 'info',
        message: `${trackerPendingRes.count} tracker entries need review`,
        link: '/admin/tracker',
      });
    }
    setAlerts(newAlerts);
  };

  const handleApproveLawyer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lawyer_profiles')
        .update({
          verification_status: 'approved',
          is_verified: true
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving lawyer:', error);
    }
  };

  const handleRejectLawyer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lawyer_profiles')
        .update({
          verification_status: 'rejected'
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
    }
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Total Users,${stats.totalUsers}\n`
      + `Total Lawyers,${stats.totalLawyers}\n`
      + `Total Visas,${stats.totalVisas}\n`
      + `Total Bookings,${stats.totalBookings}\n`
      + `Total Revenue,${stats.totalRevenue}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={handleExportData} className="hidden sm:flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
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
              <Link to={alert.link} className="btn-secondary text-xs px-3 py-2 min-h-[32px]">
                Review
              </Link>
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              User Growth
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="date" stroke="#A3A3A3" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#A3A3A3" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="New Users" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Revenue Source
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                      formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
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

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Pending Verifications
            </h2>
            <Badge>{pendingLawyers.length}</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Lawyer</th>
                    <th className="px-4 py-3">Bar Number</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {pendingLawyers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                          No pending verifications
                        </td>
                      </tr>
                  ) : (
                    pendingLawyers.map((lawyer) => (
                      <tr key={lawyer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-neutral-900 dark:text-white">{lawyer.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-neutral-500">{lawyer.profiles?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {lawyer.bar_number}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs min-h-0"
                              onClick={() => handleApproveLawyer(lawyer.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              className="h-7 px-2 text-xs min-h-0"
                              onClick={() => handleRejectLawyer(lawyer.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Recent Registrations
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {recentUsers.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                          No recent registrations
                        </td>
                    </tr>
                  ) : (
                    recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-medium text-xs">
                              {user.full_name ? user.full_name[0] : user.role[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-white">{user.full_name || 'Anonymous'}</p>
                              <p className="text-xs text-neutral-500">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === 'lawyer' ? 'primary' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-neutral-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Platform Health & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                System Health
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Database Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Auth Service</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Storage</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
                <div className="flex items-center justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Edge Functions</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <MoreVertical className="w-5 h-5 text-purple-600" />
              Quick Actions
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link to="/admin/lawyers" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-neutral-800 group">
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">Verify Lawyers</h3>
                <p className="text-sm text-neutral-500">{stats.pendingVerifications} pending</p>
              </div>
              <span className="btn-secondary text-sm px-3 py-2 min-h-[36px] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-700">Review</span>
            </Link>

            <Link to="/admin/visas" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-neutral-800 group">
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">Manage Visas</h3>
                <p className="text-sm text-neutral-500">{stats.totalVisas} visa types</p>
              </div>
              <span className="btn-secondary text-sm px-3 py-2 min-h-[36px] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-700">Edit</span>
            </Link>

            <Link to="/admin/tracker" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-neutral-800 group">
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white">Review Tracker</h3>
                <p className="text-sm text-neutral-500">{stats.pendingTrackerEntries} pending</p>
              </div>
              <span className="btn-secondary text-sm px-3 py-2 min-h-[36px] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-700">Review</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
