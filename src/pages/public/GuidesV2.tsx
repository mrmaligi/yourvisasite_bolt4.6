import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';

interface Guide {
  id: number;
  title: string;
  category: string;
  readTime: string;
  description: string;
}

const GUIDES: Guide[] = [
  { id: 1, title: 'Skilled Independent Visa (189) Guide', category: 'Skilled', readTime: '15 min', description: 'Complete walkthrough for points-tested skilled migration.' },
  { id: 2, title: 'Partner Visa (820/801) Application Steps', category: 'Family', readTime: '20 min', description: 'How to prove your relationship and apply for a partner visa.' },
  { id: 3, title: 'Student Visa (500) Requirements', category: 'Student', readTime: '10 min', description: 'Everything international students need to know before applying.' },
  { id: 4, title: 'Employer Nomination Scheme (186)', category: 'Employer Sponsored', readTime: '18 min', description: 'Permanent residence for skilled workers nominated by employers.' },
  { id: 5, title: 'Citizenship Application Process', category: 'Citizenship', readTime: '12 min', description: 'From permanent resident to Australian citizen.' },
  { id: 6, title: 'Bridging Visas Explained', category: 'General', readTime: '8 min', description: 'Understanding your status between visas.' },
];

const CATEGORIES = ['All', 'Skilled', 'Family', 'Student', 'Employer Sponsored', 'Citizenship', 'General'];

export function GuidesV2() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGuides = GUIDES.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Immigration Guides | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Immigration Guides</h1>
            <p className="text-slate-600 mb-8">Expert-written guides to help you understand the visa process.</p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Link key={guide.id} to="#">
                <div className="bg-white border border-slate-200 p-6 h-full hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{guide.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{guide.description}</p>

                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Read Guide
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
