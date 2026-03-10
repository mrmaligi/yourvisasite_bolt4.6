import { Mail, Lock, Bell, Shield, Smartphone, Key } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SettingsV2() {
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
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Password</h2>
            </div>
            
            <p className="text-slate-600 mb-4">Last changed 3 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>
            
            <div className="space-y-3">
              {['Email notifications', 'SMS alerts', 'Push notifications'].map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">Privacy</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Make profile visible to lawyers</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-slate-700">Allow marketing communications</span>
              </label>
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
