import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCw, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface TrackerEntry {
  id: string;
  visa: string;
  subclass: string;
  outcome: 'approved' | 'refused' | 'pending';
  processingDays: number;
  submittedAt: string;
}

const MOCK_ENTRIES: TrackerEntry[] = [
  { id: '1', visa: 'Partner Visa', subclass: '820', outcome: 'approved', processingDays: 180, submittedAt: '2024-03-20' },
  { id: '2', visa: 'Skilled Independent', subclass: '189', outcome: 'pending', processingDays: 90, submittedAt: '2024-03-15' },
  { id: '3', visa: 'Student Visa', subclass: '500', outcome: 'refused', processingDays: 45, submittedAt: '2024-03-10' },
];

export function TrackerManagementV2() {
  const [entries] = useState<TrackerEntry[]>(MOCK_ENTRIES);
  const [filter, setFilter] = useState('all');

  const filteredEntries = entries.filter(e => filter === 'all' || e.outcome === filter);

  const stats = {
    total: entries.length,
    approved: entries.filter(e => e.outcome === 'approved').length,
    pending: entries.filter(e => e.outcome === 'pending').length,
    refused: entries.filter(e => e.outcome === 'refused').length,
    avgDays: Math.round(entries.reduce((sum, e) => sum + e.processingDays, 0) / entries.length),
  };

  const getOutcomeBadge = (outcome: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      approved: 'success',
      pending: 'warning',
      refused: 'danger',
    };
    return <Badge variant={variants[outcome]}>{outcome}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Tracker Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tracker Management</h1>
                <p className="text-slate-600">Manage visa tracker entries</p>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Eye },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, icon: RefreshCw, color: 'text-yellow-600' },
              { label: 'Refused', value: stats.refused, icon: XCircle, color: 'text-red-600' },
              { label: 'Avg Days', value: stats.avgDays, icon: Eye, color: 'text-blue-600' },
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
            {['all', 'approved', 'pending', 'refused'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Subclass</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Outcome</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Processing Days</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Submitted</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{entry.visa}</td>
                      <td className="px-6 py-4 text-slate-700">{entry.subclass}</td>
                      <td className="px-6 py-4">{getOutcomeBadge(entry.outcome)}</td>
                      <td className="px-6 py-4 text-slate-700">{entry.processingDays}</td>
                      <td className="px-6 py-4 text-slate-600">{entry.submittedAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="danger" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        </div>
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
