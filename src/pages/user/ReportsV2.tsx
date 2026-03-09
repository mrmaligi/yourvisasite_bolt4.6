import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserReportsV2() {
  const reports = [
    { id: 1, name: 'Application Summary', type: 'PDF', generated: 'Mar 20, 2024', size: '2.4 MB' },
    { id: 2, name: 'Document Checklist', type: 'PDF', generated: 'Mar 18, 2024', size: '1.2 MB' },
    { id: 3, name: 'Progress Report', type: 'PDF', generated: 'Mar 15, 2024', size: '856 KB' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">View and download your reports</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Report</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Generated</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Size</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-slate-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">{report.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-4 h-4" /> {report.generated}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{report.size}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                    </div>
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
