import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart,
  Users,
  DollarSign,
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'user' | 'system' | 'compliance';
  icon: any;
  generateFn: () => Promise<string>;
}

export function Reports() {
  const { toast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [generatedReports, setGeneratedReports] = useState<Array<{ id: string; name: string; generatedAt: string; size: string }>>([]);

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDateRange({ start, end });
  }, []);

  const generateRevenueReport = async (): Promise<string> => {
    const { data: purchases } = await supabase
      .from('user_visa_purchases')
      .select('amount_cents, purchased_at')
      .gte('purchased_at', dateRange.start)
      .lte('purchased_at', dateRange.end);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('amount_cents, created_at')
      .eq('status', 'completed')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const totalRevenue = 
      (purchases || []).reduce((sum, p) => sum + (p.amount_cents || 0), 0) +
      (bookings || []).reduce((sum, b) => sum + (b.amount_cents || 0), 0);

    const csv = [
      ['Report', 'Revenue Report'],
      ['Period', `${dateRange.start} to ${dateRange.end}`],
      ['Generated', new Date().toISOString()],
      [],
      ['Metric', 'Value'],
      ['Visa Purchases', (purchases?.length || 0).toString()],
      ['Consultations', (bookings?.length || 0).toString()],
      ['Total Revenue', `$${(totalRevenue / 100).toFixed(2)}`],
    ]
      .map((row) => row.join(','))
      .join('\n');

    return csv;
  };

  const generateUserReport = async (): Promise<string> => {
    const { data: users } = await supabase
      .from('profiles')
      .select('role, created_at')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    const totalUsers = users?.filter((u) => u.role === 'user').length || 0;
    const totalLawyers = users?.filter((u) => u.role === 'lawyer').length || 0;

    const csv = [
      ['Report', 'User Acquisition Report'],
      ['Period', `${dateRange.start} to ${dateRange.end}`],
      ['Generated', new Date().toISOString()],
      [],
      ['Role', 'Count'],
      ['Users', totalUsers.toString()],
      ['Lawyers', totalLawyers.toString()],
      ['Total', (totalUsers + totalLawyers).toString()],
    ]
      .map((row) => row.join(','))
      .join('\n');

    return csv;
  };

  const generateLawyerReport = async (): Promise<string> => {
    const { data: lawyers } = await supabase
      .from('lawyer_profiles')
      .select('verification_status, is_verified');

    const verified = lawyers?.filter((l) => l.is_verified).length || 0;
    const pending = lawyers?.filter((l) => l.verification_status === 'pending').length || 0;
    const total = lawyers?.length || 0;

    const csv = [
      ['Report', 'Lawyer Activity Report'],
      ['Generated', new Date().toISOString()],
      [],
      ['Status', 'Count'],
      ['Verified', verified.toString()],
      ['Pending Verification', pending.toString()],
      ['Total Lawyers', total.toString()],
    ]
      .map((row) => row.join(','))
      .join('\n');

    return csv;
  };

  const generateVisaReport = async (): Promise<string> => {
    const { data: visas } = await supabase.from('visas').select('category, is_active');

    const categories: Record<string, number> = {};
    visas?.forEach((v) => {
      categories[v.category] = (categories[v.category] || 0) + 1;
    });

    const csv = [
      ['Report', 'Visa Inventory Report'],
      ['Generated', new Date().toISOString()],
      [],
      ['Category', 'Count'],
      ...Object.entries(categories).map(([cat, count]) => [cat, count.toString()]),
      [],
      ['Total Visas', (visas?.length || 0).toString()],
      ['Active Visas', (visas?.filter((v) => v.is_active).length || 0).toString()],
    ]
      .map((row) => row.join(','))
      .join('\n');

    return csv;
  };

  const REPORT_TEMPLATES: ReportTemplate[] = [
    {
      id: 'R-001',
      name: 'Revenue Report',
      description: 'Detailed breakdown of income from consultations and visa guide purchases.',
      category: 'financial',
      icon: DollarSign,
      generateFn: generateRevenueReport,
    },
    {
      id: 'R-002',
      name: 'User Acquisition Report',
      description: 'Analysis of new signups, user roles, and growth trends.',
      category: 'user',
      icon: Users,
      generateFn: generateUserReport,
    },
    {
      id: 'R-003',
      name: 'Visa Inventory Report',
      description: 'Overview of all visa types, categories, and active status.',
      category: 'system',
      icon: FileSpreadsheet,
      generateFn: generateVisaReport,
    },
    {
      id: 'R-004',
      name: 'Lawyer Activity Summary',
      description: 'Verification status, lawyer counts, and pending applications.',
      category: 'compliance',
      icon: Briefcase,
      generateFn: generateLawyerReport,
    },
  ];

  const handleGenerate = (report: ReportTemplate) => {
    setSelectedReport(report);
  };

  const confirmGenerate = async () => {
    if (!selectedReport) return;

    setGeneratingId(selectedReport.id);
    setSelectedReport(null);

    try {
      const csvContent = await selectedReport.generateFn();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedReport.name.replace(/\s+/g, '_')}_${dateRange.start}_${dateRange.end}.csv`;
      link.click();

      // Add to generated reports list
      setGeneratedReports((prev) => [
        {
          id: Date.now().toString(),
          name: selectedReport.name,
          generatedAt: new Date().toLocaleString(),
          size: `${(blob.size / 1024).toFixed(1)} KB`,
        },
        ...prev.slice(0, 9),
      ]);

      toast('success', `${selectedReport.name} generated successfully`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast('error', 'Failed to generate report');
    } finally {
      setGeneratingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial':
        return 'bg-green-100 text-green-700';
      case 'user':
        return 'bg-blue-100 text-blue-700';
      case 'system':
        return 'bg-purple-100 text-purple-700';
      case 'compliance':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports</h1>
          <p className="text-neutral-500 mt-1">Generate and download platform reports</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-neutral-400" />
            <div className="flex gap-4">
              <div>
                <label className="text-sm text-neutral-500">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-neutral-500">End Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Report Templates */}
      <div className="grid md:grid-cols-2 gap-4">
        {REPORT_TEMPLATES.map((report) => {
          const Icon = report.icon;
          const isGenerating = generatingId === report.id;

          return (
            <Card key={report.id} className="hover:border-blue-300 transition-colors">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{report.name}</h3>
                      <Badge className={getCategoryColor(report.category)}>
                        {report.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">{report.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(report)}
                      loading={isGenerating}
                      disabled={isGenerating}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recently Generated */}
      {generatedReports.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900 dark:text-white">Recently Generated</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-neutral-500">{report.generatedAt}</p>
                    </div>
                  </div>
                  <span className="text-sm text-neutral-500">{report.size}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Generate Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Generate Report"
        size="md"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <selectedReport.icon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{selectedReport.name}</h3>
                <Badge className={getCategoryColor(selectedReport.category)}>
                  {selectedReport.category}
                </Badge>
              </div>            </div>
            <p className="text-neutral-600">{selectedReport.description}</p>
            <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
              <p className="text-sm text-neutral-500">
                <strong>Date Range:</strong> {dateRange.start} to {dateRange.end}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Cancel
              </Button>
              <Button onClick={confirmGenerate}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
