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
  Clock,
  ChevronRight,
  Gift,
  TrendingUp
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UserDashboardStats {
  savedVisas: number;
  myVisas: number;
  documents: number;
  upcomingConsultations: number;
  availableVisas: number;
}

export function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats>({
    savedVisas: 0,
    myVisas: 0,
    documents: 0,
    upcomingConsultations: 0,
    availableVisas: 86,
  });
  const [recentActivity] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchMyApplications();
      fetchAvailableVisas();
    }
  }, [user]);

  const fetchAvailableVisas = async () => {
    try {
      const { count } = await supabase
        .from('visas')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      setStats(prev => ({ ...prev, availableVisas: count || 86 }));
    } catch (err) {
      console.error('Error fetching visa count:', err);
    }
  };

  const fetchUserStats = async () => {
    if (!user?.id) return; // Add null check
    
    try {
      // Get counts via RPC for performance
      const { data, error } = await supabase.rpc('get_user_dashboard_stats');

      if (error) throw error;

      if (data) {
        const statsData = data as UserDashboardStats;
        setStats(prev => ({
          ...prev,
          savedVisas: statsData.savedVisas || 0,
          myVisas: statsData.myVisas || 0,
          documents: statsData.documents || 0,
          upcomingConsultations: statsData.upcomingConsultations || 0,
        }));
      }
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
    { to: '/visas', icon: Briefcase, label: 'Find Visas', desc: 'Search 86+ visa options' },
    { to: '/tracker', icon: TrendingUp, label: 'Track Application', desc: 'Check processing times' },
    { to: '/lawyers', icon: User, label: 'Find Lawyer', desc: 'Book consultation' },
    { to: '/quiz', icon: Gift, label: 'Visa Quiz', desc: 'Find your best match' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 p-8 sm:p-10 shadow-lg border border-indigo-700/50 text-white">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Welcome Back!</h1>
            <p className="text-indigo-200 text-lg max-w-xl">Here's what's happening with your visa journey today.</p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/20 shadow-sm">
              Applicant Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Saved Visas', value: stats.savedVisas, icon: Heart, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800/50' },
          { label: 'My Visas', value: stats.myVisas, icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800/50' },
          { label: 'Available', value: stats.availableVisas, icon: TrendingUp, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800/50' },
          { label: 'Documents', value: stats.documents, icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800/50' },
          { label: 'Meetings', value: stats.upcomingConsultations, icon: Calendar, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800/50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* My Applications Tracker */}
      {myApplications.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Applications</h2>
          </div>
          <div className="grid gap-6">
            {myApplications.map((app: any) => (
              <Card key={app.id} className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wider">
                        {app.visas.subclass}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.visas.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-sm font-semibold">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      In Progress
                    </span>
                  </div>
                </div>
                <CardBody className="p-6">
                  <div className="mb-6 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <p>Applied: <span className="font-medium text-slate-900 dark:text-slate-200">{new Date(app.application_date).toLocaleDateString()}</span></p>
                    <p>Elapsed: <span className="font-medium text-slate-900 dark:text-slate-200">{Math.floor((Date.now() - new Date(app.application_date).getTime()) / (1000 * 60 * 60 * 24))} days</span></p>
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

      {/* Main Grid: Quick Actions & Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all duration-200">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{action.label}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{action.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 flex flex-col h-full">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          <Card className="flex-1 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardBody className="h-full">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 min-h-[200px]">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-200 mb-1">No recent activity</p>
                  <p className="text-sm text-center max-w-[200px]">Start your journey by exploring visas or taking the quiz</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">Just now</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recommended Visas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
          <Link to="/visas" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { subclass: '189', name: 'Skilled Independent', desc: 'Permanent visa for invited workers' },
            { subclass: '500', name: 'Student Visa', desc: 'Study full-time in Australia' },
            { subclass: '417', name: 'Working Holiday', desc: 'Work and travel for young adults' }
          ].map((visa) => (
            <div key={visa.subclass} className="group relative p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-wider mb-4">
                SUBCLASS {visa.subclass}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 pr-12">{visa.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{visa.desc}</p>

              <Link to={`/visas/${visa.subclass}`} className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl text-sm font-semibold transition-colors">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
