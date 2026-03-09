import { Search, Filter, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicEventsV2() {
  const events = [
    { id: 1, title: 'Partner Visa Workshop', date: '2024-04-15', time: '10:00 AM', location: 'Sydney', type: 'Workshop', spots: 20 },
    { id: 2, title: 'Skilled Migration Seminar', date: '2024-04-20', time: '2:00 PM', location: 'Online', type: 'Webinar', spots: 100 },
    { id: 3, title: 'Student Visa Info Session', date: '2024-04-25', time: '11:00 AM', location: 'Melbourne', type: 'Seminar', spots: 50 },
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
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2 border border-slate-200" />
          </div>
          <select className="px-4 py-2 border border-slate-200">
            <option>All Types</option>
            <option>Workshop</option>
            <option>Webinar</option>
            <option>Seminar</option>
          </select>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-100 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{new Date(event.date).getDate()}</span>
                    <span className="text-xs text-blue-600">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase">{event.type}</span>
                    <h3 className="font-semibold text-slate-900 text-xl">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.spots} spots left</span>
                    </div>
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
