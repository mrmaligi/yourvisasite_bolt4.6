import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerScheduleV2() {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Schedule</h1>
          <p className="text-slate-400">Manage your availability</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-900 mb-6">Weekly Availability</h2>
          
          <div className="grid grid-cols-5 gap-4">
            {days.map((day) => (
              <div key={day} className="border border-slate-200 p-4">
                <p className="font-medium text-slate-900 text-center mb-4">{day}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">9:00 AM</span>
                    <button className="w-8 h-4 bg-blue-600"><div className="w-4 h-4 bg-white translate-x-4" /></button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">2:00 PM</span>
                    <button className="w-8 h-4 bg-blue-600"><div className="w-4 h-4 bg-white translate-x-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Consultation Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Duration</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buffer Time</label>
              <select className="w-full px-3 py-2 border border-slate-200">
                <option>No buffer</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
