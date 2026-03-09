import { Mic, Headphones, Play, Download, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicPodcastV2() {
  const episodes = [
    { id: 1, title: 'Partner Visa Success Stories', duration: '45 min', date: 'Mar 15, 2024', plays: 1200 },
    { id: 2, title: 'Understanding Points System', duration: '38 min', date: 'Mar 8, 2024', plays: 980 },
    { id: 3, title: 'Student Visa Tips', duration: '32 min', date: 'Mar 1, 2024', plays: 1500 },
    { id: 4, title: 'Business Migration Guide', duration: '50 min', date: 'Feb 22, 2024', plays: 750 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-blue-600 mx-auto mb-6 flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">VisaBuild Podcast</h1>
          <p className="text-xl text-slate-300">Immigration insights and expert interviews</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Latest Episodes</h2>
        
        <div className="space-y-4">
          {episodes.map((ep) => (
            <div key={ep.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 bg-blue-600 flex items-center justify-center hover:bg-blue-700">
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{ep.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{ep.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {ep.duration}</span>
                    <span>{ep.plays} plays</span>
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
