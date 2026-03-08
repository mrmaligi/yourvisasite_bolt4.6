import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function PricingV2() {
  const plans = [
    {
      name: 'Basic',
      description: 'Essential tools for your research',
      price: '$0',
      period: '/ forever',
      features: [
        'Unlimited Visa Search',
        'Basic Visa Information',
        'Community Tracker Access',
        'Immigration News',
      ],
      cta: 'Start for Free',
      href: '/visas',
      popular: false,
    },
    {
      name: 'Premium',
      description: 'Complete roadmap for your application',
      price: '$99',
      period: '/ visa guide',
      features: [
        'Everything in Basic',
        'Step-by-Step Guide',
        'Document Checklists',
        'Timeline Templates',
        'Priority Support',
      ],
      cta: 'Get Premium',
      href: '/register',
      popular: true,
    },
    {
      name: 'Lawyer Assist',
      description: 'Professional legal representation',
      price: '$350',
      period: '/ hour',
      features: [
        'Everything in Premium',
        '1-on-1 Lawyer Consultation',
        'Document Review',
        'Application Preparation',
        'Ongoing Support',
      ],
      cta: 'Find a Lawyer',
      href: '/lawyers',
      popular: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
              <p className="text-slate-600">Choose the plan that fits your immigration journey</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Pricing Cards - SQUARE */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white border p-8 flex flex-col ${
                  plan.popular ? 'border-blue-600 border-2' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white px-3 py-1 text-sm font-medium inline-block mb-4">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-600">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
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

          {/* FAQ - SQUARE */}
          <div className="mt-16 bg-white border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Can I upgrade my plan later?',
                  a: 'Yes, you can upgrade anytime. Your progress will be saved.',
                },
                {
                  q: 'Is there a refund policy?',
                  a: 'We offer a 7-day money-back guarantee on all premium plans.',
                },
                {
                  q: 'How do lawyer consultations work?',
                  a: 'Book online, meet via video call, get expert advice.',
                },
                {
                  q: 'Are the visa guides up to date?',
                  a: 'Yes, we update our guides regularly with the latest immigration rules.',
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
