import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { User, Bell, Shield, Mail } from 'lucide-react';
import type { NotificationPreferences } from '../../types/database';

export function UserSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

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
          if (error.code !== 'PGRST116') { // Not found
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
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update profile immediately with new avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast('success', 'Avatar updated successfully');
    } catch (error: any) {
      toast('error', error.message || 'Error uploading avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update preferences if we have them loaded
      if (preferences) {
        // Create an object without user_id to spread, or just ensure unique
        const { user_id, ...prefsToUpdate } = preferences;
        const { error: prefsError } = await supabase
          .from('notification_preferences')
          .upsert({
             user_id: user.id,
             ...prefsToUpdate,
             updated_at: new Date().toISOString()
          });

        if (prefsError) throw prefsError;
      }

      await refreshProfile();
      toast('success', 'Settings saved successfully');
    } catch (error: any) {
      toast('error', error.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    if (!preferences) return;
    setPreferences(prev => prev ? ({ ...prev, [key]: !prev[key] }) : null);
  };

  const PreferenceToggle = ({
    label,
    description,
    checked,
    onChange
  }: {
    label: string,
    description: string,
    checked: boolean,
    onChange: () => void
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-neutral-100 last:border-0">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-neutral-900">{label}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${
          checked ? 'bg-primary-600' : 'bg-neutral-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2`}
      >
        <span
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="border-b border-neutral-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-500" />
                <h2 className="font-semibold text-neutral-900">Profile Information</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border border-neutral-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Profile Picture
                    </label>
                    {/* Simplified Upload trigger */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                         <span className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                           {uploadingAvatar ? 'Uploading...' : 'Change'}
                         </span>
                         <input
                           type="file"
                           className="hidden"
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) handleAvatarUpload(file);
                           }}
                           disabled={uploadingAvatar}
                         />
                      </label>
                      {avatarUrl && (
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-700"
                          onClick={() => setAvatarUrl(null)} // Only clear local, maybe implement delete?
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+61 400 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                    <span className="ml-auto text-xs bg-neutral-200 px-2 py-0.5 rounded text-neutral-600">
                      Read-only
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader className="border-b border-neutral-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-neutral-500" />
                <h2 className="font-semibold text-neutral-900">Notification Preferences</h2>
              </div>
            </CardHeader>
            <CardBody>
              {loadingPrefs ? (
                 <div className="py-8 text-center text-neutral-500">Loading preferences...</div>
              ) : preferences ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-neutral-900 mt-2 mb-3 uppercase tracking-wider text-xs">Email Notifications</h3>
                  <PreferenceToggle
                    label="Booking Updates"
                    description="Receive confirmations and reminders for your consultations."
                    checked={preferences.email_booking_confirmation}
                    onChange={() => togglePreference('email_booking_confirmation')}
                  />
                  <PreferenceToggle
                    label="Processing Alerts"
                    description="Get notified when processing times change significantly."
                    checked={preferences.email_processing_time_alert}
                    onChange={() => togglePreference('email_processing_time_alert')}
                  />
                   <PreferenceToggle
                    label="Marketing & Offers"
                    description="Receive updates about new features and promotions."
                    checked={preferences.email_marketing}
                    onChange={() => togglePreference('email_marketing')}
                  />

                  <h3 className="text-sm font-semibold text-neutral-900 mt-6 mb-3 uppercase tracking-wider text-xs">Push Notifications</h3>
                  <PreferenceToggle
                    label="Booking Reminders"
                    description="Push notifications for upcoming appointments."
                    checked={preferences.push_booking_reminder}
                    onChange={() => togglePreference('push_booking_reminder')}
                  />
                </div>
              ) : (
                <div className="py-4 text-center text-neutral-500">
                  Unable to load preferences. Please try saving to initialize them.
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar / Save Action */}
        <div className="space-y-6">
           <Card className="sticky top-6">
             <CardBody>
               <h3 className="font-semibold text-neutral-900 mb-2">Save Changes</h3>
               <p className="text-sm text-neutral-500 mb-4">
                 Update your profile information and notification settings.
               </p>
               <Button
                 loading={saving}
                 onClick={handleSave}
                 className="w-full"
               >
                 Save Changes
               </Button>
             </CardBody>
           </Card>

           <Card className="bg-blue-50 border-blue-100">
             <CardBody className="flex gap-3">
               <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
               <div className="text-sm text-blue-800">
                 <p className="font-medium mb-1">Privacy & Security</p>
                 <p className="opacity-90">
                   Your personal information is encrypted and secure. We never share your data with third parties without your consent.
                 </p>
               </div>
             </CardBody>
           </Card>
        </div>
      </div>
    </div>
  );
}
