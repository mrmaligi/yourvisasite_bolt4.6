import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, Database, Server, Cpu, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface HealthMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: 'database' | 'server' | 'cpu' | 'storage';
}

const MOCK_METRICS: HealthMetric[] = [
  { name: 'Database', value: '99.9% Uptime', status: 'healthy', icon: 'database' },
  { name: 'API Server', value: '45ms Latency', status: 'healthy', icon: 'server' },
  { name: 'CPU Usage', value: '32%', status: 'healthy', icon: 'cpu' },
  { name: 'Storage', value: '68% Used', status: 'warning', icon: 'storage' },
];

export function SystemHealthV2() {
  const [metrics] = useState<HealthMetric[]>(MOCK_METRICS);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'database': return <Database className="w-6 h-6 text-blue-600" />;
      case 'server': return <Server className="w-6 h-6 text-purple-600" />;
      case 'cpu': return <Cpu className="w-6 h-6 text-orange-600" />;
      case 'storage': return <HardDrive className="w-6 h-6 text-green-600" />;
      default: return <Activity className="w-6 h-6 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      healthy: 'success',
      warning: 'warning',
      critical: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>System Health | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">System Health</h1>
                <p className="text-slate-600">Monitor system performance</p>
              </div>
              <Button variant="outline">Refresh</Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-green-50 border border-green-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-900">All Systems Operational</h2>
                <p className="text-green-700">Last checked: 2 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      {getIcon(metric.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{metric.name}</h3>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    </div>
                  </div>
                  
                  {getStatusBadge(metric.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Incidents</h2>
            
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No incidents in the last 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
