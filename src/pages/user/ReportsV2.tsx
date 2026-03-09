import { Flag, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserReportsV2() {
  const reports = [
    { id: 1, type: 'Technical Issue', description: 'Cannot upload documents', status: 'resolved', date: '2024-03-20', response: 'Issue fixed, please try again' },
    { id: 2, type: 'Content Error', description: 'Outdated information on visa page', status: 'in_progress', date: '2024-03-18', response: null },
    { id: 3, type: 'Feature Request', description: 'Dark mode option', status: 'pending', date: '2024-03-15', response: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
            <p className="text-slate-600">Track issues you've reported</p>
          </div>
          <Button variant="primary">
            <Flag className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{report.type}</p>
                    <p className="text-sm text-slate-500">Reported on {report.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium ${
                  report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  report.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-slate-700 mb-4">{report.description}</p>
              
              {report.response && (
                <div className="bg-slate-50 p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-slate-600"><span className="font-medium">Response:</span> {report.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
