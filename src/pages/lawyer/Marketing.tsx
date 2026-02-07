import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function Marketing() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [practiceAreas, setPracticeAreas] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('*')
      .eq('profile_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLawyerId(data.id);
          setBio(data.bio || '');
          setHourlyRate(data.hourly_rate_cents ? String(data.hourly_rate_cents / 100) : '');
          setPracticeAreas((data.practice_areas || []).join(', '));
        }
      });
  }, [profile]);

  const handleSave = async () => {
    if (!lawyerId) return;
    setSaving(true);
    const { error } = await supabase
      .schema('lawyer')
      .from('profiles')
      .update({
        bio,
        hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
        practice_areas: practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
      })
      .eq('id', lawyerId);
    setSaving(false);
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'Profile updated');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Marketing & Profile</h1>
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">Public Profile</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Textarea label="Professional Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell potential clients about your experience..." />
          <Input label="Practice Areas" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} helperText="Comma-separated (e.g., Work Visas, Family Visas)" />
          <Input label="Hourly Rate ($)" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
          <div className="flex justify-end">
            <Button loading={saving} onClick={handleSave}>Save Changes</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
