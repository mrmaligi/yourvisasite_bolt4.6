import { Settings, Bell, Mail, Shield, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminSettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-slate-400">Configure global platform settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">General</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                <input type="text" defaultValue="VisaBuild" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input type="email" defaultValue="support@visabuild.com" className="w-full px-3 py-2 border border-slate-200" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Email Settings</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Send welcome emails to new users</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Send appointment reminders</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
