import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Eye,
  Ban,
  XCircle,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

interface AbuseReport {
  id: string;
  target_id: string;
  target_type: 'user' | 'post' | 'comment' | 'lawyer';
  target_name: string;
  reporter_name: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved_at: string;
  resolution_notes: string;
}

export function AbuseReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('abuse_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      toast('error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (status: 'resolved' | 'dismissed') => {
    if (!selectedReport) return;
    try {
      const { error } = await supabase
        .from('abuse_reports')
        .update({
          status,
          resolution_notes: resolutionNotes,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', selectedReport.id);

      if (error) throw error;
      toast('success', `Report ${status}`);
      setSelectedReport(null);
      setResolutionNotes('');
      fetchReports();
    } catch (error) {
      toast('error', 'Failed to update report');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'investigating':
        return 'bg-blue-100 text-blue-700';
      case 'dismissed':
        return 'bg-neutral-100 text-neutral-600';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const columns: Column<AbuseReport>[] = [
    {
      key: 'target',
      header: 'Target',
      render: (row) => (
        <div>
          <p className="font-medium">{row.target_name}</p>
          <Badge size="sm" variant="secondary">{row.target_type}</Badge>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <p className="max-w-xs truncate">{row.reason}</p>,
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <Badge className={getSeverityColor(row.severity)}>
          {row.severity}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: 'reporter',
      header: 'Reported By',
      render: (row) => row.reporter_name || 'Anonymous',
    },
    {
      key: 'created_at',
      header: 'Reported',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(row)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    pending: reports.filter((r) => r.status === 'pending').length,
    investigating: reports.filter((r) => r.status === 'investigating').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    critical: reports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Abuse Reports</h1>
        <p className="text-neutral-500 mt-1">Manage user reports and violations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-neutral-500">Pending</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.investigating}</p>
            <p className="text-sm text-neutral-500">Investigating</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-sm text-neutral-500">Resolved</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            <p className="text-sm text-neutral-500">Critical</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">All Reports</h2>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={reports}
            loading={loading}
            emptyMessage="No abuse reports"
          />
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => {
          setSelectedReport(null);
          setResolutionNotes('');
        }}
        title="Report Details"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Target</p>
                <p className="font-medium">{selectedReport.target_name}</p>
                <Badge size="sm">{selectedReport.target_type}</Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Reporter</p>
                <p className="font-medium">{selectedReport.reporter_name || 'Anonymous'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge className={getSeverityColor(selectedReport.severity)}>
                {selectedReport.severity} severity
              </Badge>
              <Badge className={getStatusColor(selectedReport.status)}>
                {selectedReport.status}
              </Badge>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <p className="text-sm text-neutral-500">Reason</p>
              <p className="font-medium">{selectedReport.reason}</p>
            </div>

            {selectedReport.description && (
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <p className="text-sm text-neutral-500">Description</p>
                <p>{selectedReport.description}</p>
              </div>
            )}

            {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about the resolution..."
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleResolve('dismissed')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Dismiss
                  </Button>
                  <Button onClick={() => handleResolve('resolved')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                </div>
              </div>
            )}

            {selectedReport.resolution_notes && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-neutral-500">Resolution Notes</p>
                <p>{selectedReport.resolution_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
