import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  Briefcase,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function LawyerDashboard() {
  const { user } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
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
    // Get lawyer profile
    const { data: profile } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    
    setLawyerProfile(profile);

    // Get stats
    const [{ count: clients }, { count: upcoming }, { count: completed }] = await Promise.all([
      supabase.from('bookings').select('user_id', { count: 'exact', head: true }).eq('lawyer_id', profile?.id),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('lawyer_id', profile?.id).eq('status', 'confirmed').gte('scheduled_at', new Date().toISOString()),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('lawyer_id', profile?.id).eq('status', 'completed'),
      supabase.from('lawyer_reviews').select('id', { count: 'exact' }).eq('lawyer_id', profile?.id),
    ]);

    setStats({
      totalClients: clients || 0,
      upcomingConsultations: upcoming || 0,
      completedConsultations: completed || 0,
      pendingReviews: 0,
      averageRating: 4.8,
      totalEarnings: completed ? completed * 150 : 0,
    });
  };

  const sidebarItems = [
    { to: '/lawyer/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/lawyer/clients', icon: Users, label: 'Clients' },
    { to: '/lawyer/consultations', icon: Calendar, label: 'Consultations' },
    { to: '/lawyer/availability', icon: Clock, label: 'Availability' },
    { to: '/lawyer/marketing', icon: TrendingUp, label: 'Marketing' },
    { to: '/lawyer/reviews', icon: Star, label: 'Reviews' },
    { to: '/lawyer/settings', icon: Settings, label: 'Settings' },
  ];

  const isVerified = lawyerProfile?.verification_status === 'approved';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 hidden lg:block">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <Link to="/" className="font-bold text-xl text-primary-600">VisaBuild</Link>
          <p className="text-xs text-neutral-500 mt-1">Lawyer Portal</p>
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
        </nav>

        {/* Lawyer Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{user?.email}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-neutral-500">Lawyer</p>
                {isVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lawyer Dashboard</h1>
              <p className="text-neutral-600 dark:text-neutral-300">Manage your practice and clients</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isVerified 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              }`}>
                {isVerified ? 'Verified Lawyer' : 'Pending Verification'}
              </span>
              <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Verification Alert */}
          {!isVerified && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Verification Pending</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Your account is being reviewed. You'll be able to accept clients once verified.
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardBody className="text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalClients}</p>
                <p className="text-xs text-neutral-500">Total Clients</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.upcomingConsultations}</p>
                <p className="text-xs text-neutral-500">Upcoming</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.completedConsultations}</p>
                <p className="text-xs text-neutral-500">Completed</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.averageRating}</p>
                <p className="text-xs text-neutral-500">Avg Rating</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">${stats.totalEarnings}</p>
                <p className="text-xs text-neutral-500">Earnings</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <MessageSquare className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.pendingReviews}</p>
                <p className="text-xs text-neutral-500">Reviews</p>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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

                <Link to="/lawyer/clients" className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">View Clients</h3>
                      <p className="text-sm text-neutral-500">See your client list</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">View</Button>
                </Link>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upcoming Consultations</h2>
              </CardHeader>
              <CardBody>
                {stats.upcomingConsultations === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming consultations</p>
                    <p className="text-sm">Set your availability to get bookings</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">Sample booking would appear here</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Profile Completion</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">Basic Information</span>
                  </div>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">Bar Number Verification</span>
                  </div>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isVerified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    <span className="text-neutral-700 dark:text-neutral-300">Account Verification</span>
                  </div>
                  <Badge variant={isVerified ? 'success' : 'warning'}>
                    {isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
