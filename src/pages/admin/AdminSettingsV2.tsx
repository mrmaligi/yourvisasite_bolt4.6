import { Settings, Bell, Lock, Globe, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminSettingsV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-slate-600">Configure system-wide settings</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
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

          {/* Notifications */}
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>

            <div className="space-y-3">
              {[
                'Email notifications for new users',
                'Slack alerts for system errors',
                'Weekly summary reports',
                'New consultation bookings',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (minutes)</label>
                <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-700">Require 2FA for admin users</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
