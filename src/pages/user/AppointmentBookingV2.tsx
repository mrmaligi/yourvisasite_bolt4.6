import { Calendar, Clock, MapPin, Users, CheckCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function AppointmentBookingV2() {
  const [selectedDate, setSelectedDate] = useState('Mar 20');
  const [selectedTime, setSelectedTime] = useState('');

  const dates = ['Mar 18', 'Mar 19', 'Mar 20', 'Mar 21', 'Mar 22'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
          <p className="text-slate-400">Schedule a consultation with Jane Smith</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Select Date</h2>
            
            <div className="grid grid-cols-5 gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 text-center border ${
                    selectedDate === date
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 hover:border-blue-600'
                  }`}
                >
                  <div className="text-xs text-slate-500">{date.split(' ')[0]}</div>
                  <div className="font-semibold">{date.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Select Time</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center border ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 hover:border-blue-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Appointment Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{selectedDate}, 2024</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{selectedTime || 'Select a time'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Video Call</span>
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full"
            disabled={!selectedTime}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
