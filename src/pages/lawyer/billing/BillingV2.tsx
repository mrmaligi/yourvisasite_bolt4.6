import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, FileText, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', client: 'Alice Smith', amount: 1500, status: 'paid', date: '2023-11-20' },
  { id: 'INV-002', client: 'Bob Jones', amount: 2000, status: 'pending', date: '2023-11-25' },
  { id: 'INV-003', client: 'Charlie Brown', amount: 500, status: 'overdue', date: '2023-11-10' },
];

export function BillingV2() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);

  const stats = {
    outstanding: 3500,
    paidThisMonth: 12000,
    upcoming: 4,
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
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing & Invoicing</h1>
                <p className="text-slate-600">Manage payments and financial records</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Outstanding', value: `$${stats.outstanding.toLocaleString()}`, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
              { label: 'Paid This Month', value: `$${stats.paidThisMonth.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
              { label: 'Upcoming', value: stats.upcoming, icon: FileText, color: 'bg-blue-100 text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
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

          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Invoice</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{inv.id}</td>
                      <td className="px-6 py-4 text-slate-700">{inv.client}</td>
                      <td className="px-6 py-4 text-slate-900">${inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{inv.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Payment Methods</h3>
                <p className="text-blue-700">Manage your connected payment accounts</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
