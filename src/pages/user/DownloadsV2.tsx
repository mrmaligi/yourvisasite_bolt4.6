import { Download, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserDownloadsV2() {
  const downloads = [
    { id: 1, name: 'Partner-Visa-Guide.pdf', size: '4.2 MB', date: 'Mar 20, 2024', status: 'completed' },
    { id: 2, name: 'Document-Checklist.pdf', size: '1.8 MB', date: 'Mar 18, 2024', status: 'completed' },
    { id: 3, name: 'Application-Form.pdf', size: '856 KB', date: 'Mar 15, 2024', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Downloads</h1>
          <p className="text-slate-400">Your downloaded files</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">File</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Size</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {downloads.map((file) => (
                <tr key={file.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-slate-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{file.size}</td>
                  <td className="p-4 text-slate-600">{file.date}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
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
