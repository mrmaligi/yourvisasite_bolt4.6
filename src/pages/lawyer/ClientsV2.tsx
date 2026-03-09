import { Users, Plus, Search, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerClientsV2() {
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+61 412 345 678', cases: 2, lastActive: '2 days ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+61 423 456 789', cases: 1, lastActive: '5 days ago' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+61 434 567 890', cases: 3, lastActive: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-slate-400">Manage your client relationships</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
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
          <div className="divide-y divide-slate-200">
            {clients.map((client) => (
              <div key={client.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">{client.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{client.name}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-600">{client.cases} active cases</p>
                  <p className="text-xs text-slate-400">{client.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
