import { CreditCard, TrendingUp, Users, DollarSign, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminBillingV2() {
  const transactions = [
    { id: 'TRX-001', customer: 'John Doe', amount: '$500.00', status: 'Completed', date: 'Mar 20, 2024' },
    { id: 'TRX-002', customer: 'Jane Smith', amount: '$750.00', status: 'Completed', date: 'Mar 18, 2024' },
    { id: 'TRX-003', customer: 'Bob Wilson', amount: '$1,200.00', status: 'Pending', date: 'Mar 15, 2024' },
    { id: 'TRX-004', customer: 'Alice Brown', amount: '$350.00', status: 'Failed', date: 'Mar 10, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-slate-400">Manage payments and transactions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Revenue (MTD)</p>
            <p className="text-2xl font-bold text-slate-900">$45,250</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <CreditCard className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">Transactions</p>
            <p className="text-2xl font-bold text-slate-900">156</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">Conversion</p>
            <p className="text-2xl font-bold text-slate-900">8.4%</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm text-slate-600">Active Subscribers</p>
            <p className="text-2xl font-bold text-slate-900">892</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((trx) => (
                <tr key={trx.id}>
                  <td className="p-4 font-medium text-slate-900">{trx.id}</td>
                  <td className="p-4">{trx.customer}</td>
                  <td className="p-4 font-medium">{trx.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      trx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      trx.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{trx.status}</span>
                  </td>
                  <td className="p-4">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
