import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Calendar, BarChart, Users, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Report {
  id: string;
  name: string;
  category: string;
  generatedAt: string;
  size: string;
}

const MOCK_REPORTS: Report[] = [
  { id: '1', name: 'Monthly Revenue Report', category: 'Financial', generatedAt: '2024-03-01', size: '245 KB' },
  { id: '2', name: 'User Activity Summary', category: 'User', generatedAt: '2024-03-01', size: '128 KB' },
  { id: '3', name: 'Visa Applications Overview', category: 'System', generatedAt: '2024-02-28', size: '312 KB' },
];

export function ReportsV2() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <>
      <Helmet>
        <title>Reports | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
                <p className="text-slate-600">Generate and download system reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Reports', value: reports.length, icon: FileText, color: 'bg-blue-100 text-blue-600' },
              { label: 'Financial', value: '12', icon: DollarSign, color: 'bg-green-100 text-green-600' },
              { label: 'User', value: '8', icon: Users, color: 'bg-purple-100 text-purple-600' },
              { label: 'System', value: '5', icon: BarChart, color: 'bg-amber-100 text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Date Range</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-slate-200"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-slate-200"
              />
              <Button variant="primary">Generate Report</Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Report Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Generated</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Size</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{report.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{report.generatedAt}</td>
                      <td className="px-6 py-4 text-slate-700">{report.size}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
