import { User, Mail, Phone, MapPin, Briefcase, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserProfileV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-400">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">JD</span>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-slate-900">John Doe</p>
              <p className="text-slate-500">Premium Member</p>
            </div>
            
            <Button variant="outline" className="ml-auto">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-slate-900">john@example.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="text-slate-900">+61 412 345 678</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="text-slate-900">Sydney, Australia</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Visa Type</p>
                <p className="text-slate-900">Partner Visa (820)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Account Statistics</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">3</p>
              <p className="text-sm text-slate-500">Active Cases</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">12</p>
              <p className="text-sm text-slate-500">Consultations</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">85%</p>
              <p className="text-sm text-slate-500">Profile Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
