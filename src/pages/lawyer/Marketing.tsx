import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { FileUpload } from '../../components/ui/FileUpload';
import { Info, CheckCircle } from 'lucide-react';

export function Marketing() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [practiceAreas, setPracticeAreas] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!profile) return;

    // Fetch Lawyer Profile
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLawyerId(data.id);
          setBio(data.bio || '');
          setHourlyRate(data.hourly_rate_cents ? String(data.hourly_rate_cents / 100) : '');
          setPracticeAreas((data.practice_areas || []).join(', '));
        }
      });

    // Fetch Public Profile Details (is_featured, avatar_url)
    supabase
      .from('profiles')
      .select('is_featured, avatar_url')
      .eq('id', profile.id)
      .single()
      .then(({ data }) => {
        if (data) {
            setIsFeatured(data.is_featured || false);
            setAvatarUrl(data.avatar_url);
        }
      });
  }, [profile]);

  const handleAvatarUpload = async (file: File) => {
    if (!profile) return;
    setUploadingAvatar(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update profile immediately
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', profile.id);

        if (updateError) throw updateError;

        setAvatarUrl(publicUrl);
        toast('success', 'Profile photo updated');
    } catch (error: any) {
        toast('error', 'Failed to upload photo: ' + error.message);
    } finally {
        setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!lawyerId || !profile) return;
    setSaving(true);

    // Update Lawyer Profile
    const { error: lawyerError } = await supabase
      .schema('lawyer')
      .from('profiles')
      .update({
        bio,
        hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
        practice_areas: practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
      })
      .eq('id', lawyerId);

    // Update Public Profile (is_featured)
    const { error: publicError } = await supabase
        .from('profiles')
        .update({ is_featured: isFeatured })
        .eq('id', profile.id);

    setSaving(false);

    if (lawyerError || publicError) {
      toast('error', lawyerError?.message || publicError?.message || 'Error saving');
    } else {
      toast('success', 'Profile updated');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Marketing & Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <h2 className="font-semibold text-neutral-900">Public Profile</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                <div className="flex items-start gap-6">
                    <div className="w-32 flex-shrink-0">
                         {avatarUrl ? (
                             <img src={avatarUrl} alt="Profile" className="w-32 h-32 rounded-lg object-cover mb-2" />
                         ) : (
                             <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-2">
                                 No Photo
                             </div>
                         )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Profile Photo</label>
                        <FileUpload
                            onFileSelect={handleAvatarUpload}
                            accept=".jpg,.jpeg,.png"
                            maxSizeMb={2}
                            uploading={uploadingAvatar}
                        />
                    </div>
                </div>

                <Textarea label="Professional Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell potential clients about your experience..." rows={4} />
                <Input label="Practice Areas" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} helperText="Comma-separated (e.g., Work Visas, Family Visas)" />
                <Input label="Hourly Rate ($)" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />

                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isFeatured" className="flex-1 cursor-pointer">
                        <span className="block font-medium text-neutral-900">Enable Featured Listing</span>
                        <span className="block text-sm text-neutral-500">Boost your visibility in the lawyer directory.</span>
                    </label>
                </div>

                <div className="flex justify-end pt-2">
                    <Button loading={saving} onClick={handleSave}>Save Changes</Button>
                </div>
                </CardBody>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
                <CardBody>
                    <div className="flex items-center gap-2 mb-3 text-primary-700">
                        <Info className="w-5 h-5" />
                        <h3 className="font-semibold">SEO Tips</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-neutral-600">
                        <li className="flex gap-2">
                            <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>Use specific keywords in your bio (e.g., "Partner Visa Specialist").</span>
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>List all relevant practice areas to appear in search filters.</span>
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>A professional photo increases click-through rates by 40%.</span>
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>Keep your hourly rate competitive and transparent.</span>
                        </li>
                    </ul>
                </CardBody>
            </Card>
        </div>
      </div>
    </div>
  );
}
