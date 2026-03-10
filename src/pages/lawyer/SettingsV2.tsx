import { Settings, Bell, Lock, Globe, Mail, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerSettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
                <input type="email" defaultValue="jane@example.com" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" defaultValue="+61 412 345 678" className="w-full px-3 py-2 border border-slate-200" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>
            
            <div className="space-y-3">
              {['Email notifications for new clients', 'SMS alerts for appointments', 'Weekly summary reports'].map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
