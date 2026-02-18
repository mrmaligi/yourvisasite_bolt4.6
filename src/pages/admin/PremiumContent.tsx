import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Select, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { Visa, VisaPremiumContent, DocumentCategory } from '../../types/database';

export function PremiumContent() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [docCategories, setDocCategories] = useState<DocumentCategory[]>([]);
  const [selectedVisaId, setSelectedVisaId] = useState(searchParams.get('visa_id') || '');
  const [steps, setSteps] = useState<VisaPremiumContent[]>([]);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('visas').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setVisas(data || []));

    supabase.from('document_categories').select('*').order('name')
      .then(({ data }) => setDocCategories(data || []));
  }, []);

  // Sync URL to state (handle back/forward navigation)
  useEffect(() => {
    const id = searchParams.get('visa_id') || '';
    if (id !== selectedVisaId) {
      setSelectedVisaId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedVisaId) { setSteps([]); return; }
    setLoading(true);
    setJsonDrafts({});
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
      tips: null,
      common_mistakes: null,
      examples: null,
      estimated_minutes: null,
      required_documents: null,
      application_example_json: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);
  };

  const updateStep = (idx: number, field: keyof VisaPremiumContent, value: any) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  const saveAll = async () => {
    if (!selectedVisaId) return;
    setLoading(true);

    // Delete existing content for this visa first (to handle reordering/deletions easily)
    // In a production app with user progress tracking, you might want to be more careful with IDs,
    // but here users just read the content.
    await supabase.from('visa_premium_content').delete().eq('visa_id', selectedVisaId);

    const rows = steps.map((s, i) => ({
      visa_id: selectedVisaId,
      section_number: i + 1,
      section_title: s.section_title,
      content: s.content,
      tips: s.tips || null,
      common_mistakes: s.common_mistakes || null,
      estimated_minutes: s.estimated_minutes ? Number(s.estimated_minutes) : null,
      required_documents: s.required_documents && s.required_documents.length > 0 ? s.required_documents : null,
      examples: s.examples, // Persist if present, though we might not have a UI for it yet
      application_example_json: s.application_example_json
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from('visa_premium_content').insert(rows);
      if (error) {
        toast('error', error.message);
        setLoading(false);
        return;
      }
    }

    toast('success', 'Premium content saved');
    // Refresh to get new IDs
    const { data } = await supabase.from('visa_premium_content').select('*').eq('visa_id', selectedVisaId).order('section_number');
    setSteps(data || []);
    setLoading(false);
  };

  // Helper for multi-select document categories
  const toggleDocCategory = (stepIdx: number, catKey: string) => {
    const step = steps[stepIdx];
    const current = step.required_documents || [];
    const newDocs = current.includes(catKey)
      ? current.filter(c => c !== catKey)
      : [...current, catKey];
    updateStep(stepIdx, 'required_documents', newDocs);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>

      <Select
        label="Select Visa"
        value={selectedVisaId}
        onChange={(e) => {
          const val = (e.target as HTMLSelectElement).value;
          setSelectedVisaId(val);
          setSearchParams(val ? { visa_id: val } : {});
        }}
        options={[{ value: '', label: 'Choose a visa...' }, ...visas.map((v) => ({ value: v.id, label: `${v.subclass} - ${v.name}` }))]}
      />

      {selectedVisaId && (
        <>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={step.id}>
                <CardHeader className="flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">Section {idx + 1}</span>
                  </div>
                  <button onClick={() => removeStep(idx)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Section Title"
                      value={step.section_title}
                      onChange={(e) => updateStep(idx, 'section_title', e.target.value)}
                      placeholder="e.g. Personal Details"
                    />
                    <Input
                      label="Estimated Minutes"
                      type="number"
                      value={step.estimated_minutes?.toString() || ''}
                      onChange={(e) => updateStep(idx, 'estimated_minutes', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="e.g. 15"
                    />
                  </div>

                  <Textarea
                    label="Content (Markdown)"
                    value={step.content}
                    onChange={(e) => updateStep(idx, 'content', e.target.value)}
                    rows={6}
                    placeholder="# Heading&#10;Content goes here..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Textarea
                      label="Lawyer Tips (Markdown)"
                      value={step.tips || ''}
                      onChange={(e) => updateStep(idx, 'tips', e.target.value)}
                      rows={3}
                      placeholder="💡 Tip: ..."
                    />
                    <Textarea
                      label="Common Mistakes (Markdown)"
                      value={step.common_mistakes || ''}
                      onChange={(e) => updateStep(idx, 'common_mistakes', e.target.value)}
                      rows={3}
                      placeholder="❌ Mistake: ..."
                    />
                  </div>

                  <Textarea
                    label="Application Examples (JSON: [{ field_name, field_description, example_value, tip }])"
                    value={jsonDrafts[step.id] ?? (step.application_example_json ? JSON.stringify(step.application_example_json, null, 2) : '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJsonDrafts(prev => ({ ...prev, [step.id]: val }));
                      try {
                        const parsed = JSON.parse(val);
                        updateStep(idx, 'application_example_json', parsed);
                      } catch (err) {
                        // ignore invalid json during typing
                      }
                    }}
                    rows={6}
                    placeholder={'[\n  {\n    "field_name": "Full Name",\n    "field_description": "As per passport",\n    "example_value": "JOHN DOE",\n    "tip": "Use uppercase"\n  }\n]'}
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Required Documents</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      {docCategories.map((cat) => {
                        const isSelected = (step.required_documents || []).includes(cat.key);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => toggleDocCategory(idx, cat.key)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                              isSelected
                                ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                            }`}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                      {docCategories.length === 0 && <span className="text-xs text-neutral-400">No categories found</span>}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="secondary" onClick={addStep}>
              <Plus className="w-4 h-4" /> Add Section
            </Button>
            <Button loading={loading} onClick={saveAll} disabled={steps.length === 0}>
              Save All Sections
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
