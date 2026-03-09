import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Lock, Shield, CreditCard, ArrowLeft, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function CheckoutV2() {
  const [searchParams] = useSearchParams();
  const visaSubClass = searchParams.get('visa');
  const plan = searchParams.get('plan');
  
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const planDetails = {
    basic: { name: 'Basic Guide', price: 29, features: ['Step-by-step guide', 'Document checklist', 'Processing times'] },
    premium: { name: 'Premium Package', price: 49, features: ['Everything in Basic', 'Template documents', 'Example applications', 'Priority support'] },
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.basic;

  return (
    <>
      <Helmet>
        <title>Checkout | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </a>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
              <p className="text-slate-600 mb-6">Complete your purchase securely</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handlePayment}
                disabled={loading}
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : `Pay $${currentPlan.price}`}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Encrypted
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="primary">{visaSubClass}</Badge>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">{currentPlan.name}</h2>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">${currentPlan.price}</span>
                <span className="text-slate-600">AUD</span>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-slate-700">What's included:</p>
                
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
