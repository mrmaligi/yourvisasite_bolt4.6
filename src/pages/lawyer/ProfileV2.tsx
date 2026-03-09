import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerProfileV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400">Manage your profile information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-slate-900">Jane Smith</p>
              <p className="text-slate-600">Migration Lawyer</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" defaultValue="Jane" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" defaultValue="Smith" className="w-full px-3 py-2 border border-slate-200" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <input type="email" defaultValue="jane@example.com" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <input type="tel" defaultValue="+61 412 345 678" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea defaultValue="Experienced migration lawyer with over 10 years of practice..." className="w-full px-3 py-2 border border-slate-200 h-32" />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
