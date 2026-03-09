import { CreditCard, FileText, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BillingInvoicesV2() {
  const invoices = [
    { id: 'INV-001', date: '2024-03-15', amount: '$299', description: 'Partner Visa Premium Guide', status: 'paid' },
    { id: 'INV-002', date: '2024-02-20', amount: '$150', description: 'Consultation with Jane Smith', status: 'paid' },
    { id: 'INV-003', date: '2024-01-10', amount: '$49', description: 'Document Templates Bundle', status: 'paid' },
    { id: 'INV-004', date: '2023-12-05', amount: '$199', description: 'Comprehensive Visa Package', status: 'paid' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600">View and download your invoices</p>
        </div>

        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Invoice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Description</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{inv.date}</td>
                  <td className="px-6 py-4 text-slate-700">{inv.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700">{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">{inv.amount}</td>
                  <td className="px-6 py-4 text-right">
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
