import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Eye,
  Ban,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_REPORTS = [
  {
    id: 'RPT-001',
    target: 'User: John Smith',
    type: 'user',
    reporter: 'Jane Doe',
    reason: 'Inappropriate content',
    severity: 'high',
    status: 'pending',
    createdAt: '2024-03-20',
  },
  {
    id: 'RPT-002',
    target: 'Review: #12345',
    type: 'review',
    reporter: 'Mike Brown',
    reason: 'Fake review',
    severity: 'medium',
    status: 'investigating',
    createdAt: '2024-03-19',
  },
  {
    id: 'RPT-003',
    target: 'Lawyer: Sarah Wilson',
    type: 'lawyer',
    reporter: 'Client A',
    reason: 'Unprofessional behavior',
    severity: 'critical',
    status: 'resolved',
    createdAt: '2024-03-18',
  },
];

export function AbuseReportsV2() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredReports = MOCK_REPORTS.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const stats = {
    total: MOCK_REPORTS.length,
    pending: MOCK_REPORTS.filter(r => r.status === 'pending').length,
    investigating: MOCK_REPORTS.filter(r => r.status === 'investigating').length,
    resolved: MOCK_REPORTS.filter(r => r.status === 'resolved').length,
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[severity] || 'bg-slate-100 text-slate-700'}`}>
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'investigating': return <Badge variant="primary">Investigating</Badge>;
      case 'resolved': return <Badge variant="success">Resolved</Badge>;
      case 'dismissed': return <Badge variant="secondary">Dismissed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Abuse Reports | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Abuse Reports</h1>
                <p className="text-slate-600">Review and manage content reports</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">System Protected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Reports', value: stats.total, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
              { label: 'Pending', value: stats.pending, icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Investigating', value: stats.investigating, icon: Eye, color: 'bg-blue-100 text-blue-600' },
              { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
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

          {/* Tabs - SQUARE */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['all', 'pending', 'investigating', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Reports Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Report ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Target</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Reason</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Severity</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm text-slate-900">{report.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{report.target}</p>
                          <p className="text-sm text-slate-500">Reporter: {report.reporter}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{report.reason}</td>
                      <td className="px-6 py-4">{getSeverityBadge(report.severity)}</td>
                      <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          {report.status === 'pending' && (
                            <>
                              <Button variant="primary" size="sm">Investigate</Button>
                              <Button variant="danger" size="sm"><Ban className="w-4 h-4" /></Button>
                            </>
                          )}
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
