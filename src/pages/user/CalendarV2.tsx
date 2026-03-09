import { Calendar, Clock, Video, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserCalendarV2() {
  const events = [
    { id: 1, title: 'Consultation with Jane Smith', time: '10:00 AM', type: 'consultation', status: 'upcoming' },
    { id: 2, title: 'Document Review', time: '2:00 PM', type: 'review', status: 'upcoming' },
    { id: 3, title: 'Follow-up Call', time: '4:00 PM', type: 'call', status: 'completed' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Video className="w-4 h-4" />;
      case 'review': return <Clock className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Calendar</h1>
          <p className="text-slate-600">View your upcoming appointments</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Today's Schedule</span>
            </div>
            <Button variant="outline" size="sm">Book Appointment</Button>
          </div>

          <div className="divide-y divide-slate-200">
            {events.map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    {getIcon(event.type)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-500">{event.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
