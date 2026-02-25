import { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  Bell,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRealtime } from '../../hooks/useRealtime';

// Mock Data
const WEEKLY_EARNINGS = [
  { name: 'Mon', amount: 150 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 450 },
  { name: 'Thu', amount: 300 },
  { name: 'Fri', amount: 600 },
  { name: 'Sat', amount: 150 },
  { name: 'Sun', amount: 0 },
];

const MONTHLY_EARNINGS = [
  { name: 'Week 1', amount: 1200 },
  { name: 'Week 2', amount: 1500 },
  { name: 'Week 3', amount: 1800 },
  { name: 'Week 4', amount: 2200 },
];

const MOCK_DOCUMENTS = [
  { id: '1', documentName: 'Passport Copy', clientName: 'Sarah Johnson', date: '2024-03-10' },
  { id: '2', documentName: 'Employment Contract', clientName: 'James Rodriguez', date: '2024-03-11' },
  { id: '3', documentName: 'Form 80', clientName: 'Michael Chen', date: '2024-03-12' },
];

export function LawyerDashboard() {
  const { user } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [earningsView, setEarningsView] = useState<'weekly' | 'monthly'>('weekly');
  const [isAvailable, setIsAvailable] = useState(true);
  const [initialBookings, setInitialBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingConsultations: 0,
    completedConsultations: 0,
    pendingReviews: 0,
    averageRating: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    if (user) {
      fetchLawyerData();
    }
  }, [user]);

  const fetchLawyerData = async () => {
    if (!user?.id) return;

    // Parallelize all fetches using user.id
    const profilePromise = supabase
      .from('lawyer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Filter by related table lawyer_profiles.user_id
    const bookingsPromise = supabase
      .from('bookings')
      .select('*, user:user_id(full_name, email), lawyer_profiles!inner(user_id)')
      .eq('lawyer_profiles.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const clientsCountPromise = supabase
      .from('bookings')
      .select('user_id, lawyer_profiles!inner(user_id)', { count: 'exact', head: true })
      .eq('lawyer_profiles.user_id', user.id);

    const upcomingCountPromise = supabase
      .from('bookings')
      .select('id, lawyer_profiles!inner(user_id)', { count: 'exact' })
      .eq('lawyer_profiles.user_id', user.id)
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date().toISOString());

    const completedCountPromise = supabase
      .from('bookings')
      .select('id, lawyer_profiles!inner(user_id)', { count: 'exact' })
      .eq('lawyer_profiles.user_id', user.id)
      .eq('status', 'completed');

    const [
      { data: profile },
      { data: fetchedBookings },
      { count: clients },
      { count: upcoming },
      { count: completed }
    ] = await Promise.all([
      profilePromise,
      bookingsPromise,
      clientsCountPromise,
      upcomingCountPromise,
      completedCountPromise
    ]);

    if (profile) {
      setLawyerProfile(profile);
    }

    setInitialBookings(fetchedBookings || []);

    setStats({
      totalClients: clients || 0,
      upcomingConsultations: upcoming || 0,
      completedConsultations: completed || 0,
      pendingReviews: 2,
      averageRating: 4.9,
      totalEarnings: completed ? completed * 150 : 0,
    });
  };

  const bookings = useRealtime('bookings', initialBookings, {
    filter: lawyerProfile ? `lawyer_id=eq.${lawyerProfile.id}` : undefined,
    enabled: !!lawyerProfile,
    fetchRow: async (id) => {
      const { data } = await supabase
        .from('bookings')
        .select('*, user:user_id(full_name, email)')
        .eq('id', id)
        .single();
      return data;
    }
  });

  const clientData = bookings.map(b => ({
    id: b.id,
    name: b.user?.full_name || b.user?.email || 'Unknown Client',
    status: b.status,
    service: b.notes ? (b.notes.length > 30 ? b.notes.substring(0, 30) + '...' : b.notes) : 'General Consultation',
    nextAction: b.status === 'pending' ? 'Review Request' : b.status === 'confirmed' ? 'Prepare for Meeting' : 'View Details',
    date: new Date(b.created_at).toLocaleDateString()
  }));

  const clientColumns: Column<any>[] = [
    {
      key: 'name',
      header: 'Client',
      render: (row) => (
        <div className="font-medium text-neutral-900 dark:text-white">{row.name}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={
          row.status === 'confirmed' ? 'success' :
          row.status === 'pending' ? 'warning' : 'default'
        }>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      render: (row) => <span className="text-neutral-600 dark:text-neutral-300">{row.service}</span>,
    },
    {
      key: 'nextAction',
      header: 'Next Action',
      render: (row) => <span className="text-sm text-neutral-500">{row.nextAction}</span>,
    },
  ];

  const isVerified = lawyerProfile?.verification_status === 'approved';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lawyer Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Welcome back, manage your practice.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-neutral-400'}`} />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className="ml-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Change
            </button>
          </div>

          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
            isVerified
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
          }`}>
            {isVerified ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {isVerified ? 'Verified' : 'Pending'}
          </span>

          <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-800"></span>
          </button>
        </div>
      </div>

      {/* Verification Alert */}
      {!isVerified && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Verification Pending</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your account is currently under review. Complete your profile to expedite the process.
            </p>
            <Button variant="secondary" size="sm" className="mt-3 border-yellow-600 text-yellow-700 hover:bg-yellow-100">
              Complete Profile
            </Button>
          </div>
        </div>
      )}

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Response Time</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">1.5 hrs</p>
              <span className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> -15%
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Satisfaction</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{stats.averageRating}/5.0</p>
              <span className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +0.2
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Clients</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{stats.totalClients}</p>
              <span className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +3 this week
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Earnings</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">${stats.totalEarnings}</p>
              <span className="text-xs text-neutral-500">Lifetime</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Earnings Overview</h2>
              <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setEarningsView('weekly')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    earningsView === 'weekly'
                      ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setEarningsView('monthly')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    earningsView === 'monthly'
                      ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsView === 'weekly' ? WEEKLY_EARNINGS : MONTHLY_EARNINGS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                    <XAxis
                      dataKey="name"
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#A3A3A3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      barSize={earningsView === 'weekly' ? 32 : 48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Client Management Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Clients</h2>
              <Button variant="ghost" size="sm" className="text-primary-600">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardBody>
              <DataTable
                columns={clientColumns}
                data={clientData}
                keyExtractor={(row) => row.id}
                searchable={false}
                pageSize={5}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Availability Widget (Mobile/Tablet visible if needed, kept in header for desktop usually but good to have explicit control here too) */}
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-neutral-800 border-green-100 dark:border-green-900/30">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Availability Status</h3>
                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`} />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                {isAvailable
                  ? "You are currently visible to potential clients for new consultations."
                  : "You are currently set as away. Clients cannot book new slots."}
              </p>
              <Button
                variant={isAvailable ? "secondary" : "primary"}
                className="w-full"
                onClick={() => setIsAvailable(!isAvailable)}
              >
                {isAvailable ? 'Set as Away' : 'Set as Available'}
              </Button>
            </CardBody>
          </Card>

          {/* Document Review Queue */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-neutral-500" />
                Review Queue
              </h2>
              <Badge variant="warning" className="rounded-full px-2">3</Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              {MOCK_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">{doc.documentName}</p>
                    <p className="text-xs text-neutral-500 truncate">For {doc.clientName}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="h-8 text-xs">Review</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-neutral-500 text-xs">View All Pending Reviews</Button>
            </CardBody>
          </Card>

          {/* Marketing Reach */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-neutral-500" />
                Marketing Reach
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Profile Views</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">1,248</p>
                </div>
                <div className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12%
                </div>
              </div>
              <div className="w-full h-px bg-neutral-100 dark:bg-neutral-700" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Inquiries</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">34</p>
                </div>
                <div className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +5%
                </div>
              </div>
              <div className="w-full h-px bg-neutral-100 dark:bg-neutral-700" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Conversion Rate</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">4.2%</p>
                </div>
                <div className="text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                  Stable
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
