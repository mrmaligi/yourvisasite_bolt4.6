import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AppointmentDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Appointments</span>
            <span>/</span>
            <span className="text-white">Consultation Details</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Partner Visa Consultation</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">J</span>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-slate-900">Jane Smith</p>
              <p className="text-slate-500">Senior Migration Lawyer</p>
            </div>
            
            <span className="ml-auto px-3 py-1 text-sm font-medium bg-green-100 text-green-700">Confirmed</span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-slate-50">
              <Calendar className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-900">March 20, 2024</p>
            </div>
            
            <div className="p-4 bg-slate-50">
              <Clock className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Time</p>
              <p className="font-medium text-slate-900">10:00 AM - 11:00 AM</p>
            </div>
            
            <div className="p-4 bg-slate-50">
              <Video className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Type</p>
              <p className="font-medium text-slate-900">Video Call</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
            <p className="text-slate-600">Client wants to discuss partner visa requirements and document preparation timeline.</p>
          </div>

          <div className="flex gap-4">
            <Button variant="primary">
              <Video className="w-4 h-4 mr-2" />
              Join Call
            </Button>
            
            <Button variant="outline">Reschedule</Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
