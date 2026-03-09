import { CreditCard, Shield, CheckCircle, Clock, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicPricingV2() {
  const plans = [
    { name: 'Free', price: '$0', description: 'For individuals exploring options', features: ['Visa eligibility check', 'Basic guides', 'Email support'] },
    { name: 'Premium', price: '$29/mo', description: 'For serious applicants', features: ['Everything in Free', 'Document templates', 'Priority support', 'Application tracking', 'Consultation discounts'], popular: true },
    { name: 'Business', price: '$99/mo', description: 'For migration agents', features: ['Everything in Premium', 'Multiple clients', 'White-label options', 'API access', 'Dedicated manager'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-300">Choose the plan that's right for you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`border p-6 ${plan.popular ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              {plan.popular && (
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium">Most Popular</span>
              )}
              
              <h3 className="text-xl font-semibold text-slate-900 mt-4">{plan.name}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">{plan.price}</p>
              <p className="text-slate-500 mt-1">{plan.description}</p>
              
              <ul className="space-y-3 my-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure payments</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Cancel anytime</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
