import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Award,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
  ChevronDown,
  Verified,
  CheckCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

const Lawyers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'partner', name: 'Partner Visas' },
    { id: 'skilled', name: 'Skilled Visas' },
    { id: 'business', name: 'Business Visas' },
    { id: 'student', name: 'Student Visas' },
    { id: 'appeals', name: 'Visa Appeals' },
  ];

  const lawyers = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      title: 'Principal Migration Lawyer',
      firm: 'Mitchell Migration Law',
      location: 'Melbourne, VIC',
      rating: 4.9,
      reviews: 127,
      experience: '15+ years',
      hourlyRate: '$350',
      specialties: ['Partner Visas', 'Skilled Visas', 'Appeals'],
      verified: true,
      image: '/lawyers/sarah.jpg',
      bio: 'Specializing in complex partner visa cases and visa refusals. Former Department of Home Affairs decision maker.',
      languages: ['English', 'Mandarin'],
      nextAvailable: 'Tomorrow',
      consultationFee: '$150'
    },
    {
      id: 2,
      name: 'James Chen',
      title: 'Senior Migration Agent',
      firm: 'Chen Migration Services',
      location: 'Sydney, NSW',
      rating: 4.8,
      reviews: 89,
      experience: '12 years',
      hourlyRate: '$280',
      specialties: ['Business Visas', 'Investment', 'Global Talent'],
      verified: true,
      image: '/lawyers/james.jpg',
      bio: 'Expert in business and investment visas. Helped over 500 clients successfully migrate to Australia.',
      languages: ['English', 'Cantonese'],
      nextAvailable: 'Today',
      consultationFee: '$120'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      title: 'Migration Lawyer',
      firm: 'Sharma Legal',
      location: 'Brisbane, QLD',
      rating: 4.9,
      reviews: 156,
      experience: '10 years',
      hourlyRate: '$250',
      specialties: ['Student Visas', 'Graduate Visas', 'Partner Visas'],
      verified: true,
      image: '/lawyers/priya.jpg',
      bio: 'Dedicated to helping students and graduates navigate the Australian visa system. High success rate.',
      languages: ['English', 'Hindi', 'Punjabi'],
      nextAvailable: '2 days',
      consultationFee: '$100'
    },
    {
      id: 4,
      name: 'Michael Thompson',
      title: 'Principal Lawyer',
      firm: 'Thompson Immigration',
      location: 'Perth, WA',
      rating: 4.7,
      reviews: 64,
      experience: '20 years',
      hourlyRate: '$400',
      specialties: ['Employer Sponsored', 'Regional Visas', 'Appeals'],
      verified: true,
      image: '/lawyers/michael.jpg',
      bio: 'Western Australia\'s leading migration lawyer. Specializes in employer-sponsored and regional visas.',
      languages: ['English'],
      nextAvailable: '3 days',
      consultationFee: '$200'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      title: 'Senior Migration Agent',
      firm: 'Wilson Migration',
      location: 'Adelaide, SA',
      rating: 4.8,
      reviews: 92,
      experience: '8 years',
      hourlyRate: '$220',
      specialties: ['Family Visas', 'Partner Visas', 'Parent Visas'],
      verified: true,
      image: '/lawyers/emma.jpg',
      bio: 'Compassionate approach to family reunification cases. Expert in partner and parent visa applications.',
      languages: ['English', 'Italian'],
      nextAvailable: 'Tomorrow',
      consultationFee: '$90'
    },
    {
      id: 6,
      name: 'David Kim',
      title: 'Migration Lawyer',
      firm: 'Kim & Associates',
      location: 'Melbourne, VIC',
      rating: 4.9,
      reviews: 203,
      experience: '14 years',
      hourlyRate: '$320',
      specialties: ['Skilled Visas', 'Points Advice', 'Occupation Assessment'],
      verified: true,
      image: '/lawyers/david.jpg',
      bio: 'Skilled visa specialist with extensive experience in points-tested visas and skills assessments.',
      languages: ['English', 'Korean'],
      nextAvailable: 'Today',
      consultationFee: '$180'
    },
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || lawyer.specialties.some(s => s.toLowerCase().includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-0 mb-4">
              <Verified className="w-3 h-3 mr-1" />
              500+ Verified Lawyers
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Migration Expert
            </h1>
            
            <p className="text-xl text-indigo-100 mb-8">
              Connect with experienced migration lawyers and agents across Australia. 
              Get professional help with your visa application.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, firm, or location..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-xl border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">500+</p>
              <p className="text-sm text-gray-600">Verified Lawyers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">4.8</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">10K+</p>
              <p className="text-sm text-gray-600">Consultations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">98%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Specialties
                </h3>
                
                <div className="space-y-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => setSelectedSpecialty(specialty.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedSpecialty === specialty.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {specialty.name}
                    </button>
                  ))}
                </div>

                <hr className="my-6" />

                <h3 className="font-bold text-gray-900 mb-4">Why Choose Verified?n</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Licensed professionals only
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Client reviews & ratings
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Secure booking system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Money-back guarantee
                  </li>
                </ul>
              </div>
            </div>

            {/* Lawyers Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSpecialty === 'all' ? 'All Lawyers' : specialties.find(s => s.id === selectedSpecialty)?.name}
                </h2>
                <span className="text-gray-500">{filteredLawyers.length} lawyers found</span>
              </div>

              <div className="space-y-6">
                {filteredLawyers.map((lawyer) => (
                  <Card 
                    key={lawyer.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/lawyers/${lawyer.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar & Rating */}
                        <div className="flex-shrink-0 text-center md:text-left">
                          <Avatar className="w-24 h-24 mx-auto md:mx-0 mb-3">
                            <AvatarImage src={lawyer.image} alt={lawyer.name} />
                            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">
                              {lawyer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-bold">{lawyer.rating}</span>
                            <span className="text-gray-500">({lawyer.reviews})</span>
                          </div>
                          
                          {lawyer.verified && (
                            <Badge className="bg-green-100 text-green-700">
                              <Verified className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{lawyer.name}</h3>
                              <p className="text-gray-600 mb-1">{lawyer.title}</p>
                              <p className="text-indigo-600 font-medium">{lawyer.firm}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" /> {lawyer.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" /> {lawyer.experience}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{lawyer.consultationFee}</p>
                              <p className="text-sm text-gray-500">per consultation</p>
                              <Badge className="mt-2 bg-green-100 text-green-700">
                                Available {lawyer.nextAvailable}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 mt-4 line-clamp-2">{lawyer.bio}</p>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {lawyer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>Speaks: {lawyer.languages.join(', ')}</span>
                            </div>

                            <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              navigate(`/booking/${lawyer.id}`);
                            }}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Book Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lawyers;
