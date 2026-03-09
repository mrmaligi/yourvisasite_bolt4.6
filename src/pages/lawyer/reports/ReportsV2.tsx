import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart, FileText, Download, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Report {
  id: string;
  name: string;
  type: string;
  generated: string;
}

const MOCK_REPORTS: Report[] = [
  { id: '1', name: 'Monthly Revenue Report', type: 'Financial', generated: 'Nov 1, 2023' },
  { id: '2', name: 'Client Acquisition Analysis', type: 'Marketing', generated: 'Oct 31, 2023' },
  { id: '3', name: 'Case Efficiency Metrics', type: 'Performance', generated: 'Weekly' },
];

export function ReportsV2() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);

  const stats = {
    total: reports.length,
  };

  return (
    <>
      <Helmet>
        <title>Reports | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
                <p className="text-slate-600">Generate insights and exports</p>
              </div>
              <Button variant="primary">
                <BarChart className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Available Reports</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-slate-200 p-6 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-1">{report.name}</h3>
                <Badge variant="secondary" className="mb-4">{report.type}</Badge>

                <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  Last generated: {report.generated}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
