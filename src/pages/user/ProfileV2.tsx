import { User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ProfileV2() {
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
              <p className="text-sm text-slate-400">Member since March 2024</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" defaultValue="John" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <input type="email" defaultValue="john@example.com" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <input type="tel" defaultValue="+61 412 345 678" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <input type="text" defaultValue="Sydney, NSW" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input type="date" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="primary">Save Changes</Button>
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
