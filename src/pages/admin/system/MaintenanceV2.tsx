import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wrench, AlertTriangle, CheckCircle, Clock, Power } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  status: 'healthy' | 'warning' | 'error';
}

const MOCK_TASKS: MaintenanceTask[] = [
  { id: '1', name: 'Database Cleanup', description: 'Remove old logs and temp files', lastRun: '2 hours ago', status: 'healthy' },
  { id: '2', name: 'Cache Clear', description: 'Clear application cache', lastRun: '1 day ago', status: 'healthy' },
  { id: '3', name: 'Index Optimization', description: 'Optimize search indexes', lastRun: '3 days ago', status: 'warning' },
];

export function MaintenanceV2() {
  const [tasks] = useState<MaintenanceTask[]>(MOCK_TASKS);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const stats = {
    healthy: tasks.filter(t => t.status === 'healthy').length,
    warning: tasks.filter(t => t.status === 'warning').length,
    error: tasks.filter(t => t.status === 'error').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Maintenance | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Maintenance</h1>
                <p className="text-slate-600">System maintenance tasks</p>
              </div>
              <Button
                variant={maintenanceMode ? 'danger' : 'primary'}
                onClick={() => setMaintenanceMode(!maintenanceMode)}
              >
                <Power className="w-4 h-4 mr-2" />
                {maintenanceMode ? 'Exit Maintenance' : 'Enter Maintenance'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {maintenanceMode && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Maintenance Mode Active</p>
                <p className="text-sm text-yellow-600">The site is currently unavailable to regular users.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Healthy', value: stats.healthy, color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Warning', value: stats.warning, color: 'text-yellow-600', bg: 'bg-yellow-100' },
              { label: 'Error', value: stats.error, color: 'text-red-600', bg: 'bg-red-100' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center`}>
                    <CheckCircle className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{task.name}</h3>
                        {getStatusIcon(task.status)}
                      </div>
                      <p className="text-slate-600">{task.description}</p>
                      <p className="text-sm text-slate-500 mt-1">Last run: {task.lastRun}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">Run Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
