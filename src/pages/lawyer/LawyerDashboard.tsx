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
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function LawyerDashboard() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingConsultations: 0,
    completedConsultations: 0,
    pendingReviews: 0,
    averageRating: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      const timer = setTimeout(() => {
        fetchLawyerData();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchLawyerData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user?.id) {
        setError('User not authenticated');
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        setError('Failed to load profile');
        return;
      }
      
      if (!profile) {
        setError('Profile not found');
        return;
      }
      
      setLawyerProfile(profile);

      const [{ count: clients }, { count: upcoming }, { count: completed }] = await Promise.all([
        supabase.from('bookings').select('user_id', { count: 'exact', head: true }).eq('lawyer_id', user.id),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('lawyer_id', user.id).eq('status', 'confirmed'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('lawyer_id', user.id).eq('status', 'completed'),
      ]);

      setStats({
        totalClients: clients || 0,
        upcomingConsultations: upcoming || 0,
        completedConsultations: completed || 0,
        pendingReviews: 0,
        averageRating: 4.8,
        totalEarnings: completed ? completed * 150 : 0,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-navy-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-heading font-bold text-navy-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <Button onClick={fetchLawyerData}>Retry</Button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { to: '/lawyer/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/lawyer/clients', icon: Users, label: 'Clients', active: false },
    { to: '/lawyer/consultations', icon: Calendar, label: 'Consultations', active: false },
    { to: '/lawyer/availability', icon: Clock, label: 'Availability', active: false },
    { to: '/lawyer/settings', icon: Settings, label: 'Settings', active: false },
  ];

  const isVerified = lawyerProfile?.verification_status === 'approved';

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden lg:block">
        <div className="p-4 border-b border-neutral-200">
          <Link to="/" className="font-heading font-bold text-xl text-navy-600">VisaBuild</Link>
          <p className="text-xs text-neutral-500">Lawyer Portal</p>
        </div>
        
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  item.active
                    ? 'bg-navy-50 text-navy-700 border-l-2 border-navy-600'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-navy-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-neutral-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-navy-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy-700 text-sm truncate">{user?.email}</p>
              <div className="flex items-center gap-1">
                {isVerified ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-600">Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={signOut}
            className="flex items-center gap-2 mt-3 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-navy-700">Lawyer Dashboard</h1>
              <p className="text-neutral-600 text-sm">Manage your practice and clients</p>
            </div>
            <Badge variant={isVerified ? 'success' : 'warning'}>
              {isVerified ? 'Verified Lawyer' : 'Verification Pending'}
            </Badge>
          </div>
        </header>

        <div className="p-6 max-w-7xl">
          {/* Verification Alert */}
          {!isVerified && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">Verification Pending</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Your account is being reviewed. You\'ll be able to accept clients once verified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {[
              { icon: Users, value: stats.totalClients, label: 'Total Clients', color: 'text-navy-600', bg: 'bg-navy-50' },
              { icon: Calendar, value: stats.upcomingConsultations, label: 'Upcoming', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: CheckCircle, value: stats.completedConsultations, label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Star, value: stats.averageRating, label: 'Rating', color: 'text-gold-600', bg: 'bg-gold-50' },
              { icon: DollarSign, value: `$${stats.totalEarnings}`, label: 'Earnings', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: TrendingUp, value: stats.pendingReviews, label: 'Reviews', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, index) => (
              <Card key={index}>
                <CardBody className="text-center p-4">
                  <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold text-navy-700">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="bg-navy-50">
                <h2 className="font-heading font-bold text-navy-700">Quick Actions</h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-neutral-200">
                  <Link to="/lawyer/availability" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-navy-600" />
                      <div>
                        <p className="font-medium text-navy-700">Set Availability</p>
                        <p className="text-sm text-neutral-500">Manage consultation slots</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Manage</Button>
                  </Link>

                  <Link to="/lawyer/clients" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-navy-600" />
                      <div>
                        <p className="font-medium text-navy-700">View Clients</p>
                        <p className="text-sm text-neutral-500">See your client list</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </Link>

                  <Link to="/lawyer/settings" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-navy-600" />
                      <div>
                        <p className="font-medium text-navy-700">Profile Settings</p>
                        <p className="text-sm text-neutral-500">Update your information</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>

            {/* Upcoming Consultations */}
            <Card>
              <CardHeader className="bg-navy-50">
                <h2 className="font-heading font-bold text-navy-700">Upcoming Consultations</h2>
              </CardHeader>
              <CardBody>
                {stats.upcomingConsultations === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">No upcoming consultations</p>
                    <Link to="/lawyer/availability">
                      <Button variant="secondary" className="mt-4">Set Availability</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-50 border border-neutral-200">
                      <p className="text-sm text-neutral-700">Consultations will appear here</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Profile Completion */}
          <Card className="mt-6">
            <CardHeader className="bg-navy-50">
              <h2 className="font-heading font-bold text-navy-700">Profile Completion</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {[
                  { label: 'Basic Information', complete: true },
                  { label: 'Bar Number Verification', complete: true },
                  { label: 'Account Verification', complete: isVerified },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center ${
                        item.complete ? 'bg-green-100' : 'bg-neutral-100'
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${
                          item.complete ? 'text-green-600' : 'text-neutral-400'
                        }`} />
                      </div>
                      <span className="text-neutral-700">{item.label}</span>
                    </div>
                    <Badge variant={item.complete ? 'success' : 'default'}>
                      {item.complete ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
