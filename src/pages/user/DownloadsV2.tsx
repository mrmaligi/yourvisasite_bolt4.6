import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserDownloadsV2() {
  const downloads = [
    { id: 1, name: 'Partner_Visa_Guide_2024.pdf', type: 'PDF', size: '4.2 MB', date: '2024-03-20', status: 'completed' },
    { id: 2, name: 'Document_Checklist.xlsx', type: 'Excel', size: '45 KB', date: '2024-03-19', status: 'completed' },
    { id: 3, name: 'Application_Templates.zip', type: 'ZIP', size: '12 MB', date: '2024-03-18', status: 'completed' },
    { id: 4, name: 'Interview_Tips.pdf', type: 'PDF', size: '2.1 MB', date: '2024-03-17', status: 'expired' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Downloads</h1>
          <p className="text-slate-600">Manage your downloaded files</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <select className="px-3 py-1 border border-slate-200">
            <option>All Types</option>
            <option>PDF</option>
            <option>Excel</option>
            <option>ZIP</option>
          </select>
          <select className="px-3 py-1 border border-slate-200">
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {downloads.map((file) => (
              <div key={file.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">{file.type} • {file.size} • {file.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium ${
                    file.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {file.status}
                  </span>
                  <Button variant="outline" size="sm" disabled={file.status === 'expired'}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
