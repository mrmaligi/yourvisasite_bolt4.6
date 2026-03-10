import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ConsultationBookingV2() {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Book Consultation</h1>
          <p className="text-slate-400">Schedule time with your lawyer</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">J</span>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-slate-900">Jane Smith</p>
              <p className="text-slate-500">Senior Migration Lawyer</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Video className="w-4 h-4" />
                <span>Video Consultation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

        <div className="mt-6 flex justify-end">
          <Button variant="primary">Confirm Booking</Button>
        </div>
      </div>
    </div>
  );
}
