import { useEffect, useState } from 'react';
import {
  Users, Scale, FileText, DollarSign, BarChart3, ShieldCheck,
  ExternalLink, UserPlus, FileEdit, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/ui/Loading';

interface DashboardStats {
  users: number;
  lawyers: number;
  pendingLawyers: number;
  purchases: number;
  bookings: number;
  submissions: number;
}

interface ActivityItem {
  id: string;
  type: 'signup' | 'purchase' | 'booking';
  description: string;
  date: string;
  status?: string;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    lawyers: 0,
    pendingLawyers: 0,
    purchases: 0,
    bookings: 0,
    submissions: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [signupData, setSignupData] = useState<{ date: string; count: number }[]>([]);
  const [purchaseData, setPurchaseData] = useState<{ date: string; count: number }[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Counts
      const [
        usersRes,
        lawyersRes,
        pendingLawyersRes,
        purchasesRes,
        bookingsRes,
        submissionsRes
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'lawyer'),
        supabase.schema('lawyer').from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        supabase.from('user_visa_purchases').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('tracker_entries').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        users: usersRes.count || 0,
        lawyers: lawyersRes.count || 0,
        pendingLawyers: pendingLawyersRes.count || 0,
        purchases: purchasesRes.count || 0,
        bookings: bookingsRes.count || 0,
        submissions: submissionsRes.count || 0,
      });

      // 2. Fetch Recent Activity & Chart Data
      // For charts, we need last 7 days. Ideally done with date filtering on server.
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const isoDate = sevenDaysAgo.toISOString();

      const [
        recentSignups,
        recentPurchases,
        recentBookings,
        chartSignups,
        chartPurchases,
        allBookings
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, created_at, role').order('created_at', { ascending: false }).limit(10),
        supabase.from('user_visa_purchases').select('id, amount_cents, purchased_at, visas(name), profiles(full_name)').order('purchased_at', { ascending: false }).limit(10),
        supabase.from('bookings').select('id, user_id, lawyer_id, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('created_at').gte('created_at', isoDate),
        supabase.from('user_visa_purchases').select('purchased_at').gte('purchased_at', isoDate),
        supabase.from('bookings').select('status')
      ]);

      // Handle Bookings Relations Manually to avoid cross-schema join issues
      const bookingUserIds = new Set(recentBookings.data?.map(b => b.user_id).filter(Boolean) || []);
      const bookingLawyerIds = new Set(recentBookings.data?.map(b => b.lawyer_id).filter(Boolean) || []);

      // Fetch user names for bookings
      const { data: bookingUsers } = await supabase.from('profiles').select('id, full_name').in('id', Array.from(bookingUserIds));
      const bookingUserMap = new Map(bookingUsers?.map(u => [u.id, u.full_name]) || []);

      // Fetch lawyer names: bookings.lawyer_id -> lawyer.profiles.id -> lawyer.profiles.profile_id -> public.profiles.id -> public.profiles.full_name
      const { data: lawyerProfiles } = await supabase.schema('lawyer').from('profiles').select('id, profile_id').in('id', Array.from(bookingLawyerIds));
      const lawyerProfileMap = new Map(lawyerProfiles?.map(l => [l.id, l.profile_id]) || []);

      const lawyerPublicProfileIds = new Set(lawyerProfiles?.map(l => l.profile_id).filter(Boolean) || []);
      const { data: lawyerPublicProfiles } = await supabase.from('profiles').select('id, full_name').in('id', Array.from(lawyerPublicProfileIds));
      const lawyerNameMap = new Map(lawyerPublicProfiles?.map(l => [l.id, l.full_name]) || []);

      // Process Recent Activity
      const activities: ActivityItem[] = [];

      recentSignups.data?.forEach(u => activities.push({
        id: u.id,
        type: 'signup',
        description: `New user signup: ${u.full_name || 'Unnamed'} (${u.role})`,
        date: u.created_at
      }));

      recentPurchases.data?.forEach(p => activities.push({
        id: p.id,
        type: 'purchase',
        description: `Purchase: ${(p.visas as any)?.name || 'Visa'} by ${(p.profiles as any)?.full_name || 'User'}`,
        date: p.purchased_at
      }));

      recentBookings.data?.forEach(b => {
        const userName = bookingUserMap.get(b.user_id) || 'User';
        const lawyerProfileId = lawyerProfileMap.get(b.lawyer_id);
        const lawyerName = lawyerProfileId ? (lawyerNameMap.get(lawyerProfileId) || 'Lawyer') : 'Lawyer';

        activities.push({
          id: b.id,
          type: 'booking',
          description: `Booking: ${userName} with ${lawyerName}`,
          date: b.created_at,
          status: b.status
        });
      });

      // Sort and take top 10 combined
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activities.slice(0, 10));

      // Process Chart Data (Signups)
      const signupMap = new Map<string, number>();
      chartSignups.data?.forEach(s => {
        const date = new Date(s.created_at).toLocaleDateString();
        signupMap.set(date, (signupMap.get(date) || 0) + 1);
      });
      const signupChart = Array.from(signupMap.entries()).map(([date, count]) => ({ date, count })).reverse(); // Simple reverse might not be chronological if map iteration order varies, but usually fine for recent. better to sort.
      signupChart.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSignupData(signupChart);

      // Process Chart Data (Purchases)
      const purchaseMap = new Map<string, number>();
      chartPurchases.data?.forEach(p => {
        const date = new Date(p.purchased_at).toLocaleDateString();
        purchaseMap.set(date, (purchaseMap.get(date) || 0) + 1);
      });
      const purchaseChart = Array.from(purchaseMap.entries()).map(([date, count]) => ({ date, count }));
      purchaseChart.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setPurchaseData(purchaseChart);

      // Process Chart Data (Bookings Status)
      const statusCounts = new Map<string, number>();
      allBookings.data?.forEach(b => {
        statusCounts.set(b.status, (statusCounts.get(b.status) || 0) + 1);
      });
      const statusChart = Array.from(statusCounts.entries()).map(([name, value]) => ({ name, value }));
      setBookingStatusData(statusChart);

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-1">Platform overview and key metrics.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/users">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center gap-2">
              <UserPlus className="w-8 h-8 text-primary-600" />
              <span className="font-medium text-neutral-900">Manage Users</span>
            </CardBody>
          </Card>
        </Link>
        <Link to="/admin/lawyers">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <span className="font-medium text-neutral-900">Approve Lawyers</span>
            </CardBody>
          </Card>
        </Link>
        <Link to="/admin/visas">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center gap-2">
              <FileEdit className="w-8 h-8 text-amber-600" />
              <span className="font-medium text-neutral-900">Manage Visas</span>
            </CardBody>
          </Card>
        </Link>
        <Link to="/admin/news">
          <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center gap-2">
              <ExternalLink className="w-8 h-8 text-indigo-600" />
              <span className="font-medium text-neutral-900">Publish News</span>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="Total Users" value={stats.users} icon={Users} color="bg-sky-50 text-sky-600" />
        <StatsCard label="Total Lawyers" value={stats.lawyers} icon={Scale} color="bg-emerald-50 text-emerald-600" />
        <StatsCard label="Pending Verifications" value={stats.pendingLawyers} icon={ShieldCheck} color="bg-amber-50 text-amber-600" />
        <StatsCard label="Premium Purchases" value={stats.purchases} icon={DollarSign} color="bg-primary-50 text-primary-600" />
        <StatsCard label="Total Bookings" value={stats.bookings} icon={FileText} color="bg-indigo-50 text-indigo-600" />
        <StatsCard label="Visa Submissions" value={stats.submissions} icon={BarChart3} color="bg-rose-50 text-rose-600" />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Signups & Purchases (Last 7 Days)</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mergeChartData(signupData, purchaseData)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="signups" fill="#0ea5e9" name="Signups" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="purchases" fill="#22c55e" name="Purchases" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Bookings by Status</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
        </CardHeader>
        <div className="divide-y divide-neutral-100">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No recent activity found.</div>
          ) : (
            recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{activity.description}</p>
                    <p className="text-xs text-neutral-500">{new Date(activity.date).toLocaleString()}</p>
                  </div>
                </div>
                {activity.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <p className="text-xs text-neutral-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function mergeChartData(signups: { date: string; count: number }[], purchases: { date: string; count: number }[]) {
  const map = new Map<string, { date: string; signups: number; purchases: number }>();

  signups.forEach(s => {
    map.set(s.date, { date: s.date, signups: s.count, purchases: 0 });
  });

  purchases.forEach(p => {
    const existing = map.get(p.date) || { date: p.date, signups: 0, purchases: 0 };
    existing.purchases = p.count;
    map.set(p.date, existing);
  });

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return result;
}

function getActivityColor(type: string) {
  switch (type) {
    case 'signup': return 'bg-sky-100 text-sky-600';
    case 'purchase': return 'bg-emerald-100 text-emerald-600';
    case 'booking': return 'bg-indigo-100 text-indigo-600';
    default: return 'bg-neutral-100 text-neutral-600';
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'signup': return <UserPlus className="w-5 h-5" />;
    case 'purchase': return <DollarSign className="w-5 h-5" />;
    case 'booking': return <FileText className="w-5 h-5" />;
    default: return <AlertCircle className="w-5 h-5" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-800';
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-sky-100 text-sky-800';
    default: return 'bg-neutral-100 text-neutral-800';
  }
}
