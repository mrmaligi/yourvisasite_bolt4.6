import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Video, Play, Clock, Calendar, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const WEBINARS = [
  { id: 1, title: 'Skilled Migration Updates Webinar', speaker: 'John Doe, Immigration Lawyer', date: 'Oct 15, 2024', duration: '45 min', category: 'Skilled' },
  { id: 2, title: 'Partner Visa Masterclass', speaker: 'Jane Smith, Senior Agent', date: 'Sep 28, 2024', duration: '60 min', category: 'Family' },
  { id: 3, title: 'Student to PR Pathways', speaker: 'Mike Brown, Migration Expert', date: 'Sep 10, 2024', duration: '50 min', category: 'Student' },
  { id: 4, title: 'Business Innovation and Investment', speaker: 'Alice Green, Business Specialist', date: 'Aug 22, 2024', duration: '55 min', category: 'Business' },
  { id: 5, title: 'Road to Citizenship', speaker: 'Tom White, Legal Advisor', date: 'Aug 05, 2024', duration: '40 min', category: 'Citizenship' },
];

const CATEGORIES = ['All', 'Skilled', 'Family', 'Student', 'Business', 'Citizenship'];

export function WebinarsV2() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredWebinars = WEBINARS.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Immigration Webinars | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-4">Featured Session</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Mastering the Skilled Migration Points Test</h1>
                <p className="text-slate-300 mb-6">Join our expert panel as they break down every component of the points test.</p>
                
                <Button variant="primary">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </div>
              
              <div className="aspect-video bg-slate-800 flex items-center justify-center relative cursor-pointer">
                <div className="w-16 h-16 bg-white/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search webinars..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Sessions</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar) => (
              <div key={webinar.id} className="bg-white border border-slate-200 overflow-hidden">
                <div className="aspect-video bg-slate-200 flex items-center justify-center">
                  <Video className="w-12 h-12 text-slate-400" />
                </div>
                
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{webinar.category}</Badge>
                  
                  <h3 className="font-semibold text-slate-900 mb-2">{webinar.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{webinar.speaker}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {webinar.date}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {webinar.duration}
                    </span>
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
