import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Search, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastContact: string;
  cases: number;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+61 400 123 456', status: 'active', lastContact: '2024-03-20', cases: 2 },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', phone: '+61 400 234 567', status: 'active', lastContact: '2024-03-18', cases: 1 },
  { id: '3', name: 'Jessica Davis', email: 'jessica@example.com', phone: '+61 400 345 678', status: 'inactive', lastContact: '2024-02-15', cases: 0 },
];

export function ClientsV2() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
  };

  return (
    <>
      <Helmet>
        <title>Clients | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                <p className="text-slate-600">Manage your client relationships</p>
              </div>
              <Button variant="primary">
                <Users className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Clients', value: stats.total, icon: Users },
              { label: 'Active', value: stats.active, icon: Users, color: 'text-green-600' },
              { label: 'Inactive', value: stats.inactive, icon: Users, color: 'text-slate-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Contact</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Cases</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Last Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center font-medium text-slate-600">
                            {client.name.charAt(0)}
                          </div>
                          <p className="font-medium text-slate-900">{client.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{client.cases}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {client.lastContact}
                        </div>
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
