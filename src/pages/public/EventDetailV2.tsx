import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function EventDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Events</span>
            <span>/</span>
            <span className="text-white">Migration Law Conference 2024</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Migration Law Conference 2024</h1>
          <p className="text-slate-400 mt-2">Annual gathering of migration professionals</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-semibold text-slate-900">Apr 15, 2024</p>
            </div>
            
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Time</p>
              <p className="font-semibold text-slate-900">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Location</p>
              <p className="font-semibold text-slate-900">Sydney Convention Centre</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Event</h2>
          
          <p className="text-slate-600 mb-6">
            Join us for the annual Migration Law Conference where industry experts, lawyers, 
            and policymakers come together to discuss the latest developments in Australian 
            migration law. This full-day event includes keynote speeches, panel discussions, 
            and networking opportunities.
          </p>

          <h3 className="font-semibold text-slate-900 mb-3">What to Expect</h3>
          
          <ul className="space-y-2 mb-8">
            {[
              'Keynote speeches from industry leaders',
              'Interactive panel discussions',
              'Latest policy updates and changes',
              'Networking lunch included',
              'CPD points for lawyers'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="primary" size="lg">Register Now</Button>
            <Button variant="outline" size="lg">Add to Calendar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
