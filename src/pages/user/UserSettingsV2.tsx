import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Bell, Shield, Mail, Camera } from 'lucide-react';
import type { NotificationPreferences } from '../../types/database';

export function UserSettingsV2() {
  const { user, profile, refreshProfile } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const fetchPrefs = async () => {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error('Error fetching preferences:', error);
          }
        } else {
          setPreferences(data);
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
      } finally {
        setLoadingPrefs(false);
      }
    };

    fetchPrefs();
  }, [user]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    try {
      setUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      refreshProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (error) throw error;
      refreshProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <>
      <Helmet>
        <title>Settings | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar - SQUARE */}
            <div className="md:col-span-1">
              <div className="bg-white border border-slate-200 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content - SQUARE */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
                    <p className="text-sm text-slate-600">Update your personal details</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-slate-200 flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                            disabled={uploadingAvatar}
                          />
                          <Button variant="outline" disabled={uploadingAvatar}>
                            <Camera className="w-4 h-4 mr-2" />
                            {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <Input
                          value={user?.email || ''}
                          disabled
                          className="bg-slate-100"
                        />
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <Button
                        variant="primary"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                    <p className="text-sm text-slate-600">Choose how you want to be notified</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {[
                      { id: 'email_updates', label: 'Product Updates', desc: 'Get notified about new features' },
                      { id: 'email_marketing', label: 'Marketing', desc: 'Receive promotional content' },
                      { id: 'booking_reminders', label: 'Booking Reminders', desc: 'Get reminded about upcoming consultations' },
                      { id: 'document_alerts', label: 'Document Alerts', desc: 'Get notified about document deadlines' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Security</h2>
                    <p className="text-sm text-slate-600">Manage your password and security settings</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Password</p>
                            <p className="text-sm text-slate-600">Last changed 3 months ago</p>
                          </div>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-600">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Not Enabled</Badge>
                      </div>
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
