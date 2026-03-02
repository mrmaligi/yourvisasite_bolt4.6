import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Pricing() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Choose the plan that fits your immigration journey. From free resources to full legal representation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Basic</h3>
              <p className="text-neutral-500 text-sm">Essential tools for your research.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-neutral-900">$0</span>
              <span className="text-neutral-500 ml-2">/ forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Unlimited Visa Search</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Basic Visa Information</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Community Tracker Access</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Immigration News</span>
              </li>
            </ul>
            <Link to="/visas">
              <Button variant="secondary" className="w-full">Start for Free</Button>
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-600 p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Premium Guide</h3>
              <p className="text-neutral-500 text-sm">Complete roadmap for your application.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-neutral-900">$49</span>
              <span className="text-neutral-500 ml-2">/ visa type</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="font-medium text-neutral-900">Step-by-step Application Guide</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>Document Checklists</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>Real Example Applications</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>Expert Tips & Warnings</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>Personal Progress Tracking</span>
              </li>
            </ul>
            <Link to="/visas">
              <Button className="w-full">Search Visas</Button>
            </Link>
          </div>

          {/* Consultation Tier */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Legal Consultation</h3>
              <p className="text-neutral-500 text-sm">Professional advice for complex cases.</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-neutral-900">Var.</span>
              <span className="text-neutral-500 ml-2">/ hour</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Verified Immigration Lawyers</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>1-on-1 Video Consultations</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Secure Document Sharing</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-600">
                <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Transparent Hourly Rates</span>
              </li>
            </ul>
            <Link to="/lawyers">
              <Button variant="secondary" className="w-full">Find a Lawyer</Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-neutral-500 w-1/3">Feature</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-neutral-900 w-1/6">Basic</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-primary-600 w-1/6">Premium</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-neutral-900 w-1/6">Consultation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[
                  { feature: 'Visa Requirements Info', basic: true, premium: true, consult: true },
                  { feature: 'Processing Time Tracker', basic: true, premium: true, consult: true },
                  { feature: 'Latest News & Updates', basic: true, premium: true, consult: true },
                  { feature: 'Detailed Step-by-Step Guide', basic: false, premium: true, consult: 'Optional' },
                  { feature: 'Document Checklists', basic: false, premium: true, consult: true },
                  { feature: 'Example Applications', basic: false, premium: true, consult: false },
                  { feature: 'Personalized To-Do List', basic: false, premium: true, consult: false },
                  { feature: 'Legal Advice', basic: false, premium: false, consult: true },
                  { feature: 'Document Review', basic: false, premium: false, consult: true },
                  { feature: 'Representation at Tribunal', basic: false, premium: false, consult: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-neutral-700 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {row.basic === true ? <Check className="w-5 h-5 text-teal-500 mx-auto" /> :
                       row.basic === false ? <X className="w-5 h-5 text-neutral-300 mx-auto" /> :
                       <span className="text-sm text-neutral-500">{row.basic}</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.premium === true ? <Check className="w-5 h-5 text-primary-600 mx-auto" /> :
                       row.premium === false ? <X className="w-5 h-5 text-neutral-300 mx-auto" /> :
                       <span className="text-sm text-neutral-500">{row.premium}</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.consult === true ? <Check className="w-5 h-5 text-teal-500 mx-auto" /> :
                       row.consult === false ? <X className="w-5 h-5 text-neutral-300 mx-auto" /> :
                       <span className="text-sm text-neutral-500">{row.consult}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
