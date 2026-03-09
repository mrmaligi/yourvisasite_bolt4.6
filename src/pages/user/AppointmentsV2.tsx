import { User, Calendar, Clock, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserAppointmentsV2() {
  const appointments = [
    { id: 1, title: 'Consultation with Jane Smith', date: '2024-03-25', time: '10:00 AM', type: 'Video Call', status: 'upcoming' },
    { id: 2, title: 'Document Review', date: '2024-03-20', time: '2:00 PM', type: 'In Person', status: 'completed' },
    { id: 3, title: 'Initial Assessment', date: '2024-03-15', time: '11:00 AM', type: 'Phone', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
            <p className="text-slate-600">View and manage your scheduled appointments</p>
          </div>
          <Button variant="primary">Book Appointment</Button>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{apt.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      <span className="text-slate-400">•</span>
                      <span>{apt.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-medium ${
                    apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
