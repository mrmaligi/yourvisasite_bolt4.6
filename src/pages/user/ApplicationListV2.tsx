import { ClipboardList, Clock, User, FileText, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ApplicationListV2() {
  const applications = [
    { id: 'APP-001', type: 'Partner Visa (820)', status: 'In Progress', submitted: 'Mar 15, 2024', progress: 65 },
    { id: 'APP-002', type: 'Student Visa (500)', status: 'Approved', submitted: 'Feb 20, 2024', progress: 100 },
    { id: 'APP-003', type: 'Visitor Visa (600)', status: 'Pending', submitted: 'Mar 18, 2024', progress: 25 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400">Track all your visa applications</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Application</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Progress</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Submitted</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{app.type}</p>
                        <p className="text-sm text-slate-500">{app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-32 h-2 bg-slate-100">
                      <div className="h-full bg-blue-600" style={{ width: `${app.progress}%` }} />
                    </div>
                    <span className="text-sm text-slate-600">{app.progress}%</span>
                  </td>
                  <td className="p-4 text-slate-600">{app.submitted}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
