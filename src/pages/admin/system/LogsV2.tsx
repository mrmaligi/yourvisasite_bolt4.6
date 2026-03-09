import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Filter, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  timestamp: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', level: 'info', message: 'User login successful', source: 'auth', timestamp: '2024-03-20 10:30:15' },
  { id: '2', level: 'warning', message: 'Rate limit approaching', source: 'api', timestamp: '2024-03-20 10:25:42' },
  { id: '3', level: 'error', message: 'Database connection timeout', source: 'db', timestamp: '2024-03-20 10:20:08' },
  { id: '4', level: 'info', message: 'Backup completed', source: 'system', timestamp: '2024-03-20 10:15:00' },
];

export function LogsV2() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [filter, setFilter] = useState('all');

  const filteredLogs = logs.filter(l => filter === 'all' || l.level === filter);

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length,
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'success'> = {
      error: 'danger',
      warning: 'warning',
      info: 'success',
    };
    return <Badge variant={variants[level]}>{level}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>System Logs | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">System Logs</h1>
                <p className="text-slate-600">View and export system logs</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: FileText },
              { label: 'Errors', value: stats.errors, icon: AlertCircle, color: 'text-red-600' },
              { label: 'Warnings', value: stats.warnings, icon: AlertCircle, color: 'text-yellow-600' },
              { label: 'Info', value: stats.info, icon: CheckCircle, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['all', 'error', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 font-medium transition-colors ${
                  filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Level</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Message</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Source</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(log.level)}
                          {getLevelBadge(log.level)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{log.message}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{log.source}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
