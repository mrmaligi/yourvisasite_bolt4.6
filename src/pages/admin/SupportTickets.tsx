import { useState } from 'react';
import {
  CheckCircle,
  User
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'user' | 'lawyer';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdated: string;
  assignee?: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1001',
    subject: 'Cannot upload documents for visa application',
    description: 'Every time I try to upload my passport, it says "Server Error". I have tried multiple times.',
    requesterName: 'Alice Johnson',
    requesterEmail: 'alice@example.com',
    requesterRole: 'user',
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T09:30:00Z',
    lastUpdated: '2024-03-15T09:30:00Z',
  },
  {
    id: 'T-1002',
    subject: 'Payment failed but charged',
    description: 'I was charged $50 for a consultation but the booking shows as pending payment.',
    requesterName: 'Bob Smith',
    requesterEmail: 'bob@example.com',
    requesterRole: 'user',
    status: 'pending',
    priority: 'urgent',
    createdAt: '2024-03-14T14:15:00Z',
    lastUpdated: '2024-03-15T10:00:00Z',
    assignee: 'Support Team'
  },
  {
    id: 'T-1003',
    subject: 'Update law firm address',
    description: 'We have moved offices, please update our profile address.',
    requesterName: 'Law Partners LLC',
    requesterEmail: 'contact@lawpartners.com',
    requesterRole: 'lawyer',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-12T11:20:00Z',
    lastUpdated: '2024-03-13T15:45:00Z',
    assignee: 'Admin'
  },
  {
    id: 'T-1004',
    subject: 'Feature request: Dark mode',
    description: 'Would love to see a dark mode option for the dashboard.',
    requesterName: 'Charlie Davis',
    requesterEmail: 'charlie@example.com',
    requesterRole: 'user',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-10T08:00:00Z',
    lastUpdated: '2024-03-11T09:00:00Z',
  },
  {
    id: 'T-1005',
    subject: 'Account verification taking too long',
    description: 'It has been 5 days since I submitted my documents.',
    requesterName: 'David Wilson',
    requesterEmail: 'david@example.com',
    requesterRole: 'lawyer',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-03-14T16:50:00Z',
    lastUpdated: '2024-03-14T16:50:00Z',
  }
];

export function SupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    return ticket.status === activeTab;
  });

  const columns: Column<Ticket>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span className="font-mono text-xs text-neutral-500">{row.id}</span>
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{row.subject}</p>
          <p className="text-xs text-neutral-500 truncate max-w-[200px]">{row.description}</p>
        </div>
      )
    },
    {
      key: 'requesterName',
      header: 'Requester',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {row.requesterName[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{row.requesterName}</p>
            <p className="text-xs text-neutral-500 capitalize">{row.requesterRole}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={
          row.status === 'open' ? 'danger' :
          row.status === 'pending' ? 'warning' :
          row.status === 'resolved' ? 'success' : 'secondary'
        } className="capitalize">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => (
        <Badge variant={
          row.priority === 'urgent' ? 'danger' :
          row.priority === 'high' ? 'warning' :
          row.priority === 'medium' ? 'primary' : 'secondary'
        } className="capitalize">
          {row.priority}
        </Badge>
      )
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (row) => <span className="text-xs text-neutral-500">{new Date(row.lastUpdated).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(row)}>
          View
        </Button>
      )
    }
  ];

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    // Update ticket status to 'pending' if it was 'open'
    const updatedTickets = tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: 'pending', lastUpdated: new Date().toISOString() } as Ticket
        : t
    );

    setTickets(updatedTickets);
    setReplyText('');
    setSelectedTicket(null);
    toast('success', 'Reply sent successfully');
  };

  const handleStatusChange = (newStatus: Ticket['status']) => {
    if (!selectedTicket) return;

    const updatedTickets = tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: newStatus, lastUpdated: new Date().toISOString() } as Ticket
        : t
    );

    setTickets(updatedTickets);
    setSelectedTicket({ ...selectedTicket, status: newStatus });
    toast('success', `Ticket marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Support Tickets</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage user inquiries and issues</p>
        </div>
        <Button className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Resolve All
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticket List */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="p-0 border-b border-neutral-200 dark:border-neutral-700">
              <div className="px-4 pt-4 pb-2">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Tickets</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <DataTable
                columns={columns}
                data={filteredTickets}
                keyExtractor={(row) => row.id}
                searchable
                searchPlaceholder="Search tickets..."
                pageSize={10}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Ticket ${selectedTicket?.id}`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              {selectedTicket?.status !== 'resolved' && (
                <Button variant="secondary" onClick={() => handleStatusChange('resolved')}>
                  Mark Resolved
                </Button>
              )}
              {selectedTicket?.status !== 'closed' && (
                <Button variant="secondary" onClick={() => handleStatusChange('closed')}>
                  Close Ticket
                </Button>
              )}
            </div>
            <Button onClick={handleReply} disabled={!replyText.trim()}>Send Reply</Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{selectedTicket?.subject}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                <span>Created {selectedTicket && new Date(selectedTicket.createdAt).toLocaleString()}</span>
                <span>•</span>
                <span className="capitalize">{selectedTicket?.priority} Priority</span>
              </div>
            </div>
            <Badge variant={
              selectedTicket?.status === 'open' ? 'danger' :
              selectedTicket?.status === 'pending' ? 'warning' :
              selectedTicket?.status === 'resolved' ? 'success' : 'secondary'
            } className="capitalize">
              {selectedTicket?.status}
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
            <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800">
              <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">{selectedTicket?.description}</p>
            </div>
          </div>

          {/* Requester Info */}
          <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{selectedTicket?.requesterName}</p>
              <p className="text-sm text-neutral-500">{selectedTicket?.requesterEmail} • <span className="capitalize">{selectedTicket?.requesterRole}</span></p>
            </div>
          </div>

          {/* Reply Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Reply</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[120px] resize-y text-neutral-900 dark:text-white"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
