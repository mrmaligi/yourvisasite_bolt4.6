import { CreditCard, Receipt, Download, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserBillingV2() {
  const invoices = [
    { id: 'INV-001', date: '2024-03-15', amount: '$299', status: 'paid', description: 'Partner Visa Premium Guide' },
    { id: 'INV-002', date: '2024-02-20', amount: '$150', status: 'paid', description: 'Consultation with Jane Smith' },
    { id: 'INV-003', date: '2024-01-10', amount: '$49', status: 'paid', description: 'Document Templates Bundle' },
  ];

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', default: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/26', default: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="text-slate-600">Manage your payments and invoices</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Recent Invoices</h2>
            </div>
            <div className="space-y-3">
              {invoices.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{inv.description}</p>
                    <p className="text-sm text-slate-500">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{inv.amount}</p>
                    <button className="text-sm text-blue-600"><Download className="w-4 h-4 inline" /> PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Payment Methods</h2>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-3 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-200" />
                    <div>
                      <p className="font-medium text-slate-900">{pm.type} ****{pm.last4}</p>
                      <p className="text-sm text-slate-500">Expires {pm.expiry}</p>
                    </div>
                  </div>
                  {pm.default && <span className="text-xs text-slate-500">Default</span>}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">Add Payment Method</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
