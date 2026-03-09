import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerCalendarV2() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const appointments = [
    { day: 15, time: '10:00 AM', client: 'John Doe' },
    { day: 18, time: '2:00 PM', client: 'Jane Smith' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-slate-400">Manage your schedule</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-white hover:bg-slate-800"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-white font-medium">March 2024</span>
            <button className="p-2 text-white hover:bg-slate-800"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="grid grid-cols-7 border-b border-slate-200">
            {days.map((day) => (
              <div key={day} className="p-4 text-center font-medium text-slate-700">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className="h-24 border-b border-r border-slate-200 p-2">
                <span className="text-sm text-slate-700">{i + 1}</span>
                
                {i === 14 && (
                  <div className="mt-1 p-1 bg-blue-100 text-xs text-blue-700 truncate">
                    10:00 AM - John Doe
                  </div>
                )}
                
                {i === 17 && (
                  <div className="mt-1 p-1 bg-blue-100 text-xs text-blue-700 truncate">
                    2:00 PM - Jane Smith
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
