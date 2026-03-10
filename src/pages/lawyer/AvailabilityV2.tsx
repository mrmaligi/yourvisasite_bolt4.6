import { Calendar, Clock, Video, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerAvailabilityV2() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Availability</h1>
          <p className="text-slate-400">Set your consultation hours</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Weekly Schedule</h2>
          
          <div className="grid grid-cols-6 gap-4">
            <div />
            {days.map((day) => (
              <div key={day} className="text-center font-medium text-slate-700">
                {day.slice(0, 3)}
              </div>
            ))}
            
            {slots.map((slot) => (
              <>
                <div key={slot} className="text-sm text-slate-600">{slot}</div>
                {days.map((day) => (
                  <button
                    key={`${day}-${slot}`}
                    className="w-full h-10 bg-green-100 hover:bg-green-200 text-green-700 text-xs"
                  >
                    Available
                  </button>
                ))}
              </>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary">Save Schedule</Button>
        </div>
      </div>
    </div>
  );
}
