import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Select, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
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
    supabase.from('visa_premium_content').select('*').eq('visa_id', selectedVisaId).order('section_number')
      .then(({ data }) => { setSteps(data || []); setLoading(false); });
  }, [selectedVisaId]);

  const addStep = () => {
    const next = steps.length > 0 ? Math.max(...steps.map((s) => s.section_number)) + 1 : 1;
    setSteps([...steps, {
      id: `new-${Date.now()}`, visa_id: selectedVisaId, section_number: next,
      section_title: '', content: '', tips: '', common_mistakes: '',
      examples: '', estimated_minutes: 30, required_documents: [], created_at: '', updated_at: '',
    }]);
  };

  const updateStep = (idx: number, field: keyof VisaPremiumContent, value: any) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, [field]: value || null } : s));
  };

  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  const saveAll = async () => {
    if (!selectedVisaId) return;
    setLoading(true);

    try {
      // 1. Fetch existing steps from DB to identify what needs to be deleted
      const { data: existingSteps, error: fetchError } = await supabase
        .from('visa_premium_content')
        .select('id')
        .eq('visa_id', selectedVisaId);

      if (fetchError) throw fetchError;

      const existingIds = new Set((existingSteps || []).map(s => s.id));
      const currentIds = new Set(steps.map(s => s.id).filter(id => !id.startsWith('new-')));
      const idsToDelete = Array.from(existingIds).filter(id => !currentIds.has(id));

      // 2. Delete removed items
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('visa_premium_content')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) throw deleteError;
      }

      // 3. Upsert current items (update existing, insert new)
      const rows = steps.map((s, i) => ({
        id: s.id.startsWith('new-') ? undefined : s.id, // Undefined ID lets DB generate one for inserts
        visa_id: selectedVisaId,
        section_number: i + 1,
        section_title: s.section_title,
        content: s.content,
        tips: s.tips,
        common_mistakes: s.common_mistakes,
        examples: s.examples,
        estimated_minutes: s.estimated_minutes,
        required_documents: s.required_documents,
        updated_at: new Date().toISOString(),
      }));

      if (rows.length > 0) {
        const { error: upsertError } = await supabase
          .from('visa_premium_content')
          .upsert(rows);

        if (upsertError) throw upsertError;
      }

      toast('success', 'Premium content saved');

      // 4. Refresh data to get new IDs
      const { data: refreshedData } = await supabase
        .from('visa_premium_content')
        .select('*')
        .eq('visa_id', selectedVisaId)
        .order('section_number');

      setSteps(refreshedData || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      toast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>

      <Select
        label="Select Visa"
        value={selectedVisaId}
        onChange={(e) => setSelectedVisaId((e.target as HTMLSelectElement).value)}
        options={[{ value: '', label: 'Choose a visa...' }, ...visas.map((v) => ({ value: v.id, label: `${v.subclass} - ${v.name}` }))]}
      />

      {selectedVisaId && (
        <>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={step.id}>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">Section {idx + 1}</span>
                  </div>
                  <button onClick={() => removeStep(idx)} className="p-1 rounded hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Input label="Section Title" value={step.section_title} onChange={(e) => updateStep(idx, 'section_title', e.target.value)} />
                  <Textarea label="Content (Markdown)" value={step.content} onChange={(e) => updateStep(idx, 'content', e.target.value)} rows={6} />

                  <div className="grid sm:grid-cols-2 gap-4">
                     <Textarea label="Tips" value={step.tips || ''} onChange={(e) => updateStep(idx, 'tips', e.target.value)} placeholder="Helpful tips for this section..." />
                     <Textarea label="Common Mistakes" value={step.common_mistakes || ''} onChange={(e) => updateStep(idx, 'common_mistakes', e.target.value)} placeholder="Avoid these common errors..." />
                  </div>

                  <Textarea
                    label="Examples (JSON or Text)"
                    value={typeof step.examples === 'object' ? JSON.stringify(step.examples, null, 2) : (step.examples || '')}
                    onChange={(e) => updateStep(idx, 'examples', e.target.value)}
                    helperText="Can be plain text or valid JSON"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Estimated Minutes"
                      type="number"
                      value={step.estimated_minutes || ''}
                      onChange={(e) => updateStep(idx, 'estimated_minutes', parseInt(e.target.value) || null)}
                    />
                    <Input
                      label="Required Documents (comma separated keys)"
                      value={Array.isArray(step.required_documents) ? step.required_documents.join(', ') : ''}
                      onChange={(e) => updateStep(idx, 'required_documents', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      helperText="e.g. passport, birth_certificate"
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={addStep}><Plus className="w-4 h-4" /> Add Section</Button>
            <Button loading={loading} onClick={saveAll}>Save All Sections</Button>
          </div>
        </>
      )}
    </div>
  );
}
