import { useEffect, useState } from 'react';
import { Save, User, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function LawyerSettings() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });

  const [lawyerData, setLawyerData] = useState({
    jurisdiction: '',
    license_number: '',
    years_experience: '',
    specializations: '',
    bio: '',
    hourly_rate_cents: '',
  });

  useEffect(() => {
    if (!profile) return;

    setProfileData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      email: profile.email || '',
    });

    fetchLawyerProfile();
  }, [profile]);

  const fetchLawyerProfile = async () => {
    if (!profile) return;

    const { data } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .eq('profile_id', profile.id)
      .maybeSingle();

    if (data) {
      setLawyerData({
        jurisdiction: data.jurisdiction || '',
        license_number: data.license_number || '',
        years_experience: data.years_experience?.toString() || '',
        specializations: Array.isArray(data.specializations) ? data.specializations.join(', ') : '',
        bio: data.bio || '',
        hourly_rate_cents: data.hourly_rate_cents ? (data.hourly_rate_cents / 100).toString() : '',
      });
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.full_name,
        phone: profileData.phone,
      })
      .eq('id', profile.id);

    if (error) {
      toast('error', 'Failed to update profile');
      setSaving(false);
      return;
    }

    toast('success', 'Profile updated successfully');
    refreshProfile();
    setSaving(false);
  };

  const handleSaveLawyerProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const specializations = lawyerData.specializations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase
      .schema('lawyer')
      .from('profiles')
      .update({
        jurisdiction: lawyerData.jurisdiction,
        license_number: lawyerData.license_number,
        years_experience: lawyerData.years_experience ? parseInt(lawyerData.years_experience) : null,
        specializations,
        bio: lawyerData.bio,
        hourly_rate_cents: lawyerData.hourly_rate_cents
          ? Math.round(parseFloat(lawyerData.hourly_rate_cents) * 100)
          : null,
      })
      .eq('profile_id', profile.id);

    if (error) {
      toast('error', 'Failed to update lawyer profile');
      setSaving(false);
      return;
    }

    toast('success', 'Lawyer profile updated successfully');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-neutral-200 rounded-xl" />
          <div className="h-96 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your profile and professional information.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-900">Personal Information</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.full_name}
            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
            placeholder="Your full name"
          />

          <Input
            label="Email"
            type="email"
            value={profileData.email}
            disabled
            helperText="Email cannot be changed"
          />

          <Input
            label="Phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Personal Info
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-900">Professional Information</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Jurisdiction"
            value={lawyerData.jurisdiction}
            onChange={(e) => setLawyerData({ ...lawyerData, jurisdiction: e.target.value })}
            placeholder="e.g., Australia, United States"
          />

          <Input
            label="License Number"
            value={lawyerData.license_number}
            onChange={(e) => setLawyerData({ ...lawyerData, license_number: e.target.value })}
            placeholder="Your professional license number"
          />

          <Input
            label="Years of Experience"
            type="number"
            value={lawyerData.years_experience}
            onChange={(e) => setLawyerData({ ...lawyerData, years_experience: e.target.value })}
            placeholder="e.g., 10"
          />

          <Input
            label="Hourly Rate (USD)"
            type="number"
            value={lawyerData.hourly_rate_cents}
            onChange={(e) => setLawyerData({ ...lawyerData, hourly_rate_cents: e.target.value })}
            placeholder="e.g., 250"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Specializations
            </label>
            <input
              type="text"
              value={lawyerData.specializations}
              onChange={(e) => setLawyerData({ ...lawyerData, specializations: e.target.value })}
              placeholder="e.g., Family Immigration, Business Visas, Student Visas"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-neutral-500 mt-1">Separate multiple specializations with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
            <textarea
              value={lawyerData.bio}
              onChange={(e) => setLawyerData({ ...lawyerData, bio: e.target.value })}
              placeholder="Tell potential clients about your experience and expertise..."
              rows={5}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveLawyerProfile} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Professional Info
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
