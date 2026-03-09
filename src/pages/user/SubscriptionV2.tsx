import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SubscriptionV2() {
  const plans = [
    {
      name: 'Basic',
      price: '$0',
      period: 'Free',
      features: ['Access to guides', 'Basic tools', 'Email support'],
      current: false,
    },
    {
      name: 'Premium',
      price: '$49',
      period: '/month',
      features: ['Everything in Basic', 'Lawyer consultations', 'Priority support', 'Document review'],
      current: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      features: ['Everything in Premium', 'Dedicated lawyer', 'Unlimited consultations', 'Custom solutions'],
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-400">Select the best plan for your needs</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white border-2 p-6 ${plan.current ? 'border-blue-600' : 'border-slate-200'}`}
            >
              {plan.current && (
                <span className="px-3 py-1 bg-blue-600 text-white text-sm">Current Plan</span>
              )}
              
              <h2 className="text-xl font-semibold text-slate-900 mt-4">{plan.name}</h2>
              
              <div className="my-4">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.current ? 'outline' : 'primary'}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
