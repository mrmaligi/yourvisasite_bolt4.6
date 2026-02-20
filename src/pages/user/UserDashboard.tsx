import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedVisas: 0,
    myVisas: 0,
    documents: 0,
    upcomingConsultations: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    // Get counts
    const [{ count: saved }, { count: my }, { count: docs }, { count: consultations }] = await Promise.all([
      supabase.from('saved_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_documents').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id).gte('scheduled_at', new Date().toISOString()),
    ]);

    setStats({
      savedVisas: saved || 0,
      myVisas: my || 0,
      documents: docs || 0,
      upcomingConsultations: consultations || 0,
    });
  };

  const quickActions = [
    { to: '/visas', icon: Briefcase, label: 'Find Visas', desc: 'Search 78+ visa options' },
    { to: '/tracker', icon: TrendingUp, label: 'Track Application', desc: 'Check processing times' },
    { to: '/lawyers', icon: User, label: 'Find Lawyer', desc: 'Book consultation' },
    { to: '/quiz', icon: Gift, label: 'Visa Quiz', desc: 'Find your best match' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
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
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
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
              <Briefcase className="w-6 h-6 text-green-600" />
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
              <FileText className="w-6 h-6 text-purple-600" />
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
              <Calendar className="w-6 h-6 text-orange-600" />
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
                  <Icon className="w-6 h-6 text-primary-600 mb-2" />
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
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
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
          <Link to="/visas" className="text-primary-600 hover:underline text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Skilled Independent (189)</h3>
              <p className="text-sm text-neutral-500 mt-1">Permanent visa for skilled workers</p>
              <Button variant="secondary" size="sm" className="mt-3" as={Link} to="/visas/189">
                Learn More
              </Button>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Student Visa (500)</h3>
              <p className="text-sm text-neutral-500 mt-1">Study at Australian institutions</p>
              <Button variant="secondary" size="sm" className="mt-3" as={Link} to="/visas/500">
                Learn More
              </Button>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Working Holiday (417)</h3>
              <p className="text-sm text-neutral-500 mt-1">Work and travel in Australia</p>
              <Button variant="secondary" size="sm" className="mt-3" as={Link} to="/visas/417">
                Learn More
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
