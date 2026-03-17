import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrackerTimeline } from '../../components/tracker/TrackerTimeline';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Heart, 
  User,
  Bell,
  TrendingUp,
  Clock,
  ChevronRight,
  Gift
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UserDashboardStats {
  savedVisas: number;
  myVisas: number;
  documents: number;
  upcomingConsultations: number;
}

export function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats>({
    savedVisas: 0,
    myVisas: 0,
    documents: 0,
    upcomingConsultations: 0,
  });
  const [recentActivity] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchMyApplications();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user?.id) return;
    
    try {
      const [{ count: savedVisas }, { count: myVisas }, { count: documents }, { count: upcomingConsultations }] = await Promise.all([
        supabase.from('saved_visas').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_visas').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_documents').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id).gte('scheduled_at', new Date().toISOString()),
      ]);

      setStats({
        savedVisas: savedVisas || 0,
        myVisas: myVisas || 0,
        documents: documents || 0,
        upcomingConsultations: upcomingConsultations || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchMyApplications = async () => {
    if (!user?.id) return;
    
    try {
      const { data } = await supabase
        .from('tracker_entries')
        .select('*, visas(name, subclass)')
        .eq('submitted_by', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setMyApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setMyApplications([]);
    }
  };

  const quickActions = [
    { to: '/visas', icon: Briefcase, label: 'Find Visas', desc: 'Search 78+ visa options' },
    { to: '/tracker', icon: TrendingUp, label: 'Track Application', desc: 'Check processing times' },
    { to: '/lawyers', icon: User, label: 'Find Lawyer', desc: 'Book consultation' },
    { to: '/quiz', icon: Gift, label: 'Visa Quiz', desc: 'Find your best match' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome Back!</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Here's what's happening with your visa journey</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            Applicant
          </span>
          <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* My Applications Tracker */}
      {myApplications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">My Application Journey</h2>
          <div className="grid gap-6">
            {myApplications.map((app: any) => (
              <Card key={app.id}>
                <CardBody>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{app.visas.subclass} - {app.visas.name}</h3>
                      <p className="text-sm text-neutral-500">Applied on {new Date(app.application_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">In Progress</p>
                      <p className="text-xs text-neutral-500">{Math.floor((Date.now() - new Date(app.application_date).getTime()) / (1000 * 60 * 60 * 24))} days elapsed</p>
                    </div>
                  </div>

                  <TrackerTimeline
                    steps={[
                      { id: '1', label: 'Received', status: 'completed', date: new Date(app.application_date).toLocaleDateString() },
                      { id: '2', label: 'Processing', status: 'current', description: 'Your application is being assessed by the Department.' },
                      { id: '3', label: 'Final Decision', status: 'upcoming' }
                    ]}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.savedVisas}</p>
              <p className="text-sm text-neutral-500">Saved Visas</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.myVisas}</p>
              <p className="text-sm text-neutral-500">My Visas</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.documents}</p>
              <p className="text-sm text-neutral-500">Documents</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.upcomingConsultations}</p>
              <p className="text-sm text-neutral-500">Consultations</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-medium text-neutral-900 dark:text-white">{action.label}</h3>
                  <p className="text-sm text-neutral-500">{action.desc}</p>
                </Link>
              );
            })}
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
                <p className="text-sm">Start by exploring visas or taking the quiz</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full" />
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recommended Visas */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recommended for You</h2>
          <Link to="/visas" className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Skilled Independent (189)</h3>
              <p className="text-sm text-neutral-500 mt-1">Permanent visa for skilled workers</p>
              <Link to="/visas/189" className="mt-3 btn-secondary text-sm px-3 py-2 min-h-[44px] sm:min-h-[36px]">
                Learn More
              </Link>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Student Visa (500)</h3>
              <p className="text-sm text-neutral-500 mt-1">Study at Australian institutions</p>
              <Link to="/visas/500" className="mt-3 btn-secondary text-sm px-3 py-2 min-h-[44px] sm:min-h-[36px]">
                Learn More
              </Link>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Working Holiday (417)</h3>
              <p className="text-sm text-neutral-500 mt-1">Work and travel in Australia</p>
              <Link to="/visas/417" className="mt-3 btn-secondary text-sm px-3 py-2 min-h-[44px] sm:min-h-[36px]">
                Learn More
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
