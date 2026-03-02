import { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  Eye,
  MoreVertical,
  Flag,
  UserX,
  MessageSquare
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

interface AbuseReport {
  id: string;
  targetId: string;
  targetType: 'user' | 'post' | 'comment' | 'lawyer';
  targetName: string; // The name of the user or title of content
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

const MOCK_REPORTS: AbuseReport[] = [
  {
    id: 'R-101',
    targetId: 'U-502',
    targetType: 'user',
    targetName: 'Spam Bot 3000',
    reporterId: 'U-105',
    reporterName: 'Alice Johnson',
    reason: 'Spam',
    description: 'This user is posting the same message in every forum thread.',
    status: 'pending',
    severity: 'medium',
    createdAt: '2024-03-15T11:00:00Z',
  },
  {
    id: 'R-102',
    targetId: 'C-889',
    targetType: 'comment',
    targetName: 'Comment on "Visa Guide"',
    reporterId: 'U-112',
    reporterName: 'Bob Smith',
    reason: 'Hate Speech',
    description: 'The comment contains offensive language targeting a specific group.',
    status: 'investigating',
    severity: 'critical',
    createdAt: '2024-03-14T16:30:00Z',
  },
  {
    id: 'R-103',
    targetId: 'L-205',
    targetType: 'lawyer',
    targetName: 'Fake Lawyer Profile',
    reporterId: 'L-220',
    reporterName: 'Verified Lawyer Inc.',
    reason: 'Impersonation',
    description: 'This profile is using my photo and bio without permission.',
    status: 'pending',
    severity: 'high',
    createdAt: '2024-03-13T09:45:00Z',
  },
  {
    id: 'R-104',
    targetId: 'P-334',
    targetType: 'post',
    targetName: 'How to bypass visa rules',
    reporterId: 'U-108',
    reporterName: 'Charlie Davis',
    reason: 'Illegal Content',
    description: 'Post discusses illegal methods to obtain a visa.',
    status: 'resolved',
    severity: 'high',
    createdAt: '2024-03-12T14:20:00Z',
  }
];

export function AbuseReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<AbuseReport[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'ban' | 'dismiss' | 'warning' | null>(null);

  const handleAction = () => {
    if (!selectedReport || !actionType) return;

    let newStatus: AbuseReport['status'] = 'resolved';
    let toastMessage = '';

    switch (actionType) {
      case 'ban':
        newStatus = 'resolved';
        toastMessage = `User/Content banned successfully. Report ${selectedReport.id} resolved.`;
        break;
      case 'dismiss':
        newStatus = 'dismissed';
        toastMessage = `Report ${selectedReport.id} dismissed.`;
        break;
      case 'warning':
        newStatus = 'resolved';
        toastMessage = `Warning sent to user. Report ${selectedReport.id} resolved.`;
        break;
    }

    const updatedReports = reports.map(r =>
      r.id === selectedReport.id ? { ...r, status: newStatus } : r
    );

    setReports(updatedReports);
    setActionModalOpen(false);
    setSelectedReport(null);
    toast('success', toastMessage);
  };

  const openActionModal = (report: AbuseReport, type: 'ban' | 'dismiss' | 'warning') => {
    setSelectedReport(report);
    setActionType(type);
    setActionModalOpen(true);
  };

  const columns: Column<AbuseReport>[] = [
    {
      key: 'targetName',
      header: 'Reported Target',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{row.targetName}</p>
          <div className="flex items-center gap-1 text-xs text-neutral-500 capitalize">
            {row.targetType === 'user' && <UserX className="w-3 h-3" />}
            {row.targetType === 'post' && <Flag className="w-3 h-3" />}
            {row.targetType === 'comment' && <MessageSquare className="w-3 h-3" />}
            {row.targetType}
          </div>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-sm text-neutral-700 dark:text-neutral-300">{row.reason}</span>
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <Badge variant={
          row.severity === 'critical' ? 'danger' :
          row.severity === 'high' ? 'warning' : 'secondary'
        } className="capitalize">
          {row.severity}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={
          row.status === 'pending' ? 'warning' :
          row.status === 'investigating' ? 'primary' :
          row.status === 'resolved' ? 'success' : 'default'
        } className="capitalize">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => <span className="text-xs text-neutral-500">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setSelectedReport(row)}>
            Review
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Abuse Reports</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Moderation queue and safety center</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {reports.filter(r => r.severity === 'critical' && r.status === 'pending').length} Critical Pending
          </div>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={reports}
            keyExtractor={(row) => row.id}
            searchable
            searchPlaceholder="Search reports..."
            pageSize={10}
          />
        </CardBody>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedReport && !actionModalOpen}
        onClose={() => setSelectedReport(null)}
        title={`Report ${selectedReport?.id}`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="secondary" onClick={() => openActionModal(selectedReport!, 'dismiss')}>Dismiss Report</Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => openActionModal(selectedReport!, 'warning')}>Send Warning</Button>
              <Button variant="danger" onClick={() => openActionModal(selectedReport!, 'ban')}>Ban / Remove</Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-xs font-medium text-neutral-500 uppercase mb-2">Target</h3>
              <p className="font-semibold text-neutral-900 dark:text-white">{selectedReport?.targetName}</p>
              <p className="text-sm text-neutral-500 capitalize">{selectedReport?.targetType} • ID: {selectedReport?.targetId}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-xs font-medium text-neutral-500 uppercase mb-2">Reporter</h3>
              <p className="font-semibold text-neutral-900 dark:text-white">{selectedReport?.reporterName}</p>
              <p className="text-sm text-neutral-500">ID: {selectedReport?.reporterId}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Violation: {selectedReport?.reason}
            </h3>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800">
              <p className="text-neutral-700 dark:text-neutral-300">{selectedReport?.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
             <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-yellow-600" />
               <div>
                 <p className="font-medium text-yellow-900 dark:text-yellow-100">Recommended Action</p>
                 <p className="text-xs text-yellow-700 dark:text-yellow-300">
                   {selectedReport?.severity === 'critical' ? 'Immediate suspension recommended due to severity.' : 'Review content and issue warning if necessary.'}
                 </p>
               </div>
             </div>
          </div>
        </div>
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={
          actionType === 'ban' ? 'Confirm Ban / Removal' :
          actionType === 'warning' ? 'Confirm Warning' : 'Dismiss Report'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setActionModalOpen(false)}>Cancel</Button>
            <Button
              variant={actionType === 'ban' ? 'danger' : actionType === 'warning' ? 'primary' : 'secondary'}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-neutral-600 dark:text-neutral-400">
          {actionType === 'ban' && "Are you sure you want to ban this user or remove this content? This action may be irreversible."}
          {actionType === 'warning' && "This will send a formal warning notification to the user. Proceed?"}
          {actionType === 'dismiss' && "This report will be marked as dismissed and no action will be taken."}
        </p>
      </Modal>
    </div>
  );
}
