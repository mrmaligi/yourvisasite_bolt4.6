import { CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react';
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
          <p className="text-slate-400">Manage your saved payment methods</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-white border border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{card.type}</span>
                </div>
                
                <div>
                  <p className="font-medium text-slate-900">•••• {card.last4}</p>
                  <p className="text-sm text-slate-500">Expires {card.expiry}</p>
                </div>

                {card.default && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">Default</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!card.default && (
                  <button className="text-sm text-blue-600 hover:underline">Set as default</button>
                )}
                <button className="p-2 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>
    </div>
  );
}
