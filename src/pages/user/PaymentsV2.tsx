import { CreditCard, Wallet, Receipt, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserPaymentsV2() {
  const transactions = [
    { id: 1, description: 'Partner Visa Premium Guide', amount: '-$299', date: '2024-03-20', type: 'debit' },
    { id: 2, description: 'Refund - Consultation', amount: '+$150', date: '2024-03-18', type: 'credit' },
    { id: 3, description: 'Document Templates', amount: '-$49', date: '2024-03-15', type: 'debit' },
    { id: 4, description: 'Account Top-up', amount: '+$500', date: '2024-03-10', type: 'credit' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-600">Manage your payment methods and view transactions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <Wallet className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">Wallet Balance</p>
            <p className="text-2xl font-bold text-slate-900">$302.00</p>
          </div>
          <div className="bg-white border border-slate-200 p-6">
            <CreditCard className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Default Card</p>
            <p className="text-lg font-semibold text-slate-900">Visa ****4242</p>
          </div>
          <div className="bg-white border border-slate-200 p-6">
            <Receipt className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">This Month</p>
            <p className="text-2xl font-bold text-slate-900">$348.00</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{t.description}</p>
                  <p className="text-sm text-slate-500">{t.date}</p>
                </div>
                <span className={`font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
