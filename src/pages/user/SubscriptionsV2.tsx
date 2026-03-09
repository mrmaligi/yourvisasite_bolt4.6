import { Zap, Star, Crown, CheckCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserSubscriptionsV2() {
  const currentPlan = {
    name: 'Premium',
    price: '$29/month',
    features: ['Unlimited applications', 'Priority support', 'Document templates', 'Consultation discounts'],
    nextBilling: '2024-04-15',
  };

  const plans = [
    { name: 'Free', price: '$0', features: ['1 active application', 'Basic support', 'Standard templates'] },
    { name: 'Pro', price: '$19/month', features: ['5 active applications', 'Priority support', 'Premium templates', '5% consultation discount'] },
    { name: 'Enterprise', price: '$99/month', features: ['Unlimited applications', '24/7 support', 'Custom templates', '20% consultation discount', 'Dedicated account manager'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-slate-600">Manage your subscription plan</p>
        </div>

        <div className="bg-blue-600 text-white p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6" />
                <span className="font-semibold">Current Plan: {currentPlan.name}</span>
              </div>
              <p className="text-3xl font-bold">{currentPlan.price}</p>
              <p className="text-blue-100">Next billing: {currentPlan.nextBilling}</p>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-blue-700">Cancel Plan</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`border p-6 ${plan.name === currentPlan.name ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
              <div className="text-center mb-6">
                <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-slate-900">{plan.price}</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant={plan.name === currentPlan.name ? 'outline' : 'primary'} className="w-full" disabled={plan.name === currentPlan.name}>
                {plan.name === currentPlan.name ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
