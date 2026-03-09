import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserProfileV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600">Manage your personal information</p>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">JD</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">John Doe</p>
              <p className="text-slate-600">Member since March 2024</p>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <input type="text" defaultValue="123 Main St, Sydney NSW 2000" className="flex-1 px-3 py-2 border border-slate-200" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
