import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Select, Input, Textarea } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/Toast';
import type { Visa, VisaPremiumContent } from '../../types/database';

export function PremiumContent() {
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [selectedVisaId, setSelectedVisaId] = useState('');
  const [steps, setSteps] = useState<VisaPremiumContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('visas').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  useEffect(() => {
    if (!selectedVisaId) { setSteps([]); return; }
    setLoading(true);
    supabase.from('visa_premium_content').select('*').eq('visa_id', selectedVisaId).order('step_number')
      .then(({ data }) => { setSteps(data || []); setLoading(false); });
  }, [selectedVisaId]);

  const addStep = () => {
    const next = steps.length > 0 ? Math.max(...steps.map((s) => s.step_number)) + 1 : 1;
    setSteps([...steps, {
      id: `new-${Date.now()}`, visa_id: selectedVisaId, step_number: next,
      title: '', body: '', document_category: null, document_explanation: null,
      document_example_url: null, created_at: '', updated_at: '',
    }]);
  };

  const updateStep = (idx: number, field: string, value: string) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, [field]: value || null } : s));
  };

  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  const saveAll = async () => {
    if (!selectedVisaId) return;
    setLoading(true);

    await supabase.from('visa_premium_content').delete().eq('visa_id', selectedVisaId);

    const rows = steps.map((s, i) => ({
      visa_id: selectedVisaId,
      step_number: i + 1,
      title: s.title,
      body: s.body,
      document_category: s.document_category,
      document_explanation: s.document_explanation,
      document_example_url: s.document_example_url,
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from('visa_premium_content').insert(rows);
      if (error) { toast('error', error.message); setLoading(false); return; }
    }

    toast('success', 'Premium content saved');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>

      <Select
        label="Select Visa"
        value={selectedVisaId}
        onChange={(e) => setSelectedVisaId((e.target as HTMLSelectElement).value)}
        options={[{ value: '', label: 'Choose a visa...' }, ...visas.map((v) => ({ value: v.id, label: `${v.subclass_number} - ${v.name}` }))]}
      />

      {selectedVisaId && (
        <>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={step.id}>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">Step {idx + 1}</span>
                  </div>
                  <button onClick={() => removeStep(idx)} className="p-1 rounded hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input label="Title" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} />
                  <Textarea label="Body (Markdown)" value={step.body} onChange={(e) => updateStep(idx, 'body', e.target.value)} />
                  <Input label="Document Category" value={step.document_category || ''} onChange={(e) => updateStep(idx, 'document_category', e.target.value)} helperText="Leave empty if no document required" />
                  <Input label="Document Explanation" value={step.document_explanation || ''} onChange={(e) => updateStep(idx, 'document_explanation', e.target.value)} />
                  <Input label="Example Document URL" value={step.document_example_url || ''} onChange={(e) => updateStep(idx, 'document_example_url', e.target.value)} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={addStep}><Plus className="w-4 h-4" /> Add Step</Button>
            <Button loading={loading} onClick={saveAll}>Save All Steps</Button>
          </div>
        </>
      )}
    </div>
  );
}
