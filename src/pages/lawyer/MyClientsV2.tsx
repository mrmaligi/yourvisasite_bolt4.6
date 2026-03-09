import { Users, UserPlus, Search, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerClientsV2() {
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+61 412 345 678', cases: 2, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+61 423 456 789', cases: 1, status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+61 434 567 890', cases: 3, status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+61 445 678 901', cases: 1, status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Clients</h1>
            <p className="text-slate-400">Manage your client relationships</p>
          </div>
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search clients..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Client</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Cases</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{client.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-slate-600"><Mail className="w-3 h-3" /> {client.email}</div>
                      <div className="flex items-center gap-1 text-slate-500"><Phone className="w-3 h-3" /> {client.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">{client.cases} active</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>{client.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
