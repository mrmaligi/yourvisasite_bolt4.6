import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Shield, CheckCircle, Eye, Ban } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface AbuseReport {
  id: string;
  targetType: 'user' | 'post' | 'comment';
  targetName: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

const MOCK_REPORTS: AbuseReport[] = [
  { id: '1', targetType: 'user', targetName: 'john@example.com', reporterName: 'Jane Doe', reason: 'Spam', status: 'pending', severity: 'medium', createdAt: '2024-03-20' },
  { id: '2', targetType: 'post', targetName: 'Blog Post #123', reporterName: 'Bob Smith', reason: 'Inappropriate content', status: 'investigating', severity: 'high', createdAt: '2024-03-19' },
  { id: '3', targetType: 'comment', targetName: 'Comment #456', reporterName: 'Alice Johnson', reason: 'Harassment', status: 'resolved', severity: 'critical', createdAt: '2024-03-18' },
];

export function AbuseReportsV2() {
  const [reports] = useState<AbuseReport[]>(MOCK_REPORTS);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Abuse Reports | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Abuse Reports</h1>
                <p className="text-slate-600">Manage content moderation reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Reports', value: stats.total, icon: AlertTriangle },
              { label: 'Pending', value: stats.pending, icon: Shield, color: 'text-yellow-600' },
              { label: 'Investigating', value: stats.investigating, icon: Eye, color: 'text-blue-600' },
              { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
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
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Target</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Reporter</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Reason</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Severity</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{report.targetName}</p>
                          <p className="text-sm text-slate-500 capitalize">{report.targetType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{report.reporterName}</td>
                      <td className="px-6 py-4 text-slate-700">{report.reason}</td>
                      <td className="px-6 py-4">{getSeverityBadge(report.severity)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          report.status === 'resolved' ? 'success' :
                          report.status === 'pending' ? 'warning' :
                          report.status === 'investigating' ? 'primary' : 'secondary'
                        }>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Ban className="w-4 h-4" />
                          </Button>
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
