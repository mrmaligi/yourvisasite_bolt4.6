import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AvailabilityV2() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Availability</h1>
          <p className="text-slate-400">Set your consultation hours</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Consultation Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
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
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {days.map((day) => (
              <div key={day} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="w-10 h-6 bg-blue-600 flex items-center">
                    <div className="w-4 h-4 bg-white mx-1 translate-x-4" />
                  </button>
                  <span className="font-medium text-slate-900">{day}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1 border border-slate-200 text-sm">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                  </select>
                  <span className="text-slate-400">to</span>
                  <select className="px-3 py-1 border border-slate-200 text-sm">
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
