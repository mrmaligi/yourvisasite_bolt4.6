import { FileText, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminReportsV2() {
  const reports = [
    { id: 1, user: 'John Doe', type: 'Spam', content: 'Inappropriate message', status: 'Pending', date: 'Mar 20, 2024' },
    { id: 2, user: 'Jane Smith', type: 'Harassment', content: 'Offensive content', status: 'Resolved', date: 'Mar 18, 2024' },
    { id: 3, user: 'Bob Wilson', type: 'Fake Profile', content: 'Impersonating lawyer', status: 'Pending', date: 'Mar 15, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">Review and handle user reports</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Resolved</p>
            <p className="text-2xl font-bold text-slate-900">45</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Dismissed</p>
            <p className="text-2xl font-bold text-slate-900">8</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="p-4">{report.user}</td>
                  <td className="p-4">{report.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{report.status}</span>
                  </td>
                  <td className="p-4">{report.date}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">Review</Button>
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
