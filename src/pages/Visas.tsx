import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Users,
  Clock,
  DollarSign,
  ArrowRight,
  Bookmark,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Visas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Visas', icon: Globe },
    { id: 'partner', name: 'Partner', icon: Heart, count: 4 },
    { id: 'skilled', name: 'Skilled', icon: Briefcase, count: 6 },
    { id: 'student', name: 'Student', icon: GraduationCap, count: 3 },
    { id: 'visitor', name: 'Visitor', icon: Globe, count: 5 },
    { id: 'family', name: 'Family', icon: Users, count: 8 },
    { id: 'business', name: 'Business', icon: Briefcase, count: 4 },
  ];

  const visas = [
    {
      subclass: '820/801',
      name: 'Partner Visa',
      category: 'partner',
      description: 'For partners of Australian citizens, permanent residents, or eligible New Zealand citizens.',
      processingTime: '14-21 months',
      cost: '$4,550',
      popularity: 98,
      hasPremium: true,
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      subclass: '309/100',
      name: 'Partner Visa (Offshore)',
      category: 'partner',
      description: 'For partners outside Australia to join their partner in Australia.',
      processingTime: '21 months',
      cost: '$4,550',
      popularity: 95,
      hasPremium: true,
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      subclass: '300',
      name: 'Prospective Marriage',
      category: 'partner',
      description: 'For engaged partners to come to Australia and marry their sponsor.',
      processingTime: '21 months',
      cost: '$9,095',
      popularity: 88,
      hasPremium: true,
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      subclass: '189',
      name: 'Skilled Independent',
      category: 'skilled',
      description: 'Permanent visa for skilled workers not sponsored by an employer or family member.',
      processingTime: '6-12 months',
      cost: '$4,240',
      popularity: 96,
      hasPremium: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      subclass: '190',
      name: 'Skilled Nominated',
      category: 'skilled',
      description: 'Permanent visa for skilled workers nominated by an Australian state or territory.',
      processingTime: '8-14 months',
      cost: '$4,240',
      popularity: 94,
      hasPremium: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      subclass: '491',
      name: 'Skilled Work Regional',
      category: 'skilled',
      description: 'Provisional visa for skilled workers to live and work in regional Australia.',
      processingTime: '8-14 months',
      cost: '$4,240',
      popularity: 92,
      hasPremium: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      subclass: '500',
      name: 'Student Visa',
      category: 'student',
      description: 'Full-time study visa for international students at Australian institutions.',
      processingTime: '1-4 months',
      cost: '$650',
      popularity: 99,
      hasPremium: false,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      subclass: '485',
      name: 'Temporary Graduate',
      category: 'student',
      description: 'Work visa for international students who have recently graduated.',
      processingTime: '3-6 months',
      cost: '$1,730',
      popularity: 97,
      hasPremium: false,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      subclass: '600',
      name: 'Visitor Visa',
      category: 'visitor',
      description: 'Tourist, business visitor, or family visit visa for short stays.',
      processingTime: '20-30 days',
      cost: '$150',
      popularity: 95,
      hasPremium: false,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      subclass: '601/651',
      name: 'eVisitor / ETA',
      category: 'visitor',
      description: 'Electronic visa for short-term visits from eligible countries.',
      processingTime: '1-3 days',
      cost: 'Free / $20',
      popularity: 98,
      hasPremium: false,
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      subclass: '186',
      name: 'Employer Nomination',
      category: 'business',
      description: 'Permanent visa for skilled workers nominated by an Australian employer.',
      processingTime: '6-12 months',
      cost: '$4,240',
      popularity: 89,
      hasPremium: false,
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      subclass: '482',
      name: 'Temporary Skill Shortage',
      category: 'business',
      description: 'Work visa for skilled workers sponsored by an approved employer.',
      processingTime: '2-4 months',
      cost: '$1,330',
      popularity: 91,
      hasPremium: false,
      gradient: 'from-amber-500 to-orange-600'
    },
  ];

  const filteredVisas = visas.filter(visa => {
    const matchesSearch = visa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visa.subclass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || visa.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredVisas = visas.filter(v => v.popularity >= 95).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-0 mb-4">
              42 Visa Types Available
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Australian Visa
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive guides for all Australian visa types. Find the right visa for your situation.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by visa name or subclass..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-xl border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Visas */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Popular Visas</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredVisas.map((visa) => (
                <Card
                  key={visa.subclass}
                  className="cursor-pointer hover:shadow-xl transition-all group border-0 shadow-lg overflow-hidden"
                  onClick={() => navigate(`/visas/${visa.subclass}`)}
                >
                  <div className={`h-2 bg-gradient-to-r ${visa.gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">Subclass {visa.subclass}</Badge>
                        <h3 className="text-xl font-bold text-gray-900">{visa.name}</h3>
                      </div>
                      {visa.hasPremium && (
                        <Badge className="bg-amber-500 text-white">PREMIUM</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{visa.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {visa.processingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {visa.cost}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </h3>
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </div>
                      {category.count && (
                        <span className="text-sm text-gray-400">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visa Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Visas' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500">{filteredVisas.length} visas found</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredVisas.map((visa) => (
                  <Card
                    key={visa.subclass}
                    className="group hover:shadow-xl transition-all cursor-pointer border-0 shadow-md"
                    onClick={() => navigate(`/visas/${visa.subclass}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visa.gradient} flex items-center justify-center text-white font-bold`}>
                          {visa.subclass.split('/')[0]}
                        </div>
                        
                        <div className="flex gap-2">
                          {visa.hasPremium && (
                            <Badge className="bg-amber-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              PREMIUM
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Bookmark className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Subclass {visa.subclass}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{visa.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{visa.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" /> {visa.processingTime}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <DollarSign className="w-4 h-4" /> {visa.cost}
                          </span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredVisas.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No visas found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visas;
