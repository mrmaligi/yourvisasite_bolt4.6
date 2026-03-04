import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

interface VisaFormData {
  name: string;
  summary: string;
  description: string;
  processing_time_range: string;
  cost_aud: string;
  key_requirements: string;
  duration: string;
  official_url: string;
}

export function AdminVisaEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<VisaFormData>({
    name: '',
    summary: '',
    description: '',
    processing_time_range: '',
    cost_aud: '',
    key_requirements: '',
    duration: '',
    official_url: ''
  });

  useEffect(() => {
    if (!id) return;
    fetchVisa();
  }, [id]);

  const fetchVisa = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast('error', 'Failed to load visa');
      setLoading(false);
      return;
    }

    setFormData({
      name: data.name || '',
      summary: data.summary || '',
      description: data.description || '',
      processing_time_range: data.processing_time_range || '',
      cost_aud: data.cost_aud || '',
      key_requirements: data.key_requirements || '',
      duration: data.duration || '',
      official_url: data.official_url || ''
    });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);

    const { error } = await supabase
      .from('visas')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast('error', 'Failed to save: ' + error.message);
    } else {
      toast('success', 'Visa updated successfully');
    }
    setSaving(false);
  };

  const handleChange = (field: keyof VisaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/visas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Visa: {formData.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Visa Information</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <Input
            label="Visa Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <Textarea
            label="Summary (Short Description)"
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            rows={3}
            placeholder="Brief summary of what this visa is for..."
          />

          <Textarea
            label="Full Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={6}
            placeholder="Detailed description including benefits, eligibility, etc..."
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Processing Time"
              value={formData.processing_time_range}
              onChange={(e) => handleChange('processing_time_range', e.target.value)}
              placeholder="e.g., 6-12 months"
            />

            <Input
              label="Cost (AUD)"
              value={formData.cost_aud}
              onChange={(e) => handleChange('cost_aud', e.target.value)}
              placeholder="e.g., $4,640"
            />
          </div>

          <Input
            label="Duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., Permanent residency"
          />

          <Textarea
            label="Key Requirements"
            value={formData.key_requirements}
            onChange={(e) => handleChange('key_requirements', e.target.value)}
            rows={4}
            placeholder="List the main requirements..."
          />

          <Input
            label="Official URL"
            value={formData.official_url}
            onChange={(e) => handleChange('official_url', e.target.value)}
            placeholder="https://immi.homeaffairs.gov.au/..."
          />

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
