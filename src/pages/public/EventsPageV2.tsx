import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicEventsV2() {
  const events = [
    { id: 1, title: 'Partner Visa Workshop', date: 'Apr 15, 2024', time: '10:00 AM', location: 'Sydney', type: 'Workshop', spots: 20 },
    { id: 2, title: 'Skilled Migration Seminar', date: 'Apr 20, 2024', time: '2:00 PM', location: 'Online', type: 'Webinar', spots: 100 },
    { id: 3, title: 'Student Visa Info Session', date: 'Apr 25, 2024', time: '11:00 AM', location: 'Melbourne', type: 'Seminar', spots: 50 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-xl text-slate-300">Join our workshops, webinars, and seminars</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-100 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">{new Date(event.date).getDate()}</span>
                  <span className="text-xs text-blue-600">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                
                <div className="flex-1">
                  <span className="text-xs font-medium text-blue-600 uppercase">{event.type}</span>
                  <h3 className="font-semibold text-slate-900 text-xl">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.spots} spots left</span>
                  </div>
                </div>
                
                <Button variant="primary">
                  Register
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
