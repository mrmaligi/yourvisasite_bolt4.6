import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Database, Download, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Backup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'failed';
  type: 'automatic' | 'manual';
}

const MOCK_BACKUPS: Backup[] = [
  { id: '1', name: 'Daily Backup', size: '2.4 GB', createdAt: '2024-03-20 02:00', status: 'completed', type: 'automatic' },
  { id: '2', name: 'Weekly Backup', size: '2.3 GB', createdAt: '2024-03-17 02:00', status: 'completed', type: 'automatic' },
  { id: '3', name: 'Pre-Update Backup', size: '2.1 GB', createdAt: '2024-03-15 14:30', status: 'completed', type: 'manual' },
];

export function BackupV2() {
  const [backups] = useState<Backup[]>(MOCK_BACKUPS);
  const [lastBackup] = useState('2 hours ago');

  const stats = {
    total: backups.length,
    auto: backups.filter(b => b.type === 'automatic').length,
    manual: backups.filter(b => b.type === 'manual').length,
  };

  return (
    <>
      <Helmet>
        <title>Backup | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Backup & Restore</h1>
                <p className="text-slate-600">Manage database backups</p>
              </div>
              <Button variant="primary">
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-green-50 border border-green-200 p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Backup Status: Healthy</p>
              <p className="text-sm text-green-600">Last backup: {lastBackup}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Backups', value: stats.total, icon: Database },
              { label: 'Automatic', value: stats.auto, icon: Calendar },
              { label: 'Manual', value: stats.manual, icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Backup</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Size</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Created</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{backup.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={backup.type === 'automatic' ? 'primary' : 'secondary'}>
                          {backup.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{backup.size}</td>
                      <td className="px-6 py-4 text-slate-600">{backup.createdAt}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </td>
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
