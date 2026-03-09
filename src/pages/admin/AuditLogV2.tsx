import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, User, Shield, Database, Download, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_LOGS = [
  { id: '1', action: 'User login', category: 'auth', actor: 'admin@visabuild.com', target: 'System', status: 'success', time: '2 min ago' },
  { id: '2', action: 'Visa updated', category: 'visa', actor: 'admin@visabuild.com', target: 'Partner Visa 820', status: 'success', time: '15 min ago' },
  { id: '3', action: 'User deleted', category: 'user_management', actor: 'admin@visabuild.com', target: 'User #1234', status: 'success', time: '1 hour ago' },
  { id: '4', action: 'Database backup', category: 'system', actor: 'system', target: 'Database', status: 'success', time: '2 hours ago' },
  { id: '5', action: 'Failed login', category: 'auth', actor: 'unknown', target: 'System', status: 'failure', time: '3 hours ago' },
];

const categoryIcons: Record<string, any> = {
  auth: User,
  system: Database,
  data: Activity,
  user_management: Shield,
  visa: Activity,
  booking: Activity,
};

const categoryColors: Record<string, string> = {
  auth: 'bg-blue-100 text-blue-600',
  system: 'bg-green-100 text-green-600',
  data: 'bg-purple-100 text-purple-600',
  user_management: 'bg-amber-100 text-amber-600',
  visa: 'bg-rose-100 text-rose-600',
  booking: 'bg-cyan-100 text-cyan-600',
};

export function AuditLogV2() {
  const [logs] = useState(MOCK_LOGS);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = logs.filter(l => categoryFilter === 'all' || l.category === categoryFilter);

  const categories = ['all', 'auth', 'system', 'user_management', 'visa', 'booking'];

  return (
    <>
      <Helmet>
        <title>Audit Log | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
                <p className="text-slate-600">System activity and security logs</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter - SQUARE */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>

          {/* Logs Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Action</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actor</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Target</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLogs.map((log) => {
                    const Icon = categoryIcons[log.category] || Activity;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center ${categoryColors[log.category] || 'bg-slate-100 text-slate-600'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-900">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{log.actor}</td>
                        <td className="px-6 py-4 text-slate-700">{log.target}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {log.status === 'success' ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">Success</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-red-600">Failed</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{log.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
