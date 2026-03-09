import { Calendar, Clock, Video, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserScheduleV2() {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Schedule Appointment</h1>
          <p className="text-slate-400">Book a consultation with your lawyer</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Select Date</h2>
            
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="p-2 font-medium text-slate-500">{d}</div>
              ))}
              
              {Array.from({ length: 31 }).map((_, i) => (
                <button 
                  key={i}
                  className={`p-2 hover:bg-slate-100 ${i === 14 ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Select Time</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button 
                  key={time}
                  className="p-3 border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 mt-6">
          <h2 className="font-semibold text-slate-900 mb-4">Appointment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Type</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>Initial Consultation (30 min)</option>
                <option>Document Review (45 min)</option>
                <option>Full Case Review (60 min)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes for Lawyer</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 h-24" />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">Confirm Booking</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
