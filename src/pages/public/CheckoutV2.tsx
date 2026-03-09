import { ShoppingCart, CheckCircle, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicCheckoutV2() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-8">
        <button className="flex items-center gap-2 text-slate-600 mb-8 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>
            
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-slate-200" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-slate-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-3 py-2 border border-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <div>
                  <p className="font-medium text-slate-900">Partner Visa Premium Guide</p>
                  <p className="text-sm text-slate-500">Digital Download</p>
                </div>
                <p className="font-semibold">$299.00</p>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-slate-200">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">$299.00</span>
              </div>
              
              <div className="flex items-center justify-between py-4">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold">$299.00</span>
              </div>
              
              <Button variant="primary" className="w-full mt-4">
                <Lock className="w-4 h-4 mr-2" />
                Complete Purchase
              </Button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                <Lock className="w-4 h-4" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
