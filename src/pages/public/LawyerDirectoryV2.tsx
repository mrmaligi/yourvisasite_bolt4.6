import { Award, Users, Star, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerDirectoryV2() {
  const lawyers = [
    { name: 'Jane Smith', title: 'Senior Migration Lawyer', location: 'Sydney', experience: '12 years', rating: 4.9, reviews: 124, verified: true },
    { name: 'John Doe', title: 'Immigration Consultant', location: 'Melbourne', experience: '8 years', rating: 4.7, reviews: 89, verified: true },
    { name: 'Sarah Lee', title: 'Partner Visa Specialist', location: 'Brisbane', experience: '15 years', rating: 5.0, reviews: 156, verified: true },
    { name: 'Michael Brown', title: 'Skilled Migration Expert', location: 'Perth', experience: '10 years', rating: 4.8, reviews: 98, verified: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Find a Lawyer</h1>
          <p className="text-slate-400">Connect with verified immigration professionals</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">{lawyer.name.charAt(0)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{lawyer.name}</h3>
                    {lawyer.verified && (
                      <Award className="w-4 h-4 text-blue-600" />
                    )}
                  </div>

                  <p className="text-slate-500 text-sm mb-2">{lawyer.title}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lawyer.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {lawyer.experience}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lawyer.reviews} reviews</span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium">{lawyer.rating}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm">Book Consult</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
