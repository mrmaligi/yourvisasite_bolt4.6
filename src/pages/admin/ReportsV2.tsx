import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Download,
  Calendar,
  BarChart,
  Users,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const REPORT_TEMPLATES = [
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Financial performance and revenue breakdown',
    category: 'financial' as const,
    icon: DollarSign,
  },
  {
    id: 'users',
    name: 'User Activity Report',
    description: 'User registrations, logins, and engagement',
    category: 'user' as const,
    icon: Users,
  },
  {
    id: 'lawyers',
    name: 'Lawyer Performance',
    description: 'Consultations, ratings, and earnings',
    category: 'financial' as const,
    icon: Briefcase,
  },
  {
    id: 'visas',
    name: 'Visa Applications Report',
    description: 'Application volumes and success rates',
    category: 'system' as const,
    icon: FileText,
  },
  {
    id: 'analytics',
    name: 'Platform Analytics',
    description: 'Traffic, conversions, and key metrics',
    category: 'system' as const,
    icon: BarChart,
  },
];

const GENERATED_REPORTS = [
  { id: '1', name: 'Revenue Report - March 2024', generatedAt: '2024-03-20', size: '245 KB' },
  { id: '2', name: 'User Activity - Q1 2024', generatedAt: '2024-03-15', size: '1.2 MB' },
  { id: '3', name: 'Lawyer Performance - Feb 2024', generatedAt: '2024-02-28', size: '890 KB' },
];

export function ReportsV2() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleGenerate = async (reportId: string) => {
    setGeneratingId(reportId);
    setTimeout(() => {
      setGeneratingId(null);
      alert('Report generated!');
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      financial: 'bg-green-100 text-green-700',
      user: 'bg-blue-100 text-blue-700',
      system: 'bg-purple-100 text-purple-700',
      compliance: 'bg-amber-100 text-amber-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <>
      <Helmet>
        <title>Reports | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
              <p className="text-slate-600">Generate and download platform reports</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Range - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-8">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Templates - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {REPORT_TEMPLATES.map((report) => (
              <div key={report.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <report.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium ${getCategoryColor(report.category)}`}>
                    {report.category}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{report.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{report.description}</p>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleGenerate(report.id)}
                  disabled={generatingId === report.id}
                >
                  {generatingId === report.id ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            ))}
          </div>

          {/* Generated Reports - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Generated Reports</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {GENERATED_REPORTS.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{report.name}</p>
                      <p className="text-sm text-slate-500">Generated: {report.generatedAt} • {report.size}</p>
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
    </>
  );
}
