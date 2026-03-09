import { Calendar, Clock, Plus, Video, Phone, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerAppointmentsV2() {
  const appointments = [
    { id: 1, client: 'John Doe', date: '2024-03-20', time: '10:00 AM', type: 'Video Call', status: 'confirmed' },
    { id: 2, client: 'Jane Smith', date: '2024-03-20', time: '2:00 PM', type: 'Phone', status: 'confirmed' },
    { id: 3, client: 'Bob Wilson', date: '2024-03-21', time: '11:00 AM', type: 'In Person', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Appointments</h1>
            <p className="text-slate-400">Manage your consultation schedule</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{apt.client}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.date} at {apt.time}</span>
                      <span>{apt.type}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 text-xs font-medium ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
