import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  isPremium: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'New Skilled Migration Rules Announced', summary: 'Changes to points system and occupation lists effective July 2024.', category: 'Policy', publishedAt: '2024-03-20', isPremium: false },
  { id: '2', title: 'Partner Visa Processing Times Reduced', summary: 'Average processing time drops to 12 months for subclass 820.', category: 'Processing', publishedAt: '2024-03-18', isPremium: true },
  { id: '3', title: 'Student Visa Work Rights Extended', summary: 'Post-study work rights extended for certain qualifications.', category: 'Regulation', publishedAt: '2024-03-15', isPremium: false },
];

export function LawyerNewsV2() {
  const [filter, setFilter] = useState('all');

  const filteredNews = MOCK_NEWS.filter(n => filter === 'all' || n.category.toLowerCase() === filter.toLowerCase());

  const categories = ['all', 'Policy', 'Processing', 'Regulation'];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Policy': 'bg-blue-100 text-blue-700',
      'Processing': 'bg-green-100 text-green-700',
      'Regulation': 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[category] || 'bg-slate-100 text-slate-700'}`}>
        {category}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Immigration News | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Immigration News</h1>
                <p className="text-slate-600">Latest updates for immigration professionals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-medium transition-colors ${
                  filter === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All News' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-slate-400" />
                    {getCategoryBadge(item.category)}
                    {item.isPremium && <Badge variant="primary">Premium</Badge>}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {item.publishedAt}
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h2>
                <p className="text-slate-600 mb-4">{item.summary}</p>

                <Button variant="outline" size="sm">
                  Read More
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
