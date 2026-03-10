import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TransactionHistoryV2() {
  const transactions = [
    { id: 'TXN-001', date: 'Mar 20, 2024', description: 'Consultation Payment', amount: '-$500.00', status: 'Completed', type: 'debit' },
    { id: 'TXN-002', date: 'Mar 15, 2024', description: 'Refund - Document Review', amount: '+$250.00', status: 'Completed', type: 'credit' },
    { id: 'TXN-003', date: 'Mar 10, 2024', description: 'Subscription Renewal', amount: '-$49.00', status: 'Completed', type: 'debit' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          <p className="text-slate-400">View all your transactions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Transaction</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Description</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="p-4 font-medium text-slate-900">{txn.id}</td>
                  <td className="p-4">{txn.description}</td>
                  <td className="p-4">{txn.date}</td>
                  <td className={`p-4 text-right font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                    {txn.amount}
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" /> {txn.status}
                    </span>
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
