import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PaymentMethodsV2() {
  const cards = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', default: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/26', default: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
          <p className="text-slate-400">Manage your payment options</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-4 mb-8">
          {cards.map((card) => (
            <div key={card.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold">{card.type}</span>
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900">•••• {card.last4}</p>
                    <p className="text-sm text-slate-500">Expires {card.expiry}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {card.default && (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" /> Default
                    </span>
                  )}
                  
                  <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>
    </div>
  );
}
