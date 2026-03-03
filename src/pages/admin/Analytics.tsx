import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Calendar,
  Download,
  Briefcase,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

export function Analytics() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalVisas, setTotalVisas] = useState(0);
  
  // Chart data
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [visaCategoryData, setVisaCategoryData] = useState<any[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const daysAgo = parseInt(timeRange);
      const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      // Fetch counts
      const [
        usersRes,
        lawyersRes,
        bookingsRes,
        visasRes,
        userGrowthRes,
        visaCatsRes,
        bookingStatusRes
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('visas').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('created_at').eq('role', 'user').gte('created_at', since),
        supabase.from('visas').select('category'),
        supabase.from('bookings').select('status'),
      ]);

      setTotalUsers(usersRes.count || 0);
      setTotalLawyers(lawyersRes.count || 0);
      setTotalBookings(bookingsRes.count || 0);
      setTotalVisas(visasRes.count || 0);

      // Process user growth by day
      if (userGrowthRes.data) {
        const growthByDay: Record<string, number> = {};
        userGrowthRes.data.forEach((p) => {
          const date = new Date(p.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          growthByDay[date] = (growthByDay[date] || 0) + 1;
        });
        const chartData = Object.entries(growthByDay).map(([date, count]) => ({
          date,
          users: count,
        }));
        setUserGrowthData(chartData);
      }

      // Process visa categories
      if (visaCatsRes.data) {
        const cats: Record<string, number> = {};
        visaCatsRes.data.forEach((v) => {
          cats[v.category] = (cats[v.category] || 0) + 1;
        });
        const chartData = Object.entries(cats)
          .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setVisaCategoryData(chartData);
      }

      // Process booking statuses
      if (bookingStatusRes.data) {
        const statuses: Record<string, number> = {};
        bookingStatusRes.data.forEach((b) => {
          statuses[b.status] = (statuses[b.status] || 0) + 1;
        });
        const chartData = Object.entries(statuses).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));
        setBookingStatusData(chartData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast('error', 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = {
      totalUsers,
      totalLawyers,
      totalBookings,
      totalVisas,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast('success', 'Analytics exported');
  };

  const metrics = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Verified Lawyers', value: totalLawyers.toLocaleString(), icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Total Bookings', value: totalBookings.toLocaleString(), icon: Calendar, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Visa Types', value: totalVisas.toLocaleString(), icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Platform Analytics</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Traffic, engagement, and user behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{metric.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">User Signups</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {userGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No data available
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Visa Categories */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Visa Categories</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {visaCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visaCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {visaCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No data available
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Booking Status</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {bookingStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No data available
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Platform Stats Summary */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Platform Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600">Total Registered Users</span>
                <span className="font-bold">{totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600">Verified Lawyers</span>
                <span className="font-bold">{totalLawyers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600">Visa Types Available</span>
                <span className="font-bold">{totalVisas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600">Total Bookings</span>
                <span className="font-bold">{totalBookings.toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
