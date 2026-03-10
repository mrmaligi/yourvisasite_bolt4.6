import { Search, Filter, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';

export function VisaListV2() {
  const visas = [
    { name: 'Partner Visa', subclass: '820/801', category: 'Family', description: 'For partners of Australian citizens' },
    { name: 'Skilled Independent', subclass: '189', category: 'Skilled', description: 'Points-based permanent visa' },
    { name: 'Student Visa', subclass: '500', category: 'Student', description: 'For international students' },
    { name: 'Visitor Visa', subclass: '600', category: 'Visitor', description: 'For tourism and business visits' },
    { name: 'Working Holiday', subclass: '417', category: 'Work', description: 'For young travelers' },
    { name: 'Employer Nomination', subclass: '186', category: 'Skilled', description: 'Employer sponsored permanent visa' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Australian Visas</h1>
          <p className="text-slate-400">Find the right visa for your situation</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search visas..." className="w-full pl-12 pr-4 py-3 border border-slate-200" />
          </div>
          
          <button className="px-4 py-3 border border-slate-200 bg-white flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {visas.map((visa) => (
            <div key={visa.subclass} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{visa.name}</h3>
                    <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600">{visa.subclass}</span>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-2">{visa.category}</p>
                  <p className="text-slate-600">{visa.description}</p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
