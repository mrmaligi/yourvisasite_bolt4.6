import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Bell, Lock, Globe, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LawyerSettingsV2() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <>
      <Helmet>
        <title>Settings | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600">Manage your account preferences</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - SQUARE */}
            <div className="bg-white border border-slate-200">
              <nav className="divide-y divide-slate-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content - SQUARE */}
            <div className="lg:col-span-3 bg-white border border-slate-200 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" defaultValue="Sarah Wilson" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" defaultValue="sarah@lawyer.com" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="tel" defaultValue="+61 400 000 000" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input type="text" defaultValue="Sydney, NSW" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea rows={4} defaultValue="Experienced immigration lawyer..." className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                  
                  {[
                    { label: 'New booking requests', checked: true },
                    { label: 'Client messages', checked: true },
                    { label: 'Payment notifications', checked: true },
                    { label: 'Marketing emails', checked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-700">{item.label}</span>
                      <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none" />
                    </div>
                  </div>

                  <Button variant="primary">Update Password</Button>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">Billing Settings</h2>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-2">Current Plan</p>
                    <p className="text-xl font-bold text-slate-900">Professional</p>
                    <Badge variant="success" className="mt-2">Active</Badge>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                    <div className="flex items-center gap-3 p-3 border border-slate-200">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <span>•••• •••• •••• 4242</span>
                      <Button variant="outline" size="sm" className="ml-auto">Update</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
