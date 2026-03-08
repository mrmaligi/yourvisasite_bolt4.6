import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle,
  User,
  MessageSquare,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Cannot access premium content',
    requester: 'John Doe',
    role: 'user',
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-20',
    lastUpdate: '2 hours ago',
  },
  {
    id: 'TKT-002',
    subject: 'Payment failed but charged',
    requester: 'Sarah Smith',
    role: 'user',
    status: 'pending',
    priority: 'urgent',
    createdAt: '2024-03-19',
    lastUpdate: '5 hours ago',
  },
  {
    id: 'TKT-003',
    subject: 'How to update availability?',
    requester: 'Michael Chen',
    role: 'lawyer',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-18',
    lastUpdate: '1 day ago',
  },
  {
    id: 'TKT-004',
    subject: 'Document upload error',
    requester: 'Emma Wilson',
    role: 'user',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-03-20',
    lastUpdate: '3 hours ago',
  },
];

export function SupportTicketsV2() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    if (activeTab === 'all') return true;
    return ticket.status === activeTab;
  });

  const stats = {
    total: MOCK_TICKETS.length,
    open: MOCK_TICKETS.filter(t => t.status === 'open').length,
    pending: MOCK_TICKETS.filter(t => t.status === 'pending').length,
    resolved: MOCK_TICKETS.filter(t => t.status === 'resolved').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="primary">Open</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'resolved': return <Badge variant="success">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[priority] || 'bg-slate-100 text-slate-700'}`}>
        {priority}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Support Tickets | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
                <p className="text-slate-600">Manage customer support requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
              { label: 'Open', value: stats.open, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs - SQUARE */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['all', 'open', 'pending', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tickets Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Ticket ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Subject</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Requester</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Priority</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Last Update</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm text-slate-900">{ticket.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{ticket.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-900">{ticket.requester}</p>
                            <p className="text-xs text-slate-500 capitalize">{ticket.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{ticket.lastUpdate}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
