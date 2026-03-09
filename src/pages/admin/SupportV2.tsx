import { HelpCircle, FileText, MessageSquare, ExternalLink } from 'lucide-react';

export function AdminSupportV2() {
  const tickets = [
    { id: 1, subject: 'Login issue', user: 'john@example.com', status: 'Open', priority: 'High' },
    { id: 2, subject: 'Payment failed', user: 'jane@example.com', status: 'In Progress', priority: 'Medium' },
    { id: 3, subject: 'Document upload error', user: 'bob@example.com', status: 'Resolved', priority: 'Low' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <p className="text-slate-400">Manage user support requests</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Ticket</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Priority</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="p-4 font-medium">{ticket.subject}</td>
                  <td className="p-4">{ticket.user}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                      ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>{ticket.status}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>{ticket.priority}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
