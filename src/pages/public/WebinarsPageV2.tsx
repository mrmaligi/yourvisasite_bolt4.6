import { Play, Clock, Users, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function WebinarsPageV2() {
  const webinars = [
    { title: 'Partner Visa Masterclass', date: 'Mar 25, 2024', time: '2:00 PM', attendees: 156, rating: 4.8 },
    { title: 'Skilled Migration Overview', date: 'Mar 28, 2024', time: '11:00 AM', attendees: 234, rating: 4.9 },
    { title: 'Student Visa Guide', date: 'Apr 2, 2024', time: '3:00 PM', attendees: 89, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Webinars</h1>
          <p className="text-slate-400">Learn from experts in live sessions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {webinars.map((webinar, i) => (
            <div key={i} className="bg-white border border-slate-200">
              <div className="h-40 bg-slate-200 flex items-center justify-center">
                <Play className="w-12 h-12 text-slate-400" />
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{webinar.title}</h3>
                
                <div className="space-y-1 text-sm text-slate-500 mb-4">
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {webinar.date} at {webinar.time}</p>
                  <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {webinar.attendees} registered</p>
                  <p className="flex items-center gap-2"><Star className="w-4 h-4" /> {webinar.rating} rating</p>
                </div>
                
                <Button variant="primary" className="w-full">Register</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
