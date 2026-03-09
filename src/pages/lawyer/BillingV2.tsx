import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Download, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Invoice {
  id: string;
  client: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
}

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', client: 'John Doe', date: '2024-03-20', amount: '$1,500', status: 'paid' },
  { id: 'INV-002', client: 'Alice Smith', date: '2024-03-18', amount: '$2,200', status: 'pending' },
  { id: 'INV-003', client: 'Robert Brown', date: '2024-03-15', amount: '$850', status: 'overdue' },
];

export function BillingV2() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.reduce((sum, i) => sum + parseInt(i.amount.replace(/[$,]/g, '')), 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Billing | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
                <p className="text-slate-600">Manage invoices and track payments</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Invoices', value: stats.total, icon: FileText },
              { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
              { label: 'Overdue', value: stats.overdue, icon: Clock, color: 'text-red-600' },
              { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Invoice ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                      <td className="px-6 py-4 text-slate-700">{invoice.client}</td>
                      <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{invoice.amount}</td>
                      <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
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
