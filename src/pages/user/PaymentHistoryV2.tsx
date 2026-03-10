import { CreditCard, DollarSign, Calendar, CheckCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PaymentHistoryV2() {
  const payments = [
    { id: 'PAY-001', date: 'Mar 20, 2024', description: 'Consultation Fee', amount: '$500.00', status: 'Completed', method: 'Visa ending in 4242' },
    { id: 'PAY-002', date: 'Feb 20, 2024', description: 'Document Review', amount: '$750.00', status: 'Completed', method: 'Mastercard ending in 8888' },
    { id: 'PAY-003', date: 'Jan 15, 2024', description: 'Application Fee', amount: '$1,200.00', status: 'Completed', method: 'Visa ending in 4242' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Payment History</h1>
          <p className="text-slate-400">View your payment history and receipts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Payment ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Description</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="p-4 font-medium text-slate-900">{payment.id}</td>
                  <td className="p-4">
                    <p className="text-slate-900">{payment.description}</p>
                    <p className="text-sm text-slate-500">{payment.method}</p>
                  </td>
                  <td className="p-4">{payment.date}</td>
                  <td className="p-4 font-medium">{payment.amount}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" /> {payment.status}
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
