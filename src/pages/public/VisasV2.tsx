import { Globe, Users, Briefcase, GraduationCap, Plane } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicVisasV2() {
  const visaCategories = [
    { id: 1, name: 'Family Visas', description: 'Partner, parent, and child visas', icon: Users, count: 8 },
    { id: 2, name: 'Skilled Visas', description: 'Work and skilled migration visas', icon: Briefcase, count: 12 },
    { id: 3, name: 'Student Visas', description: 'Study and training visas', icon: GraduationCap, count: 5 },
    { id: 4, name: 'Visitor Visas', description: 'Tourist and short stay visas', icon: Plane, count: 6 },
  ];

  const popularVisas = [
    { name: 'Partner Visa (820/801)', processingTime: '18-24 months', cost: '$8,085' },
    { name: 'Skilled Independent (189)', processingTime: '8-12 months', cost: '$4,240' },
    { name: 'Student Visa (500)', processingTime: '1-3 months', cost: '$650' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Australian Visas</h1>
          <p className="text-xl text-slate-300">Find the right visa for your journey to Australia</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visaCategories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200 p-6 hover:border-blue-400 cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <cat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{cat.description}</p>
              <p className="text-sm text-blue-600">{cat.count} visa types</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Visas</h2>
          
          <div className="divide-y divide-slate-200">
            {popularVisas.map((visa) => (
              <div key={visa.name} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{visa.name}</p>
                  <p className="text-sm text-slate-500">Processing: {visa.processingTime}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">From {visa.cost}</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
