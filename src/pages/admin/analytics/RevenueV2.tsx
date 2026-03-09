import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export function RevenueV2() {
  const metrics = [
    { label: 'Total Revenue', value: '$124,500', change: '+23%', up: true },
    { label: 'This Month', value: '$18,240', change: '+12%', up: true },
    { label: 'Avg. Order Value', value: '$245', change: '-5%', up: false },
    { label: 'Transactions', value: '508', change: '+18%', up: true },
  ];

  const recentTransactions = [
    { id: '#TRX-001', customer: 'John Doe', amount: '$299', status: 'completed', date: '2024-03-20' },
    { id: '#TRX-002', customer: 'Jane Smith', amount: '$149', status: 'completed', date: '2024-03-19' },
    { id: '#TRX-003', customer: 'Bob Johnson', amount: '$499', status: 'pending', date: '2024-03-18' },
    { id: '#TRX-004', customer: 'Alice Brown', amount: '$199', status: 'completed', date: '2024-03-17' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
          <p className="text-slate-600">Track your revenue and transactions</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-slate-400" />
                <p className="text-sm text-slate-600">{m.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{m.value}</p>
              <div className={`flex items-center gap-1 mt-2 ${m.up ? 'text-green-600' : 'text-red-600'}`}>
                {m.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm">{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-200">
            {recentTransactions.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600">{t.id}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{t.customer}</p>
                    <p className="text-sm text-slate-500">{t.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-900">{t.amount}</span>
                  <span className={`px-2 py-1 text-xs font-medium ${
                    t.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
