import { Video, Play, Clock, Users, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicWebinarsV2() {
  const webinars = [
    { id: 1, title: 'Partner Visa Masterclass', duration: '45 min', presenter: 'Jane Smith', views: 1200 },
    { id: 2, title: 'Skilled Migration 2024', duration: '60 min', presenter: 'Bob Wilson', views: 890 },
    { id: 3, title: 'Student Visa Guide', duration: '30 min', presenter: 'Sarah Lee', views: 1500 },
  ];

  const upcoming = [
    { id: 4, title: 'Business Visa Essentials', date: 'Apr 15, 2024', time: '2:00 PM' },
    { id: 5, title: 'Document Preparation Tips', date: 'Apr 22, 2024', time: '11:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Free Webinars</h1>
          <p className="text-xl text-slate-300">Learn from immigration experts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recorded Sessions</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {webinars.map((webinar) => (
            <div key={webinar.id} className="bg-white border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-200 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-600 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1">{webinar.duration}</span>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{webinar.title}</h3>
                <p className="text-sm text-slate-500">By {webinar.presenter}</p>
                <p className="text-sm text-slate-400">{webinar.views} views</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming Live</h2>
        
        <div className="bg-white border border-slate-200">
          {upcoming.map((session) => (
            <div key={session.id} className="p-4 border-b border-slate-200 last:border-0 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{session.title}</h3>
                <p className="text-sm text-slate-500">{session.date} at {session.time}</p>
              </div>
              <Button variant="outline" size="sm">Register Free</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
