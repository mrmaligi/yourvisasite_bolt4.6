import { Helmet } from 'react-helmet-async';
import { Check, Sparkles, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const plans = [
  {
    name: 'Basic',
    icon: Users,
    price: '$0',
    period: 'forever',
    description: 'Essential tools for your research',
    features: [
      'Unlimited Visa Search',
      'Basic Visa Information',
      'Community Tracker Access',
      'Immigration News',
      'Lawyer Directory Access'
    ],
    cta: 'Start for Free',
    href: '/visas',
    popular: false
  },
  {
    name: 'Premium Guide',
    icon: Sparkles,
    price: '$49',
    period: 'per visa',
    description: 'Complete roadmap for your application',
    features: [
      'Step-by-step Application Guide',
      'Document Checklists',
      'Real Example Applications',
      'Document Templates',
      'Expert Tips & Tricks',
      'Priority Email Support'
    ],
    cta: 'Get Premium Access',
    href: '/visas',
    popular: true
  },
  {
    name: 'Concierge',
    icon: Crown,
    price: '$299',
    period: 'per application',
    description: 'Full legal representation and support',
    features: [
      'Everything in Premium',
      'Lawyer Review of Documents',
      'Application Submission Help',
      'Priority Processing Request',
      'Direct Lawyer Messaging',
      'Refund if Visa Denied*'
    ],
    cta: 'Book Consultation',
    href: '/lawyers',
    popular: false
  }
];

export function PricingV2() {
  return (
    <>
      <Helmet>
        <title>Pricing | VisaBuild</title>
        <meta name="description" content="Choose the plan that fits your immigration journey. From free resources to full legal representation." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Badge variant="primary" className="mb-4 bg-blue-600">Pricing</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your immigration journey. No hidden fees.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Pricing Cards - SQUARE */}
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white border p-6 flex flex-col ${
                  plan.popular ? 'border-blue-600 border-2' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="mb-4">
                    <Badge variant="primary" className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 ml-1">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <div className="w-5 h-5 bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href}>
                  <Button 
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Note - SQUARE */}
          <div className="mt-12 bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Can I switch plans?</h3>
                <p className="text-slate-600 text-sm">Yes, you can upgrade or downgrade at any time. Changes take effect immediately.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-900 mb-2">What's included in Premium?</h3>
                <p className="text-slate-600 text-sm">Detailed step-by-step guides, document checklists, templates, and example applications for your specific visa type.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Is there a refund policy?</h3>
                <p className="text-slate-600 text-sm">Premium guides come with a 7-day money-back guarantee if you're not satisfied.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Need help choosing?</h3>
                <p className="text-slate-600 text-sm">Contact our team or book a free consultation with a lawyer to discuss your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
