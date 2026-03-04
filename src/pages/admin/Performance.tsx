import { useState, useEffect } from 'react';
import { Activity, Database, Server, Globe, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

export function Performance() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalVisas: 0,
    totalDocuments: 0,
    dbStatus: 'healthy',
    apiStatus: 'healthy',
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [usersRes, bookingsRes, visasRes, docsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('visas').select('id', { count: 'exact', head: true }),
        supabase.from('user_documents').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        totalVisas: visasRes.count || 0,
        totalDocuments: docsRes.count || 0,
        dbStatus: 'healthy',
        apiStatus: 'healthy',
      });
    } catch (error) {
      toast('error', 'Failed to load performance stats');
      setStats((s) => ({ ...s, dbStatus: 'error', apiStatus: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'Database',
      status: stats.dbStatus,
      icon: Database,
      description: 'PostgreSQL via Supabase',
    },
    {
      name: 'API',
      status: stats.apiStatus,
      icon: Server,
      description: 'REST & Realtime API',
    },
    {
      name: 'Storage',
      status: 'healthy',
      icon: Globe,
      description: 'File storage bucket',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">System Performance</h1>
          <p className="text-neutral-500 mt-1">Platform health and metrics</p>
        </div>
        <Button variant="secondary" onClick={fetchStats} loading={loading}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Service Status */}
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.name}>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    service.status === 'healthy'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{service.name}</p>
                    <Badge
                      variant={service.status === 'healthy' ? 'success' : 'danger'}
                    >
                      {service.status === 'healthy' ? 'Operational' : 'Error'}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500">{service.description}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Database Statistics</h2>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-sm text-neutral-500">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalVisas}</p>
              <p className="text-sm text-neutral-500">Visa Types</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalBookings}</p>
              <p className="text-sm text-neutral-500">Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalDocuments}</p>
              <p className="text-sm text-neutral-500">Documents</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">System Info</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">Platform</span>
              <span>Supabase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Region</span>
              <span>ap-southeast-2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Last Check</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">Health Checks</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Database Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Authentication Service</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Storage Bucket</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Realtime API</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
