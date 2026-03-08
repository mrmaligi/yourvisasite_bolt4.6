import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Briefcase, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function AdminDashboardV2() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalVisas: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: users }, { count: lawyers }, { count: visas }] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('visas').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: users || 0,
        totalLawyers: lawyers || 0,
        totalVisas: visas || 0,
        totalRevenue: 125000,
      });
    };

    fetchStats();
  }, []);

  const recentActivity = [
    { id: '1', type: 'user', message: 'New user registered: john@example.com', time: '2 min ago' },
    { id: '2', type: 'lawyer', message: 'Lawyer verified: Sarah Johnson', time: '15 min ago' },
    { id: '3', type: 'payment', message: 'Payment received: $299', time: '1 hour ago' },
    { id: '4', type: 'visa', message: 'New visa added: Subclass 189', time: '2 hours ago' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Platform overview and management</p>
              </div>
              <Button variant="primary">
                <Activity className="w-4 h-4 mr-2" />
                System Health
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Lawyers', value: stats.totalLawyers, icon: Briefcase, color: 'bg-green-100 text-green-600' },
              { label: 'Visas', value: stats.totalVisas, icon: FileText, color: 'bg-purple-100 text-purple-600' },
              { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-amber-100 text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity - SQUARE */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                </div>
                
                <div className="divide-y divide-slate-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                        {activity.type === 'user' && <Users className="w-5 h-5 text-slate-600" />}
                        {activity.type === 'lawyer' && <Briefcase className="w-5 h-5 text-slate-600" />}
                        {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-slate-600" />}
                        {activity.type === 'visa' && <FileText className="w-5 h-5 text-slate-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-slate-900">{activity.message}</p>
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                      
                      <Badge variant="secondary">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions - SQUARE */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">Manage Users</Button>
                  <Button variant="outline" className="w-full">Manage Lawyers</Button>
                  <Button variant="outline" className="w-full">Manage Visas</Button>
                  <Button variant="outline" className="w-full">View Reports</Button>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-6">
                <h3 className="font-semibold mb-2">System Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Database: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-sm">API: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Payments: Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
