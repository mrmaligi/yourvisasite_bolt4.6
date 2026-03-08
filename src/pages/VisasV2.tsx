import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Users,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function VisasV2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Visas', icon: Globe },
    { id: 'partner', name: 'Partner', icon: Heart },
    { id: 'skilled', name: 'Skilled', icon: Briefcase },
    { id: 'student', name: 'Student', icon: GraduationCap },
    { id: 'family', name: 'Family', icon: Users },
  ];

  const visas = [
    {
      subclass: '820/801',
      name: 'Partner Visa',
      category: 'partner',
      description: 'For partners of Australian citizens or permanent residents.',
      processingTime: '14-21 months',
      cost: '$4,550',
      popular: true,
    },
    {
      subclass: '189',
      name: 'Skilled Independent',
      category: 'skilled',
      description: 'Permanent visa for skilled workers not sponsored by employer.',
      processingTime: '6-12 months',
      cost: '$4,115',
      popular: true,
    },
    {
      subclass: '500',
      name: 'Student Visa',
      category: 'student',
      description: 'Study full-time at an Australian educational institution.',
      processingTime: '1-4 months',
      cost: '$650',
      popular: true,
    },
    {
      subclass: '600',
      name: 'Visitor Visa',
      category: 'visitor',
      description: 'Visit Australia for tourism or business purposes.',
      processingTime: '1-3 weeks',
      cost: '$145',
      popular: false,
    },
    {
      subclass: '491',
      name: 'Skilled Work Regional',
      category: 'skilled',
      description: 'Provisional visa for skilled workers in regional Australia.',
      processingTime: '6-12 months',
      cost: '$4,115',
      popular: false,
    },
    {
      subclass: '190',
      name: 'Skilled Nominated',
      category: 'skilled',
      description: 'Permanent visa nominated by an Australian state.',
      processingTime: '6-12 months',
      cost: '$4,115',
      popular: false,
    },
  ];

  const filteredVisas = visas.filter(visa => {
    const matchesSearch = visa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visa.subclass.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || visa.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Australian Visas | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Australian Visas</h1>
              <p className="text-slate-600">Find the right visa for your situation</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by visa name or subclass..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Categories - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 border text-left transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon className="w-5 h-5" />
                  <span className="font-medium">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Visas Grid - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisas.map((visa) => (
              <div key={visa.subclass} className="bg-white border border-slate-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">Subclass {visa.subclass}</Badge>
                      <h3 className="text-lg font-semibold text-slate-900">{visa.name}</h3>
                    </div>
                    {visa.popular && (
                      <Badge variant="primary">Popular</Badge>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-4">{visa.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      Processing: {visa.processingTime}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      From: {visa.cost}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
