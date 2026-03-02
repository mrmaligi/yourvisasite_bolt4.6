import { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  User,
  Settings,
  Shield,
  Database,
  Download,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';

interface AuditLogEntry {
  id: string;
  action: string;
  category: 'auth' | 'system' | 'data' | 'user_management';
  actorId: string;
  actorName: string;
  actorRole: 'admin' | 'user' | 'lawyer' | 'system';
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failure';
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'L-1001',
    action: 'User Login',
    category: 'auth',
    actorId: 'U-101',
    actorName: 'Alice Johnson',
    actorRole: 'user',
    target: 'Auth Service',
    details: 'Successful login via email/password',
    ipAddress: '192.168.1.1',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'success'
  },
  {
    id: 'L-1002',
    action: 'Update Profile',
    category: 'user_management',
    actorId: 'A-001',
    actorName: 'Admin User',
    actorRole: 'admin',
    target: 'User Profile (U-102)',
    details: 'Changed role from user to lawyer',
    ipAddress: '10.0.0.5',
    timestamp: '2024-03-15T11:15:00Z',
    status: 'success'
  },
  {
    id: 'L-1003',
    action: 'Database Backup',
    category: 'system',
    actorId: 'SYS-001',
    actorName: 'System Cron',
    actorRole: 'system',
    target: 'Main Database',
    details: 'Daily backup completed',
    ipAddress: 'localhost',
    timestamp: '2024-03-15T00:00:00Z',
    status: 'success'
  },
  {
    id: 'L-1004',
    action: 'Failed Login Attempt',
    category: 'auth',
    actorId: 'unknown',
    actorName: 'Unknown',
    actorRole: 'user',
    target: 'Auth Service',
    details: 'Invalid password for user bob@example.com',
    ipAddress: '203.0.113.45',
    timestamp: '2024-03-14T22:10:00Z',
    status: 'failure'
  },
  {
    id: 'L-1005',
    action: 'Delete Document',
    category: 'data',
    actorId: 'L-205',
    actorName: 'Sarah Wilson',
    actorRole: 'lawyer',
    target: 'Document (D-552)',
    details: 'Deleted client document "Passport.pdf"',
    ipAddress: '198.51.100.2',
    timestamp: '2024-03-14T15:45:00Z',
    status: 'success'
  }
];

export function AuditLog() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            row.category === 'auth' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
            row.category === 'system' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
            row.category === 'data' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
            'bg-gray-100 text-gray-600 dark:bg-gray-800'
          }`}>
            {row.category === 'auth' ? <Shield className="w-4 h-4" /> :
             row.category === 'system' ? <Settings className="w-4 h-4" /> :
             row.category === 'data' ? <Database className="w-4 h-4" /> :
             <User className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">{row.action}</p>
            <p className="text-xs text-neutral-500">{row.target}</p>
          </div>
        </div>
      )
    },
    {
      key: 'actorName',
      header: 'Actor',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{row.actorName}</p>
          <p className="text-xs text-neutral-500 uppercase">{row.actorRole} • {row.ipAddress}</p>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[250px] block" title={row.details}>{row.details}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'success' ? 'success' : 'danger'} className="capitalize">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'timestamp',
      header: 'Time',
      render: (row) => <span className="text-xs text-neutral-500 whitespace-nowrap">{new Date(row.timestamp).toLocaleString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Audit Log</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Track system events and user actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Date Range
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={filteredLogs}
            keyExtractor={(row) => row.id}
            searchable
            searchPlaceholder="Search logs by action, user, or details..."
            onSearch={setSearchQuery}
            pageSize={15}
          />
        </CardBody>
      </Card>
    </div>
  );
}
