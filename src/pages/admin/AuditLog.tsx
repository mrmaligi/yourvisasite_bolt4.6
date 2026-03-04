import { useState, useEffect } from 'react';
import { Activity, User, Settings, Shield, Database, Download } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

interface AuditLogEntry {
  id: string;
  action: string;
  category: 'auth' | 'system' | 'data' | 'user_management' | 'visa' | 'booking';
  actor_name: string;
  actor_role: string;
  target: string;
  details: string;
  ip_address: string;
  status: 'success' | 'failure';
  created_at: string;
}

export function AuditLog() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setLogs(data || []);
      setFilteredLogs(data || []);
    } catch (error) {
      toast('error', 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.target.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((l) => l.category === categoryFilter);
    }
    setFilteredLogs(filtered);
  }, [searchQuery, categoryFilter, logs]);

  const handleExport = () => {
    const headers = ['Date', 'Action', 'Category', 'Actor', 'Role', 'Target', 'Status', 'IP'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((l) =>
        [
          new Date(l.created_at).toISOString(),
          `"${l.action}"`,
          l.category,
          `"${l.actor_name}"`,
          l.actor_role,
          `"${l.target}"`,
          l.status,
          l.ip_address,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast('success', 'Audit log exported');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'data':
        return <Database className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (row) => (
        <span className="text-sm text-neutral-500">{new Date(row.created_at).toLocaleString()}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getCategoryIcon(row.category)}
          <span className="font-medium">{row.action}</span>
        </div>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (row) => (
        <div>
          <p className="font-medium">{row.actor_name}</p>
          <Badge variant="secondary">{row.actor_role}</Badge>
        </div>
      ),
    },
    {
      key: 'target',
      header: 'Target',
      render: (row) => <span className="text-sm">{row.target}</span>,
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => (
        <p className="max-w-xs truncate text-sm text-neutral-500">{row.details}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          variant={row.status === 'success' ? 'success' : 'danger'}
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  const categories = ['all', 'auth', 'system', 'data', 'user_management', 'visa', 'booking'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Audit Log</h1>
          <p className="text-neutral-500 mt-1">Track all system activities</p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Activity Log ({filteredLogs.length} entries)</h2>
        </CardHeader>
        <CardBody>
          <DataTable<AuditLogEntry>
            columns={columns}
            data={filteredLogs}
            loading={loading}
            emptyMessage="No audit logs found"
          />
        </CardBody>
      </Card>
    </div>
  );
}
