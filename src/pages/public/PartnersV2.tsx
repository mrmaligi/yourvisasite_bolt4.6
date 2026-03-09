import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight, Building2, Mail, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const PARTNER_CATEGORIES = [
  { name: 'Health Insurance', description: 'Compare and choose the best health insurance.', link: '/partners/insurance' },
  { name: 'English Test Providers', description: 'Official partners for English language testing.', link: '/partners/english-test' },
  { name: 'Relocation Services', description: 'Get help moving to Australia.', link: '/partners/relocation' },
  { name: 'Banking and Finance', description: 'Set up your finances before you arrive.', link: '/partners/banking' },
  { name: 'Education Agents', description: 'Find the right course and institution.', link: '/partners/education' },
];

const BENEFITS = [
  "Access to high-intent leads",
  "Verified applicant data",
  "Automated document collection",
  "Integrated payment processing"
];

export function PartnersV2() {
  return (
    <>
      <Helmet>
        <title>Partner Program | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-slate-900 py-24 px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with VisaBuild</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join the fastest growing immigration platform in Australia.
            Connect with thousands of qualified applicants.
          </p>
          <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100">
            Apply Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Why Partner */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900">Why Partner With Us?</h2>
              <div className="space-y-6">
                {BENEFITS.map((item, i) => (
                  <div key={i} className="flex items-start p-4 bg-white border border-slate-200">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                    <p className="text-lg text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-slate-200 p-8">
              <h3 className="text-xl font-bold mb-6 text-slate-900">Express Interest</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="John" className="w-full pl-9 pr-3 py-2 border border-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full px-3 py-2 border border-slate-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" placeholder="john@company.com" className="w-full pl-9 pr-3 py-2 border border-slate-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Your company name" className="w-full pl-9 pr-3 py-2 border border-slate-200" />
                  </div>
                </div>

                <Button variant="primary" className="w-full">
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Partner Categories */}
        <div className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">Partner Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PARTNER_CATEGORIES.map((cat) => (
              <a key={cat.name} href={cat.link} className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors">
                <h3 className="font-semibold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-slate-600">{cat.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
