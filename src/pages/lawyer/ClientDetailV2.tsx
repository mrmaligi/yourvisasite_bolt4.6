import { User, FileText, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ClientDetailV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Clients</span>
            <span>/</span>
            <span className="text-white">John Doe</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white border border-slate-200 p-6">
              <div className="w-20 h-20 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">JD</span>
              </div>
              
              <p className="text-center font-semibold text-slate-900">John Doe</p>
              <p className="text-center text-sm text-slate-500">Active Client</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">john@example.com</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">+61 412 345 678</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Sydney, NSW</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button variant="outline" className="w-full">Send Message</Button>
                <Button variant="outline" className="w-full">Schedule Meeting</Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Active Cases</h2>
              
              <div className="space-y-3">
                {[
                  { id: 'C-001', type: 'Partner Visa', status: 'In Progress', date: 'Mar 15, 2024' },
                  { id: 'C-002', type: 'Visitor Visa', status: 'Submitted', date: 'Feb 28, 2024' },
                ].map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{c.type}</p>
                        <p className="text-sm text-slate-500">{c.id} • {c.date}</p>
                      </div>
                    </div>
                    
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {[
                  { action: 'Document uploaded', date: '2 days ago' },
                  { action: 'Meeting completed', date: '1 week ago' },
                  { action: 'Case created', date: '2 weeks ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{activity.action}</span>
                    <span className="text-sm text-slate-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
