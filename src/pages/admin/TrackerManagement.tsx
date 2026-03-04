import { useEffect, useState } from 'react';
import { RefreshCw, Trash2, Eye, CheckCircle, XCircle, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import type { TrackerEntry } from '../../types/database';

export function TrackerManagement() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TrackerEntry | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [visaStats, setVisaStats] = useState<{ visa_id: string; count: number; avg_days: number }[]>([]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('tracker_entries')
        .select('*, visas(name, subclass)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setFilteredEntries(data || []);

      // Calculate visa stats
      const stats: Record<string, { count: number; totalDays: number; name: string; subclass: string }> = {};
      data?.forEach((entry: any) => {
        if (!stats[entry.visa_id]) {
          stats[entry.visa_id] = { count: 0, totalDays: 0, name: entry.visas?.name || 'Unknown', subclass: entry.visas?.subclass || 'N/A' };
        }
        stats[entry.visa_id].count++;
        if (entry.processing_days) {
          stats[entry.visa_id].totalDays += entry.processing_days;
        }
      });

      const visaStatsArray = Object.entries(stats).map(([visa_id, data]) => ({
        visa_id,
        count: data.count,
        avg_days: data.count > 0 ? Math.round(data.totalDays / data.count) : 0,
        name: data.name,
        subclass: data.subclass,
      }));
      setVisaStats(visaStatsArray);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast('error', 'Failed to load tracker entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredEntries(entries);
    } else if (activeTab === 'pending') {
      setFilteredEntries(entries.filter((e) => e.status === 'pending'));
    } else if (activeTab === 'approved') {
      setFilteredEntries(entries.filter((e) => e.outcome === 'approved'));
    } else if (activeTab === 'rejected') {
      setFilteredEntries(entries.filter((e) => e.outcome === 'refused'));
    }
  }, [activeTab, entries]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('tracker_entries').delete().eq('id', id);
      if (error) throw error;
      toast('success', 'Entry deleted');
      fetchEntries();
    } catch (error) {
      toast('error', 'Failed to delete entry');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tracker_entries')
        .update({ status: 'approved', outcome: 'approved' })
        .eq('id', id);
      if (error) throw error;
      toast('success', 'Entry approved');
      fetchEntries();
      setSelectedEntry(null);
    } catch (error) {
      toast('error', 'Failed to approve entry');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tracker_entries')
        .update({ status: 'rejected', outcome: 'refused' })
        .eq('id', id);
      if (error) throw error;
      toast('success', 'Entry rejected');
      fetchEntries();
      setSelectedEntry(null);
    } catch (error) {
      toast('error', 'Failed to reject entry');
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      // Just refresh data from the database
      await fetchEntries();
      toast('success', 'Tracker data refreshed');
    } catch (err) {
      console.error('Failed to refresh tracker:', err);
      toast('error', 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  const getOutcomeBadge = (outcome: string | null) => {
    switch (outcome) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'refused':
        return <Badge className="bg-red-100 text-red-700">Refused</Badge>;
      case 'withdrawn':
        return <Badge className="bg-neutral-100 text-neutral-600">Withdrawn</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-600">{status}</Badge>;
    }
  };

  const columns: Column<TrackerEntry>[] = [
    {
      key: 'visa',
      header: 'Visa',
      render: (r: any) => (
        <div>
          <p className="font-medium">{r.visas?.subclass} - {r.visas?.name}</p>
        </div>
      ),
    },
    {
      key: 'processing_days',
      header: 'Days',
      render: (r) => <span className="font-mono font-medium">{r.processing_days || '-'}</span>,
      sortable: true,
    },
    {
      key: 'outcome',
      header: 'Outcome',
      render: (r) => getOutcomeBadge(r.outcome),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => getStatusBadge(r.status),
    },
    {
      key: 'application_date',
      header: 'Applied',
      render: (r) => new Date(r.application_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'submitted',
      header: 'Submitted',
      render: (r) => new Date(r.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedEntry(r)}
            className="p-1.5 rounded hover:bg-blue-50 text-blue-500"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(r.id)}
            className="p-1.5 rounded hover:bg-red-50 text-red-500"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tracker Management</h1>
          <p className="text-neutral-500 mt-1">Review and manage community-submitted processing times</p>
        </div>
        <Button size="sm" variant="secondary" loading={refreshing} onClick={handleRefreshAll}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold">{entries.length}</p>
            <p className="text-sm text-neutral-500">Total Entries</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-yellow-600">
              {entries.filter((e) => e.status === 'pending').length}
            </p>
            <p className="text-sm text-neutral-500">Pending Review</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold text-green-600">
              {entries.filter((e) => e.outcome === 'approved').length}
            </p>
            <p className="text-sm text-neutral-500">Approved</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-2xl font-bold">{visaStats.length}</p>
            <p className="text-sm text-neutral-500">Visas Tracked</p>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({entries.filter((e) => e.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({entries.filter((e) => e.outcome === 'approved').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({entries.filter((e) => e.outcome === 'refused').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={filteredEntries}
            loading={loading}
            emptyMessage="No tracker entries found"
          />
        </CardBody>
      </Card>

      {/* Entry Detail Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title="Entry Details"
        size="lg"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Visa</p>
                <p className="font-medium">{(selectedEntry as any).visas?.subclass} - {(selectedEntry as any).visas?.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Processing Days</p>
                <p className="font-medium">{selectedEntry.processing_days || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Application Date</p>
                <p className="font-medium">
                  {new Date(selectedEntry.application_date).toLocaleDateString()}
                </p>
              </div>
              {selectedEntry.decision_date && (
                <div>
                  <p className="text-sm text-neutral-500">Decision Date</p>
                  <p className="font-medium">
                    {new Date(selectedEntry.decision_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Outcome</p>
                {getOutcomeBadge(selectedEntry.outcome)}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Status</p>
                {getStatusBadge(selectedEntry.status)}
              </div>
            </div>

            {selectedEntry.notes && (
              <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded">
                <p className="text-sm text-neutral-500">Notes</p>
                <p>{selectedEntry.notes}</p>
              </div>
            )}

            {selectedEntry.status === 'pending' && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => handleReject(selectedEntry.id)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedEntry.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Simple Card components
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">{children}</div>;
}
