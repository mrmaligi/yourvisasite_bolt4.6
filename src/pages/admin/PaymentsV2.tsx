import { Settings, CreditCard, Percent, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function AdminPaymentsV2() {
  const [settings, setSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    sandboxMode: true,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Payment Settings</h1>
          <p className="text-slate-400">Configure payment gateway and pricing</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Payment Gateways</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Stripe</p>
                  <p className="text-sm text-slate-500">Credit card payments</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, stripeEnabled: !settings.stripeEnabled})}
                  className={`w-12 h-6 flex items-center ${settings.stripeEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white mx-0.5 transition-transform ${settings.stripeEnabled ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">PayPal</p>
                  <p className="text-sm text-slate-500">PayPal payments</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, paypalEnabled: !settings.paypalEnabled})}
                  className={`w-12 h-6 flex items-center ${settings.paypalEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white mx-0.5 transition-transform ${settings.paypalEnabled ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Pricing</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Premium Visa Guide Price</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">$</span>
                  <input type="number" defaultValue="49" className="w-32 px-3 py-2 border border-slate-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Fee (%)</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue="10" className="w-32 px-3 py-2 border border-slate-200" />
                  <span className="text-slate-500">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
