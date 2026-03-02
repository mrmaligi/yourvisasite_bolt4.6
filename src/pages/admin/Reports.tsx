import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart,
  Users,
  DollarSign
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'user' | 'system' | 'compliance';
  format: 'pdf' | 'csv' | 'xlsx';
  lastGenerated: string | null;
  icon: any;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'R-001',
    name: 'Monthly Revenue Report',
    description: 'Detailed breakdown of income from subscriptions and consultations.',
    category: 'financial',
    format: 'pdf',
    lastGenerated: '2024-03-01',
    icon: DollarSign
  },
  {
    id: 'R-002',
    name: 'New User Acquisition',
    description: 'Analysis of new signups, sources, and conversion rates.',
    category: 'user',
    format: 'csv',
    lastGenerated: '2024-03-10',
    icon: Users
  },
  {
    id: 'R-003',
    name: 'System Performance Log',
    description: 'Server uptime, API latency, and error rate summary.',
    category: 'system',
    format: 'pdf',
    lastGenerated: null,
    icon: BarChart
  },
  {
    id: 'R-004',
    name: 'Lawyer Activity Summary',
    description: 'Consultation hours, response times, and client ratings.',
    category: 'compliance',
    format: 'xlsx',
    lastGenerated: '2024-02-28',
    icon: FileText
  }
];

export function Reports() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ReportTemplate[]>(REPORT_TEMPLATES);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleGenerate = (report: ReportTemplate) => {
    setSelectedReport(report);
    // Open modal to select date range or confirm
  };

  const confirmGenerate = () => {
    if (!selectedReport) return;

    setGeneratingId(selectedReport.id);
    setSelectedReport(null); // Close modal

    // Mock generation process
    setTimeout(() => {
      setGeneratingId(null);
      const updatedTemplates = templates.map(t =>
        t.id === selectedReport.id
          ? { ...t, lastGenerated: new Date().toISOString().split('T')[0] }
          : t
      );
      setTemplates(updatedTemplates);
      toast('success', `${selectedReport.name} generated successfully.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports Center</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Generate and download platform insights</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((report) => (
          <Card key={report.id} className="flex flex-col h-full hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
            <CardBody className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  report.category === 'financial' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                  report.category === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                  report.category === 'system' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                  'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
                }`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">
                  {report.format}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">{report.name}</h3>
              <p className="text-sm text-neutral-500 mb-6 flex-1">{report.description}</p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center text-xs text-neutral-400 gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Last generated: {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={() => handleGenerate(report)}
                  disabled={generatingId === report.id}
                >
                  {generatingId === report.id ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" /> Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mt-8 mb-4">Recently Generated</h2>
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3">Report Name</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Requested By</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  { name: 'Monthly Revenue Report', date: '2024-03-01', user: 'Admin User', status: 'ready', size: '2.4 MB' },
                  { name: 'User Activity Log', date: '2024-02-28', user: 'Admin User', status: 'ready', size: '156 KB' },
                  { name: 'Lawyer Compliance Audit', date: '2024-02-28', user: 'System', status: 'failed', size: '-' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      {item.name}
                    </td>
                    <td className="px-6 py-3 text-neutral-500">{item.date}</td>
                    <td className="px-6 py-3 text-neutral-500">{item.user}</td>
                    <td className="px-6 py-3">
                      <Badge variant={item.status === 'ready' ? 'success' : 'danger'} className="capitalize">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {item.status === 'ready' ? (
                        <button className="text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto">
                          <Download className="w-3.5 h-3.5" /> Download ({item.size})
                        </button>
                      ) : (
                        <span className="text-neutral-400 text-xs italic">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Generation Config Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Generate ${selectedReport?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Cancel</Button>
            <Button onClick={confirmGenerate}>Generate Now</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            Configure parameters for this report. The file will be available for download once generation is complete.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
             <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
             <div>
               <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Format: {selectedReport?.format.toUpperCase()}</h4>
               <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                 This report will be generated in {selectedReport?.format.toUpperCase()} format suitable for {selectedReport?.format === 'csv' || selectedReport?.format === 'xlsx' ? 'spreadsheet analysis' : 'printing'}.
               </p>
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
