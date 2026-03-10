import { DollarSign, CreditCard, Receipt, TrendingUp, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerEarningsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Earnings</h1>
          <p className="text-slate-400">Track your income and payouts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Total Earnings</p>
            <p className="text-2xl font-bold text-slate-900">$12,450</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <Receipt className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">This Month</p>
            <p className="text-2xl font-bold text-slate-900">$3,200</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">Consultations</p>
            <p className="text-2xl font-bold text-slate-900">89</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <CreditCard className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-2xl font-bold text-slate-900">$850</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          
          <div className="divide-y divide-slate-200">
            {[
              { client: 'John Doe', service: 'Consultation', date: 'Mar 20, 2024', amount: '$250' },
              { client: 'Jane Smith', service: 'Document Review', date: 'Mar 18, 2024', amount: '$180' },
              { client: 'Bob Wilson', service: 'Consultation', date: 'Mar 15, 2024', amount: '$250' },
            ].map((txn, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{txn.client}</p>
                  <p className="text-sm text-slate-500">{txn.service} • {txn.date}</p>
                </div>
                <span className="font-medium text-green-600">{txn.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
