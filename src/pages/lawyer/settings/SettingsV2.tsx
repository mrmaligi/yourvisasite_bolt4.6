import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Lock, Globe, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function SettingsV2() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    twoFactorAuth: false,
    publicProfile: true,
    language: 'en',
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Settings | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600">Configure your preferences</p>
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
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive daily summaries and alerts' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser alerts for new messages' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text messages for urgent updates' },
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

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Security</h2>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <label htmlFor="twoFactorAuth" className="font-medium text-slate-900">Two-Factor Authentication</label>
                  <p className="text-sm text-slate-500">Add extra security to your account</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="publicProfile"
                    checked={settings.publicProfile}
                    onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })}
                    className="w-4 h-4 mt-5"
                  />
                  <div className="mt-4">
                    <label htmlFor="publicProfile" className="font-medium text-slate-900">Public Profile</label>
                    <p className="text-sm text-slate-500">Visible in lawyer directory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
