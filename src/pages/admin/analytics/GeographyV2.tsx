import { Globe, MapPin, TrendingUp } from 'lucide-react';

export function GeographyV2() {
  const countries = [
    { name: 'Australia', users: '12,450', percentage: 45 },
    { name: 'India', users: '4,230', percentage: 15 },
    { name: 'United Kingdom', users: '3,120', percentage: 11 },
    { name: 'China', users: '2,890', percentage: 10 },
    { name: 'Philippines', users: '2,100', percentage: 8 },
    { name: 'Other', users: '3,210', percentage: 11 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Geography</h1>
          <p className="text-slate-600">See where your users are located</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Countries', value: '42', icon: Globe },
            { label: 'Top Country', value: 'Australia', icon: MapPin },
            { label: 'Growth', value: '+23%', icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6">
              <stat.icon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Users by Country</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {countries.map((c) => (
              <div key={c.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{c.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">{c.users}</span>
                    <span className="font-semibold text-slate-900 w-12 text-right">{c.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100">
                  <div 
                    className="h-2 bg-blue-600"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
