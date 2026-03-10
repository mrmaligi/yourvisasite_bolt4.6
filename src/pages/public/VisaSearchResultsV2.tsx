import { Search, Filter, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';

export function VisaSearchResultsV2() {
  const results = [
    { name: 'Partner Visa (820/801)', category: 'Family', processing: '12-18 months', cost: '$7,850', description: 'For partners of Australian citizens or permanent residents' },
    { name: 'Skilled Independent (189)', category: 'Skilled', processing: '8-12 months', cost: '$4,115', description: 'Points-based permanent residency visa' },
    { name: 'Student Visa (500)', category: 'Student', processing: '1-3 months', cost: '$650', description: 'For international students' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Search Results</h1>
          <p className="text-slate-400">Found 3 visas matching your criteria</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" defaultValue="partner visa" className="w-full pl-12 pr-4 py-3 border border-slate-200" />
          </div>
          <button className="px-6 py-3 border border-slate-200 bg-white flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="space-y-4">
          {results.map((visa) => (
            <div key={visa.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{visa.name}</h3>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm">{visa.category}</span>
                  </div>
                  
                  <p className="text-slate-600 mb-4">{visa.description}</p>
                  
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4" /> {visa.processing}</span>
                    <span className="flex items-center gap-1 text-slate-500"><DollarSign className="w-4 h-4" /> {visa.cost}</span>
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-blue-600"><ChevronRight className="w-6 h-6" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
