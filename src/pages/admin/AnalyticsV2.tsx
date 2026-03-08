import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  Users,
  Eye,
  Briefcase,
  FileText,
  Download,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export function AnalyticsV2() {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalBookings: 0,
    totalVisas: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [{ count: users }, { count: lawyers }, { count: bookings }, { count: visas }] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('visas').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: users || 0,
        totalLawyers: lawyers || 0,
        totalBookings: bookings || 0,
        totalVisas: visas || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, change: '+12%' },
    { label: 'Lawyers', value: stats.totalLawyers, icon: Briefcase, change: '+5%' },
    { label: 'Bookings', value: stats.totalBookings, icon: Eye, change: '+18%' },
    { label: 'Visas', value: stats.totalVisas, icon: FileText, change: '+3%' },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-600">Platform performance metrics</p>
              </div>
              <div className="flex gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-slate-200 bg-white focus:border-blue-500 outline-none"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="success">{stat.change}</Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {loading ? '-' : stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Placeholder - SQUARE */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h3>
              <div className="h-64 bg-slate-50 border border-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Bookings Overview</h3>
              <div className="h-64 bg-slate-50 border border-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Chart placeholder</p>
              </div>
            </div>
          </div>

          {/* Recent Activity - SQUARE */}
          <div className="mt-8 bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {[
                { action: 'New user registered', time: '2 min ago', type: 'user' },
                { action: 'Booking completed', time: '15 min ago', type: 'booking' },
                { action: 'New visa added', time: '1 hour ago', type: 'visa' },
                { action: 'Lawyer verified', time: '2 hours ago', type: 'lawyer' },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600"></div>
                    <span className="text-slate-900">{item.action}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
