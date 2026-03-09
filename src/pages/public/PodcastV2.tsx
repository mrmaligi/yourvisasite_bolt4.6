import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mic, Play, Clock, Share2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const EPISODES = [
  { id: 1, title: 'Episode 5: Common Visa Mistakes', date: 'Oct 24', duration: '32 min', desc: 'Avoid these common errors in your application.' },
  { id: 2, title: 'Episode 4: Skilled Occupation Lists', date: 'Oct 17', duration: '45 min', desc: 'Navigating the skilled occupation lists.' },
  { id: 3, title: 'Episode 3: Regional Migration Explained', date: 'Oct 10', duration: '28 min', desc: 'Opportunities in regional Australia.' },
  { id: 4, title: 'Episode 2: Interview with a Migration Agent', date: 'Oct 03', duration: '35 min', desc: 'Insights from a registered migration agent.' },
  { id: 5, title: 'Episode 1: Visa Changes 2024', date: 'Sep 26', duration: '40 min', desc: 'Discussing the latest immigration policy updates.' },
];

export function PodcastV2() {
  const [search, setSearch] = useState('');

  const filteredEpisodes = EPISODES.filter(ep => 
    ep.title.toLowerCase().includes(search.toLowerCase()) ||
    ep.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>VisaBuild Podcast | Immigration Insights</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-100 border-b border-slate-200 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Mic className="w-20 h-20 text-white" />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">The VisaBuild Podcast</h1>
                <p className="text-lg text-slate-600 mb-6">
                  Weekly conversations with migration experts, lawyers, and successful applicants.
                </p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button variant="primary">Subscribe</Button>
                  <Button variant="outline">Latest Episode</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search episodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Episodes</h2>
          
          <div className="space-y-4">
            {filteredEpisodes.map((ep) => (
              <div key={ep.id} className="bg-white border border-slate-200 p-6 flex items-center gap-6">
                <button className="w-12 h-12 bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Play className="w-5 h-5 text-blue-600 ml-1" />
                </button>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{ep.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{ep.desc}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{ep.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {ep.duration}
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
