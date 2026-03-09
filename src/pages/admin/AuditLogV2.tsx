import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, User, Shield, Database, Download, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface AuditEntry {
  id: string;
  action: string;
  category: 'auth' | 'system' | 'data' | 'user_management';
  actor: string;
  target: string;
  status: 'success' | 'failure';
  createdAt: string;
}

const MOCK_LOGS: AuditEntry[] = [
  { id: '1', action: 'User Login', category: 'auth', actor: 'admin@visabuild.com', target: 'System', status: 'success', createdAt: '2024-03-20 10:30:00' },
  { id: '2', action: 'Visa Updated', category: 'data', actor: 'admin@visabuild.com', target: 'Partner Visa 820', status: 'success', createdAt: '2024-03-20 09:15:00' },
  { id: '3', action: 'User Created', category: 'user_management', actor: 'admin@visabuild.com', target: 'john@example.com', status: 'success', createdAt: '2024-03-19 16:45:00' },
  { id: '4', action: 'Settings Changed', category: 'system', actor: 'admin@visabuild.com', target: 'Platform Settings', status: 'success', createdAt: '2024-03-19 14:20:00' },
];

export function AuditLogV2() {
  const [logs] = useState<AuditEntry[]>(MOCK_LOGS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
                          l.actor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'user_management': return <User className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Audit Log | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
                <p className="text-slate-600">Track system activities and changes</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200"
              >
                <option value="all">All Categories</option>
                <option value="auth">Authentication</option>
                <option value="system">System</option>
                <option value="data">Data</option>
                <option value="user_management">User Management</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Action</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actor</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Target</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{log.action}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="capitalize">{log.category.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{log.actor}</td>
                      <td className="px-6 py-4 text-slate-700">{log.target}</td>
                      <td className="px-6 py-4">
                        <Badge variant={log.status === 'success' ? 'success' : 'danger'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{log.createdAt}</td>
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
