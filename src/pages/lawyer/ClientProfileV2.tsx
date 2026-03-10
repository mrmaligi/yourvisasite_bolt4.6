import { User, Mail, Phone, MapPin, Briefcase, Star, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ClientProfileV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span>Clients</span>
            <span>/</span>
            <span className="text-white">John Doe</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">JD</span>
            </div>
            
            <div className="flex-1">
              <p className="text-2xl font-semibold text-slate-900">John Doe</p>
              <p className="text-slate-500 mb-4">Partner Visa Applicant</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">john@example.com</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">+61 412 345 678</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Sydney, NSW</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Client since Mar 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-600">Active Cases</p>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-600">Consultations</p>
            <p className="text-3xl font-bold text-slate-900">5</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-600">Total Spent</p>
            <p className="text-3xl font-bold text-slate-900">$2,500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
