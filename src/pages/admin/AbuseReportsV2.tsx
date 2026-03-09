import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AbuseReportsV2() {
  const reports = [
    { id: 1, type: 'Spam', user: 'user123@example.com', reason: 'Multiple spam messages', status: 'pending', date: '2024-03-20' },
    { id: 2, type: 'Harassment', user: 'toxic@example.com', reason: 'Inappropriate content', status: 'resolved', date: '2024-03-18' },
    { id: 3, type: 'Fake Profile', user: 'fake@example.com', reason: 'Impersonating lawyer', status: 'pending', date: '2024-03-15' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Abuse Reports</h1>
          <p className="text-slate-600">Review and handle user reports</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending', value: '12', icon: AlertTriangle, color: 'text-amber-600' },
            { label: 'Resolved', value: '45', icon: CheckCircle, color: 'text-green-600' },
            { label: 'Dismissed', value: '8', icon: XCircle, color: 'text-slate-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-slate-600">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {reports.map((report) => (
              <div key={report.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{report.type}</span>
                      <span className={`px-2 py-0.5 text-xs ${
                        report.status === 'pending' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{report.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">{report.user} • {report.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
