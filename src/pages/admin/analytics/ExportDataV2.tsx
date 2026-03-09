import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ExportDataV2() {
  const exports = [
    { name: 'All Users', format: 'CSV', size: '2.4 MB', lastExport: '2024-03-20' },
    { name: 'Visa Applications', format: 'Excel', size: '1.8 MB', lastExport: '2024-03-18' },
    { name: 'Consultations', format: 'CSV', size: '856 KB', lastExport: '2024-03-15' },
    { name: 'Revenue Data', format: 'Excel', size: '3.2 MB', lastExport: '2024-03-10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Export Data</h1>
          <p className="text-slate-600">Download your data for external analysis</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {exports.map((item) => (
            <div key={item.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    {item.format === 'CSV' ? (
                      <FileText className="w-6 h-6 text-blue-600" />
                    ) : (
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{item.format}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                Last exported: {item.lastExport}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
