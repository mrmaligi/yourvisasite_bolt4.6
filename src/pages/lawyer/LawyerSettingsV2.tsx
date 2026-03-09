import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, User, Briefcase, Bell, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LawyerSettingsV2() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Wilson',
    phone: '+61 400 000 000',
    email: 'sarah@example.com',
  });

  const [lawyerData, setLawyerData] = useState({
    jurisdiction: 'NSW',
    barNumber: '12345',
    yearsExperience: '10',
    specializations: 'Skilled Migration, Family Visas',
    bio: 'Experienced immigration lawyer specializing in skilled migration and family visas.',
    hourlyRate: '250',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    marketingEmails: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

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
                <p className="text-slate-600">Manage your account preferences</p>
              </div>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Professional Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jurisdiction</label>
                  <input
                    type="text"
                    value={lawyerData.jurisdiction}
                    onChange={(e) => setLawyerData({...lawyerData, jurisdiction: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bar Number</label>
                  <input
                    type="text"
                    value={lawyerData.barNumber}
                    onChange={(e) => setLawyerData({...lawyerData, barNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={lawyerData.yearsExperience}
                  onChange={(e) => setLawyerData({...lawyerData, yearsExperience: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={lawyerData.hourlyRate}
                  onChange={(e) => setLawyerData({...lawyerData, hourlyRate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={lawyerData.bio}
                  onChange={(e) => setLawyerData({...lawyerData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h2>
              
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for new bookings' },
                { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive text messages for urgent updates' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content and updates' },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <label htmlFor={item.key} className="font-medium text-slate-900">{item.label}</label>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input type="password" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input type="password" className="w-full px-3 py-2 border border-slate-200" />
              </div>
              
              <Button variant="primary">Update Password</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
