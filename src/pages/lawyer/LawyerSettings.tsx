import { useEffect, useState } from 'react';
import { Save, User, Briefcase, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export function LawyerSettings() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lawyerId, setLawyerId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });

  const [lawyerData, setLawyerData] = useState({
    jurisdiction: '',
    bar_number: '',
    years_experience: '',
    practice_areas: '',
    bio: '',
    hourly_rate_cents: '',
  });

  const [visas, setVisas] = useState<{id: string, name: string, subclass: string}[]>([]);
  const [visaPrices, setVisaPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile) return;

    setProfileData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      email: user?.email || '',
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
      setLawyerId(data.id);
      setLawyerData({
        jurisdiction: data.jurisdiction || '',
        bar_number: data.bar_number || '',
        years_experience: data.years_experience?.toString() || '',
        practice_areas: Array.isArray(data.practice_areas) ? data.practice_areas.join(', ') : '',
        bio: data.bio || '',
        hourly_rate_cents: data.hourly_rate_cents ? (data.hourly_rate_cents / 100).toString() : '',
      });

      // Fetch Visas
      const { data: visaList } = await supabase
        .from('visas')
        .select('id, name, subclass')
        .eq('is_active', true)
        .order('name');

      setVisas(visaList || []);

      // Fetch existing visa prices
      const { data: prices } = await supabase
        .schema('lawyer')
        .from('visa_prices')
        .select('visa_id, hourly_rate_cents')
        .eq('lawyer_id', data.id);

      const priceMap: Record<string, string> = {};
      prices?.forEach(p => {
        if (p.hourly_rate_cents !== null) {
          priceMap[p.visa_id] = (p.hourly_rate_cents / 100).toString();
        }
      });
      setVisaPrices(priceMap);
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

    const practice_areas = lawyerData.practice_areas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase
      .schema('lawyer')
      .from('profiles')
      .update({
        jurisdiction: lawyerData.jurisdiction,
        bar_number: lawyerData.bar_number,
        years_experience: lawyerData.years_experience ? parseInt(lawyerData.years_experience) : null,
        practice_areas,
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

  const handleSaveVisaPrices = async () => {
    if (!lawyerId) return;
    setSaving(true);

    const updates = visas.map(visa => {
       const priceStr = visaPrices[visa.id];
       // Treat empty string as null (remove override)
       const cents = priceStr && priceStr.trim() !== '' ? Math.round(parseFloat(priceStr) * 100) : null;
       return {
          lawyer_id: lawyerId,
          visa_id: visa.id,
          hourly_rate_cents: cents
       };
    });

    const { error } = await supabase
       .schema('lawyer')
       .from('visa_prices')
       .upsert(updates, { onConflict: 'lawyer_id, visa_id' });

    if (error) {
      console.error(error);
      toast('error', 'Failed to update visa prices');
      setSaving(false);
      return;
    }

    toast('success', 'Visa prices updated successfully');
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
            value={lawyerData.bar_number}
            onChange={(e) => setLawyerData({ ...lawyerData, bar_number: e.target.value })}
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
            label="Default Hourly Rate (USD)"
            type="number"
            value={lawyerData.hourly_rate_cents}
            onChange={(e) => setLawyerData({ ...lawyerData, hourly_rate_cents: e.target.value })}
            placeholder="e.g., 250"
            helperText="This rate applies if no specific visa rate is set below."
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Specializations
            </label>
            <input
              type="text"
              value={lawyerData.practice_areas}
              onChange={(e) => setLawyerData({ ...lawyerData, practice_areas: e.target.value })}
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-neutral-900">Visa Specific Pricing</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <p className="text-sm text-neutral-500">
            Set specific hourly rates for different visa types. If left blank, your default hourly rate will apply.
          </p>

          <div className="space-y-4">
            {visas.map((visa) => (
              <div key={visa.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{visa.name}</p>
                  <p className="text-xs text-neutral-500">Subclass {visa.subclass}</p>
                </div>
                <div className="w-40">
                  <Input
                    type="number"
                    placeholder="Default"
                    value={visaPrices[visa.id] || ''}
                    onChange={(e) => setVisaPrices({ ...visaPrices, [visa.id]: e.target.value })}
                    className="h-10 text-right"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveVisaPrices} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Prices
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
