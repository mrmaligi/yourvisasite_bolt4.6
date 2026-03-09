import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, MessageSquare, Clock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Ticket {
  id: string;
  subject: string;
  requester: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const MOCK_TICKETS: Ticket[] = [
  { id: '1', subject: 'Cannot upload documents', requester: 'john@example.com', status: 'open', priority: 'high', createdAt: '2024-03-20' },
  { id: '2', subject: 'Payment issue', requester: 'sarah@example.com', status: 'pending', priority: 'medium', createdAt: '2024-03-19' },
  { id: '3', subject: 'Account verification', requester: 'mike@example.com', status: 'resolved', priority: 'low', createdAt: '2024-03-18' },
];

export function SupportTicketsV2() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [filter, setFilter] = useState('all');

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium ${colors[priority]}`}>{priority}</span>;
  };

  return (
    <>
      <Helmet>
        <title>Support Tickets | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: MessageSquare },
              { label: 'Open', value: stats.open, icon: Clock, color: 'text-red-600' },
              { label: 'Pending', value: stats.pending, icon: User, color: 'text-yellow-600' },
              { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {['all', 'open', 'pending', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Ticket</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Requester</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Priority</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Created</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{ticket.subject}</p>
                        <p className="text-sm text-slate-500">#{ticket.id}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{ticket.requester}</td>
                      <td className="px-6 py-4">
                        <Badge variant={ticket.status === 'open' ? 'danger' : ticket.status === 'pending' ? 'warning' : 'success'}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-6 py-4 text-slate-600">{ticket.createdAt}</td>
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
