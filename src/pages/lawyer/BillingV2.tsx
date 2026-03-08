import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Download, DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const MOCK_INVOICES = [
  { id: 'INV-001', client: 'John Doe', date: '2024-03-20', amount: 1500, status: 'paid' },
  { id: 'INV-002', client: 'Alice Smith', date: '2024-03-18', amount: 2200, status: 'pending' },
  { id: 'INV-003', client: 'Robert Brown', date: '2024-03-15', amount: 850, status: 'overdue' },
  { id: 'INV-004', client: 'Emma Wilson', date: '2024-03-10', amount: 3200, status: 'paid' },
  { id: 'INV-005', client: 'Michael Chen', date: '2024-03-05', amount: 1800, status: 'pending' },
];

export function BillingV2() {
  const [invoices] = useState(MOCK_INVOICES);

  const stats = {
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdueAmount: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
    totalInvoices: invoices.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">Paid</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'overdue': return <Badge variant="danger">Overdue</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Billing | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
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
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
              { label: 'Pending', value: `$${stats.pendingAmount.toLocaleString()}`, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Overdue', value: `$${stats.overdueAmount.toLocaleString()}`, icon: TrendingUp, color: 'bg-red-100 text-red-600' },
              { label: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'bg-blue-100 text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invoices Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
            </div>
            
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
                      <td className="px-6 py-4 font-mono text-sm text-slate-900">{invoice.id}</td>
                      <td className="px-6 py-4 text-slate-900">{invoice.client}</td>
                      <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">${invoice.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
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
