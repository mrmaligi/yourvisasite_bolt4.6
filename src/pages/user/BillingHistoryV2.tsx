import { CreditCard, Calendar, CheckCircle, Download, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BillingHistoryV2() {
  const invoices = [
    { id: 'INV-001', date: 'Mar 20, 2024', amount: '$500.00', status: 'Paid', description: 'Consultation Fee' },
    { id: 'INV-002', date: 'Feb 20, 2024', amount: '$750.00', status: 'Paid', description: 'Document Review' },
    { id: 'INV-003', date: 'Jan 20, 2024', amount: '$1,200.00', status: 'Paid', description: 'Application Fee' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Billing History</h1>
          <p className="text-slate-400">View your payment history</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 mb-6">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Invoice</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Description</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-4 font-medium text-slate-900">{inv.id}</td>
                  <td className="p-4">{inv.description}</td>
                  <td className="p-4">{inv.date}</td>
                  <td className="p-4 font-medium">{inv.amount}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" /> {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
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
