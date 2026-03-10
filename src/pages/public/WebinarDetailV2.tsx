import { Play, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function WebinarDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Webinars</span>
            <span>/</span>
            <span className="text-white">Partner Visa Masterclass</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Partner Visa Masterclass</h1>
          <p className="text-slate-400">Everything you need to know about applying for a partner visa</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Duration</p>
              <p className="font-semibold text-slate-900">90 minutes</p>
            </div>
            
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Registered</p>
              <p className="font-semibold text-slate-900">234 attendees</p>
            </div>
            
            <div className="text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-500">Rating</p>
              <p className="font-semibold text-slate-900">4.9/5.0</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">What You Will Learn</h2>
          
          <ul className="space-y-3 mb-8">
            {[
              'Understanding partner visa requirements',
              'Document preparation strategies',
              'Common mistakes to avoid',
              'Timeline and processing expectations',
              'Q&A with experienced lawyers'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="primary" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Register Now
            </Button>
            
            <Button variant="outline" size="lg">Add to Calendar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
