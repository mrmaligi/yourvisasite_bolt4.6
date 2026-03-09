import { Search, MapPin, Star, Filter, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicLawyerDirectoryV2() {
  const lawyers = [
    { id: 1, name: 'Jane Smith', specialty: 'Partner Visas', location: 'Sydney', rating: 4.9, reviews: 127, image: 'JS' },
    { id: 2, name: 'Bob Wilson', specialty: 'Skilled Migration', location: 'Melbourne', rating: 4.8, reviews: 89, image: 'BW' },
    { id: 3, name: 'Sarah Lee', specialty: 'Student Visas', location: 'Brisbane', rating: 4.9, reviews: 156, image: 'SL' },
    { id: 4, name: 'Michael Chen', specialty: 'Business Visas', location: 'Sydney', rating: 4.7, reviews: 94, image: 'MC' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Find a Migration Lawyer</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search by name or specialty" className="w-full pl-10 pr-4 py-3" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select className="pl-10 pr-8 py-3 bg-white">
                <option>All Locations</option>
                <option>Sydney</option>
                <option>Melbourne</option>
                <option>Brisbane</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">Showing {lawyers.length} lawyers</p>
          <button className="flex items-center gap-2 text-slate-600">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-600">{lawyer.image}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{lawyer.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{lawyer.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {lawyer.location}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {lawyer.rating} ({lawyer.reviews})</span>
                  </div>
                </div>
              </div>
              
              <Button variant="primary" className="w-full mt-4">View Profile</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
