import { Video, Calendar, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function WebinarListV2() {
  const webinars = [
    { title: 'Partner Visa Masterclass', date: 'Mar 25, 2024', time: '7:00 PM AEST', speaker: 'Jane Smith', registered: 156 },
    { title: 'Skilled Migration 2024', date: 'Mar 28, 2024', time: '6:00 PM AEST', speaker: 'John Doe', registered: 234 },
    { title: 'Student Visa Changes', date: 'Apr 2, 2024', time: '8:00 PM AEST', speaker: 'Sarah Lee', registered: 89 },
    { title: 'Business Visa Options', date: 'Apr 5, 2024', time: '7:30 PM AEST', speaker: 'Michael Brown', registered: 112 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Upcoming Webinars</h1>
          <p className="text-slate-400">Learn from expert migration lawyers</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {webinars.map((webinar, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm">Free</span>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">{webinar.title}</h3>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {webinar.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {webinar.time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {webinar.registered} registered
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {webinar.speaker.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-600">{webinar.speaker}</span>
                </div>
                <Button variant="primary" size="sm">Register</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
