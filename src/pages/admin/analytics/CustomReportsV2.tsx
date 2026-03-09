import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CustomReportsV2() {
  const reports = [
    { name: 'Monthly Revenue Report', type: 'PDF', created: '2024-03-01', size: '2.4 MB' },
    { name: 'User Acquisition Q1', type: 'Excel', created: '2024-03-15', size: '1.8 MB' },
    { name: 'Visa Applications Summary', type: 'PDF', created: '2024-03-20', size: '3.2 MB' },
    { name: 'Consultation Analytics', type: 'PDF', created: '2024-03-22', size: '1.5 MB' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Custom Reports</h1>
            <p className="text-slate-600">Generate and download custom analytics reports</p>
          </div>
          <Button variant="primary">
            <FileText className="w-4 h-4 mr-2" />
            Create New Report
          </Button>
        </div>

        <div className="bg-white border border-slate-200 p-4 mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select className="border border-slate-200 px-3 py-1">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select className="border border-slate-200 px-3 py-1">
              <option>All Types</option>
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {reports.map((report) => (
              <div key={report.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{report.name}</p>
                    <p className="text-sm text-slate-500">{report.type} • {report.size} • {report.created}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
