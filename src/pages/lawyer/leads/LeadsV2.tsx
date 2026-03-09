import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Phone, Mail, Search, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: string;
  date: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '0400 000 000', status: 'new', source: 'Website', date: '2023-11-28' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@example.com', phone: '0400 111 222', status: 'contacted', source: 'Referral', date: '2023-11-27' },
  { id: '3', name: 'Kyle Reese', email: 'kyle@example.com', phone: '0400 333 444', status: 'qualified', source: 'Ad Campaign', date: '2023-11-26' },
];

export function LeadsV2() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'primary' | 'warning' | 'success' | 'danger'> = {
      new: 'primary',
      contacted: 'warning',
      qualified: 'success',
      lost: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Leads | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                <p className="text-slate-600">Manage incoming inquiries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: User },
              { label: 'New', value: stats.new, icon: Filter, color: 'text-blue-600' },
              { label: 'Contacted', value: stats.contacted, icon: Phone, color: 'text-yellow-600' },
              { label: 'Qualified', value: stats.qualified, icon: Mail, color: 'text-green-600' },
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

          <div className="bg-white border border-slate-200 mb-6">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Lead</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Source</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.email}</p>
                          <p className="text-sm text-slate-400">{lead.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{lead.source}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lead.date}</td>
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
