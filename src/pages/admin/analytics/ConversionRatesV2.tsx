import { Percent, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export function ConversionRatesV2() {
  const conversions = [
    { name: 'Visa to Purchase', rate: '12.5%', change: '+2.3%', up: true },
    { name: 'Lead to Consultation', rate: '28.4%', change: '+5.1%', up: true },
    { name: 'Visitor to Signup', rate: '8.2%', change: '-1.2%', up: false },
    { name: 'Trial to Premium', rate: '45.6%', change: '+3.8%', up: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Conversion Rates</h1>
          <p className="text-slate-600">Track key conversion metrics across your funnel</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {conversions.map((c) => (
            <div key={c.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">{c.name}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{c.rate}</p>
                </div>
                <div className={`flex items-center gap-1 ${c.up ? 'text-green-600' : 'text-red-600'}`}>
                  {c.up ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  <span className="font-medium">{c.change}</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-slate-100">
                <div 
                  className="h-2 bg-blue-600"
                  style={{ width: c.rate }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Optimization Tip</p>
              <p className="text-sm text-blue-700">Focus on improving your 'Visitor to Signup' rate for maximum impact.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
