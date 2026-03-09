import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings, CheckCircle, Save, Globe, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export function SystemSettingsV2() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'VisaBuild',
    siteUrl: 'https://visabuild.com',
    supportEmail: 'support@visabuild.com',
    maintenanceMode: false,
    userRegistration: true,
    lawyerRegistration: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>System Settings | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
                <p className="text-slate-600">Configure platform settings</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">General</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Email</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Features</h2>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable the site' },
                  { key: 'userRegistration', label: 'User Registration', desc: 'Allow new user signups' },
                  { key: 'lawyerRegistration', label: 'Lawyer Registration', desc: 'Allow new lawyer applications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <label htmlFor={item.key} className="font-medium text-slate-900">{item.label}</label>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">System Status: Healthy</p>
                <p className="text-sm text-green-600">All services operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
