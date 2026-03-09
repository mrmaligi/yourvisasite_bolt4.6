import { Settings, Mail, Bell, Shield, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminSettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
          <p className="text-slate-400">Configure platform settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                <input type="text" defaultValue="VisaBuild" className="w-full px-3 py-2 border border-slate-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input type="email" defaultValue="support@visabuild.com" className="w-full px-3 py-2 border border-slate-200" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Require 2FA for admins</span>
                <button className="w-10 h-6 bg-blue-600 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1 translate-x-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">Force password reset (90 days)</span>
                <button className="w-10 h-6 bg-slate-200 flex items-center">
                  <div className="w-4 h-4 bg-white mx-1" />
                </button>
              </div>
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
