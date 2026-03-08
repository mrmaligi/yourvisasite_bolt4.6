import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Calendar, 
  DollarSign,
  Star,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function LawyerDashboardV2() {
  const { user } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    clients: 0,
    consultations: 0,
    earnings: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const { data: profile } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setLawyerProfile(profile);
      
      // Mock stats for now
      setStats({
        clients: 24,
        consultations: 156,
        earnings: 12500,
        rating: 4.8,
      });
    };
    
    fetchData();
  }, [user]);

  const recentActivity = [
    { id: '1', type: 'consultation', client: 'Sarah Johnson', time: '2 hours ago' },
    { id: '2', type: 'document', client: 'James Rodriguez', time: '4 hours ago' },
    { id: '3', type: 'booking', client: 'Michael Chen', time: '1 day ago' },
  ];

  return (
    <>
      <Helmet>
        <title>Lawyer Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lawyer Dashboard</h1>
                <p className="text-slate-600">Welcome back, {lawyerProfile?.full_name || 'Lawyer'}</p>
              </div>
              <Button variant="primary">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Availability
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Clients', value: stats.clients, icon: Users },
              { label: 'Consultations', value: stats.consultations, icon: Calendar },
              { label: 'Earnings', value: `$${stats.earnings.toLocaleString()}`, icon: DollarSign },
              { label: 'Rating', value: stats.rating, icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
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
                    <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                          {activity.type === 'consultation' && <Calendar className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'document' && <FileText className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'booking' && <Users className="w-5 h-5 text-blue-600" />}
                        </div>
                        
                        <div>
                          <p className="font-medium text-slate-900">{activity.client}</p>
                          <p className="text-sm text-slate-600">{activity.time}</p>
                        </div>
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
                  <Button variant="outline" className="w-full justify-between">
                    View Clients
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    Manage Cases
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    Documents
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-600 text-white p-6">
                <h3 className="font-semibold mb-2">Profile Status</h3>
                <p className="text-blue-100 text-sm mb-4">Your profile is 85% complete.</p>
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
