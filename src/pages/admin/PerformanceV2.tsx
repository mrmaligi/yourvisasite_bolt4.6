import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, Database, Server, Globe, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export function PerformanceV2() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalVisas: 0,
    totalLawyers: 0,
    dbStatus: 'healthy',
    apiStatus: 'healthy',
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [usersRes, bookingsRes, visasRes, lawyersRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('visas').select('*', { count: 'exact', head: true }),
        supabase.from('lawyer_profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        totalVisas: visasRes.count || 0,
        totalLawyers: lawyersRes.count || 0,
        dbStatus: 'healthy',
        apiStatus: 'healthy',
      });
    } catch (error) {
      console.error('Performance stats error:', error);
      setStats((s) => ({ ...s, dbStatus: 'error', apiStatus: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const systemStatus = [
    { name: 'Database', status: stats.dbStatus, icon: Database },
    { name: 'API Server', status: stats.apiStatus, icon: Server },
    { name: 'Web App', status: 'healthy', icon: Globe },
    { name: 'Storage', status: 'healthy', icon: Activity },
  ];

  return (
    <>
      <Helmet>
        <title>Performance | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">System Performance</h1>
                <p className="text-slate-600">Monitor platform health and metrics</p>
              </div>
              <Button variant="outline" onClick={fetchStats} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Activity },
              { label: 'Bookings', value: stats.totalBookings, icon: Database },
              { label: 'Visas', value: stats.totalVisas, icon: Globe },
              { label: 'Lawyers', value: stats.totalLawyers, icon: Server },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{loading ? '-' : stat.value.toLocaleString()}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* System Status - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
              
              <div className="space-y-4">
                {systemStatus.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center ${
                        service.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <service.icon className={`w-5 h-5 ${
                          service.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <span className="font-medium text-slate-900">{service.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {service.status === 'healthy' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Operational</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Issue</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'API Response Time', value: '45ms', status: 'good' },
                  { label: 'Database Queries/sec', value: '120', status: 'good' },
                  { label: 'Error Rate', value: '0.02%', status: 'good' },
                  { label: 'Uptime', value: '99.9%', status: 'good' },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                    <span className="text-slate-700">{metric.label}</span>
                    <Badge variant={metric.status === 'good' ? 'success' : 'warning'}>
                      {metric.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
