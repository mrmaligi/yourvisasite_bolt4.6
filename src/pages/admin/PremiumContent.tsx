import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Select, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { Visa, VisaPremiumContent, DocumentCategory } from '../../types/database';

export function PremiumContent() {
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [docCategories, setDocCategories] = useState<DocumentCategory[]>([]);
  const [selectedVisaId, setSelectedVisaId] = useState('');
  const [steps, setSteps] = useState<VisaPremiumContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('visas').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setVisas(data || []));

    supabase.from('document_categories').select('*').order('name')
      .then(({ data }) => setDocCategories(data || []));
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
      id: `new-${Date.now()}`,
      visa_id: selectedVisaId,
      section_number: next,
      section_title: '',
      content: '',
      required_documents: [],
      tips: null,
      common_mistakes: null,
      examples: null,
      estimated_minutes: null,
      created_at: '',
      updated_at: '',
    }]);
  };

  const updateStep = (idx: number, field: keyof VisaPremiumContent, value: any) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  const toggleDocCategory = (stepIdx: number, categoryKey: string) => {
    const step = steps[stepIdx];
    const currentDocs = step.required_documents || [];
    const newDocs = currentDocs.includes(categoryKey)
      ? currentDocs.filter(d => d !== categoryKey)
      : [...currentDocs, categoryKey];
    updateStep(stepIdx, 'required_documents', newDocs);
  };

  const saveAll = async () => {
    if (!selectedVisaId) return;
    setLoading(true);

    // Delete existing content for this visa to overwrite (simple approach)
    await supabase.from('visa_premium_content').delete().eq('visa_id', selectedVisaId);

    const rows = steps.map((s, i) => ({
      visa_id: selectedVisaId,
      section_number: i + 1,
      section_title: s.section_title,
      content: s.content,
      required_documents: s.required_documents,
      tips: s.tips,
      common_mistakes: s.common_mistakes,
      estimated_minutes: s.estimated_minutes
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
                  <Input
                    label="Section Title"
                    value={step.section_title}
                    onChange={(e) => updateStep(idx, 'section_title', e.target.value)}
                  />
                  <Textarea
                    label="Content (Markdown)"
                    value={step.content}
                    onChange={(e) => updateStep(idx, 'content', e.target.value)}
                    rows={6}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Required Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {docCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => toggleDocCategory(idx, cat.key)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            (step.required_documents || []).includes(cat.key)
                              ? 'bg-primary-50 border-primary-200 text-primary-700'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Est. Minutes"
                        type="number"
                        value={step.estimated_minutes || ''}
                        onChange={(e) => updateStep(idx, 'estimated_minutes', parseInt(e.target.value) || null)}
                    />
                  </div>

                  <Textarea
                    label="Tips (Optional)"
                    value={step.tips || ''}
                    onChange={(e) => updateStep(idx, 'tips', e.target.value)}
                    rows={2}
                  />

                   <Textarea
                    label="Common Mistakes (Optional)"
                    value={step.common_mistakes || ''}
                    onChange={(e) => updateStep(idx, 'common_mistakes', e.target.value)}
                    rows={2}
                  />

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
