import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ShieldCheck, TrendingUp, Users, DollarSign, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function PortalLandingV2() {
  const [fee, setFee] = useState<number>(200);
  const platformFee = fee * 0.15;
  const takeHome = fee - platformFee;

  return (
    <>
      <Helmet>
        <title>Lawyer Portal | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-6">Grow Your Immigration Practice</h1>
              <p className="text-xl text-slate-300 mb-8">Connect with qualified clients and streamline your case management.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg">
                  Join as a Lawyer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg">Sign In</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Features - SQUARE */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, title: 'Qualified Leads', desc: 'Connect with clients actively seeking immigration help.' },
              { icon: TrendingUp, title: 'Grow Revenue', desc: 'Set your own rates and keep 85% of earnings.' },
              { icon: ShieldCheck, title: 'Verified Platform', desc: 'Build trust with verified reviews and ratings.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white border border-slate-200 p-6">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Fee Calculator - SQUARE */}
          <div className="bg-white border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Fee Calculator</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Fee: ${fee}</label>
              <input
                type="range"
                min="100"
                max="500"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Client Pays</p>
                <p className="text-2xl font-bold text-slate-900">${fee}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Platform Fee (15%)</p>
                <p className="text-2xl font-bold text-slate-900">${platformFee.toFixed(0)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-700">You Earn</p>
                <p className="text-2xl font-bold text-green-700">${takeHome.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Requirements - SQUARE */}
          <div className="mt-16 bg-blue-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-6">Requirements to Join</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Valid legal practicing certificate',
                'Immigration law experience',
                'Professional indemnity insurance',
                'Clean professional record',
              ].map((req) => (
                <div key={req} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
