import { Search, Filter, MapPin, Star, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function FindLawyerV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', firm: 'Smith Immigration Law', location: 'Sydney', rating: 4.9, reviews: 128, specialty: 'Partner Visa' },
    { id: 2, name: 'Michael Brown', firm: 'Brown Legal', location: 'Melbourne', rating: 4.8, reviews: 96, specialty: 'Skilled Migration' },
    { id: 3, name: 'Sarah Lee', firm: 'Lee & Associates', location: 'Brisbane', rating: 4.7, reviews: 84, specialty: 'Business Visa' },
    { id: 4, name: 'David Wilson', firm: 'Wilson Migration', location: 'Perth', rating: 4.9, reviews: 156, specialty: 'Student Visa' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Find a Lawyer</h1>
          <p className="text-slate-400">Connect with experienced migration lawyers</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-4 mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by name or specialty..." className="w-full pl-12 pr-4 py-3 border border-slate-200" />
          </div>
          <button className="px-6 py-3 border border-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="space-y-4">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{lawyer.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold text-slate-900">{lawyer.name}</p>
                    <p className="text-slate-500">{lawyer.firm}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {lawyer.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {lawyer.specialty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-900">{lawyer.rating}</span>
                    <span className="text-slate-500">({lawyer.reviews})</span>
                  </div>
                  
                  <Button variant="primary">View Profile</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
