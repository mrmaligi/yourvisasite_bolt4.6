import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCw, Trash2, Eye, CheckCircle, Filter, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_ENTRIES = [
  { id: '1', visa: 'Partner Visa (820)', subclass: '820', applicant: 'John D.', status: 'granted', days: 180, date: '2024-03-20' },
  { id: '2', visa: 'Skilled Independent (189)', subclass: '189', applicant: 'Sarah M.', status: 'pending', days: 90, date: '2024-03-18' },
  { id: '3', visa: 'Student Visa (500)', subclass: '500', applicant: 'Mike B.', status: 'granted', days: 45, date: '2024-03-15' },
  { id: '4', visa: 'Employer Nomination (186)', subclass: '186', applicant: 'Emma W.', status: 'refused', days: 120, date: '2024-03-10' },
];

const VISA_STATS = [
  { visa: 'Partner Visa (820)', count: 45, avgDays: 165 },
  { visa: 'Skilled Independent (189)', count: 32, avgDays: 95 },
  { visa: 'Student Visa (500)', count: 28, avgDays: 42 },
];

export function TrackerManagementV2() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredEntries = MOCK_ENTRIES.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const stats = {
    total: MOCK_ENTRIES.length,
    granted: MOCK_ENTRIES.filter(e => e.status === 'granted').length,
    pending: MOCK_ENTRIES.filter(e => e.status === 'pending').length,
    refused: MOCK_ENTRIES.filter(e => e.status === 'refused').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'granted': return <Badge variant="success">Granted</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'refused': return <Badge variant="danger">Refused</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Tracker Management | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tracker Management</h1>
                <p className="text-slate-600">Manage community tracker entries</p>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Entries', value: stats.total, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
              { label: 'Granted', value: stats.granted, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
              { label: 'Pending', value: stats.pending, icon: RefreshCw, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Refused', value: stats.refused, icon: Trash2, color: 'bg-red-100 text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Visa Stats - SQUARE */}
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Visa Statistics</h2>
              
              <div className="space-y-4">
                {VISA_STATS.map((stat) => (
                  <div key={stat.visa} className="p-4 bg-slate-50 border border-slate-200">
                    <p className="font-medium text-slate-900">{stat.visa}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-slate-600">{stat.count} entries</span>
                      <span className="text-slate-600">Avg: {stat.avgDays} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entries List - SQUARE */}
            <div className="lg:col-span-2 bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="flex gap-1">
                  {['all', 'granted', 'pending', 'refused'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Visa</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Applicant</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Days</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{entry.visa}</p>
                            <p className="text-sm text-slate-500">Subclass {entry.subclass}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{entry.applicant}</td>
                        <td className="px-4 py-3">{getStatusBadge(entry.status)}</td>
                        <td className="px-4 py-3 text-slate-700">{entry.days}</td>
                        <td className="px-4 py-3">
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
      </div>
    </>
  );
}
