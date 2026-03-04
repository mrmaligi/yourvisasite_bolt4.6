import { useEffect, useState } from 'react';
import {
  CheckCircle,
  User,
  MessageSquare,
  Clock,
  Send,
  X
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  requester_id: string | null;
  requester_email: string;
  requester_name: string | null;
  requester_role: 'user' | 'lawyer' | 'admin';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  assignee_name: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketReply {
  id: string;
  ticket_id: string;
  author_name: string;
  author_role: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export function SupportTickets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast('error', 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    fetchReplies(ticket.id);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim() || !user) return;

    try {
      setSending(true);
      const { error } = await supabase.from('support_ticket_replies').insert({
        ticket_id: selectedTicket.id,
        author_id: user.id,
        author_name: 'Admin',
        author_role: 'admin',
        message: replyText.trim(),
        is_internal: false,
      });

      if (error) throw error;

      // Update ticket status to pending
      await supabase
        .from('support_tickets')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);

      setReplyText('');
      fetchReplies(selectedTicket.id);
      fetchTickets();
      toast('success', 'Reply sent');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast('error', 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: Ticket['status']) => {
    try {
      const updates: Partial<Ticket> = { status, updated_at: new Date().toISOString() };
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;

      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, ...updates });
      }
      toast('success', `Ticket ${status}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast('error', 'Failed to update ticket');
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === 'all') return true;
    return ticket.status === activeTab;
  });

  const columns: Column<Ticket>[] = [
    {
      key: 'id',
      header: 'Ticket ID',
      render: (ticket) => (
        <span className="font-mono text-sm">{ticket.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (ticket) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{ticket.subject}</p>
          <p className="text-sm text-neutral-500 truncate max-w-xs">{ticket.description}</p>
        </div>
      ),
    },
    {
      key: 'requester',
      header: 'Requester',
      render: (ticket) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-neutral-500" />
          </div>
          <div>
            <p className="text-sm font-medium">{ticket.requester_name || 'Unknown'}</p>
            <p className="text-xs text-neutral-500">{ticket.requester_role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (ticket) => {
        const colors = {
          open: 'bg-blue-100 text-blue-700',
          pending: 'bg-yellow-100 text-yellow-700',
          resolved: 'bg-green-100 text-green-700',
          closed: 'bg-neutral-100 text-neutral-600',
        };
        return (
          <Badge className={colors[ticket.status]}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (ticket) => {
        const colors = {
          low: 'bg-neutral-100 text-neutral-600',
          medium: 'bg-blue-100 text-blue-700',
          high: 'bg-orange-100 text-orange-700',
          urgent: 'bg-red-100 text-red-700',
        };
        return (
          <Badge className={colors[ticket.priority]}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (ticket) => (
        <span className="text-sm text-neutral-500">
          {new Date(ticket.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ticket) => (
        <Button variant="ghost" size="sm" onClick={() => handleOpenTicket(ticket)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Support Tickets</h1>
        <p className="text-neutral-500 mt-1">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open', count: tickets.filter((t) => t.status === 'open').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Pending', count: tickets.filter((t) => t.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Resolved', count: tickets.filter((t) => t.status === 'resolved').length, color: 'bg-green-100 text-green-700' },
          { label: 'Total', count: tickets.length, color: 'bg-neutral-100 text-neutral-700' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardBody className="p-4">
              <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.count}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Tabs and Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardBody>
          <DataTable<Ticket>
            columns={columns}
            data={filteredTickets}
            loading={loading}
            emptyMessage="No tickets found"
          />
        </CardBody>
      </Card>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.subject || 'Ticket Details'}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-neutral-500">From: {selectedTicket.requester_name} ({selectedTicket.requester_email})</p>
                  <p className="text-sm text-neutral-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={
                    selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    selectedTicket.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-neutral-100 text-neutral-600'
                  }>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className={
                    selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    selectedTicket.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-neutral-100 text-neutral-600'
                  }>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <p className="text-neutral-900 dark:text-white">{selectedTicket.description}</p>
            </div>

            {/* Replies */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {replies.length === 0 ? (
                <p className="text-center text-neutral-500 py-4">No replies yet</p>
              ) : (
                replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-3 rounded-lg ${
                      reply.author_role === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                        : 'bg-neutral-50 dark:bg-neutral-800 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{reply.author_name}</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{reply.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== 'closed' && (
              <div className="space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {selectedTicket.status === 'open' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'pending')}
                      >
                        Mark Pending
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    loading={sending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
