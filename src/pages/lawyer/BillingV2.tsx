import { DollarSign, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerBillingV2() {
  const invoices = [
    { id: 'INV-001', client: 'John Doe', amount: '$1,500', status: 'paid', date: '2024-03-15' },
    { id: 'INV-002', client: 'Jane Smith', amount: '$2,000', status: 'pending', date: '2024-03-10' },
    { id: 'INV-003', client: 'Bob Wilson', amount: '$750', status: 'overdue', date: '2024-02-28' },
  ];

  const stats = [
    { label: 'This Month', value: '$12,450' },
    { label: 'Outstanding', value: '$3,250' },
    { label: 'Paid', value: '$9,200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-slate-400">Manage invoices and payments</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6">
              <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Invoices</h2>
          </div>
          
          <div className="divide-y divide-slate-200">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{inv.id}</p>
                    <p className="text-sm text-slate-500">{inv.client} • {inv.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{inv.amount}</span>
                  <span className={`px-2 py-1 text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                    inv.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {inv.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
