import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  MapPin, 
  Star, 
  Award,
  Briefcase,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function LawyersV2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'partner', name: 'Partner Visas' },
    { id: 'skilled', name: 'Skilled Visas' },
    { id: 'business', name: 'Business Visas' },
    { id: 'student', name: 'Student Visas' },
  ];

  const lawyers = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      title: 'Principal Migration Lawyer',
      location: 'Melbourne, VIC',
      rating: 4.9,
      reviews: 127,
      experience: '15+ years',
      hourlyRate: '$350',
      specialties: ['Partner Visas', 'Skilled Visas'],
      verified: true,
      nextAvailable: 'Tomorrow',
    },
    {
      id: 2,
      name: 'James Chen',
      title: 'Senior Migration Agent',
      location: 'Sydney, NSW',
      rating: 4.8,
      reviews: 89,
      experience: '10+ years',
      hourlyRate: '$280',
      specialties: ['Business Visas', 'Student Visas'],
      verified: true,
      nextAvailable: 'Today',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      title: 'Migration Lawyer',
      location: 'Brisbane, QLD',
      rating: 4.7,
      reviews: 56,
      experience: '8+ years',
      hourlyRate: '$250',
      specialties: ['Partner Visas', 'Appeals'],
      verified: true,
      nextAvailable: 'Next week',
    },
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            lawyer.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <>
      <Helmet>
        <title>Find a Lawyer | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Migration Lawyer</h1>
              <p className="text-slate-600">Connect with verified experts for your visa needs</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filter - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border border-slate-200 bg-white focus:border-blue-500 outline-none"
              >
                {specialties.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lawyers Grid - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white border border-slate-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{lawyer.name.charAt(0)}</span>
                    </div>
                    {lawyer.verified && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">{lawyer.name}</h3>
                  <p className="text-slate-600 text-sm">{lawyer.title}</p>

                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-slate-900">{lawyer.rating}</span>
                    <span className="text-slate-500 text-sm">({lawyer.reviews} reviews)</span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {lawyer.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-4 h-4" />
                      {lawyer.experience}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      {lawyer.hourlyRate}/hour
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {lawyer.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Available: {lawyer.nextAvailable}</span>
                      <Button variant="primary" size="sm">Book Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
