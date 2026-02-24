import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Select, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { Visa, VisaPremiumContent } from '../../types/database';

export function PremiumContent() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [selectedVisaId, setSelectedVisaId] = useState(searchParams.get('visa_id') || '');
  const [sections, setSections] = useState<VisaPremiumContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('visas').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  // Sync URL to state (handle back/forward navigation)
  useEffect(() => {
    const id = searchParams.get('visa_id') || '';
    if (id !== selectedVisaId) {
      setSelectedVisaId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedVisaId) { setSections([]); return; }
    setLoading(true);
    supabase.from('visa_premium_content').select('*').eq('visa_id', selectedVisaId).order('section_number')
      .then(({ data }) => { setSections(data || []); setLoading(false); });
  }, [selectedVisaId]);

  const addSection = () => {
    const next = sections.length > 0 ? Math.max(...sections.map((s) => s.section_number || 0)) + 1 : 1;
    setSections([...sections, {
      id: `new-${Date.now()}`,
      visa_id: selectedVisaId,
      section_number: next,
      section_title: '',
      content: '',
      tips: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as VisaPremiumContent]);
  };

  const updateSection = (idx: number, field: keyof VisaPremiumContent, value: any) => {
    setSections(sections.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const removeSection = (idx: number) => setSections(sections.filter((_, i) => i !== idx));

  const saveAll = async () => {
    if (!selectedVisaId) return;
    setLoading(true);

    // Delete existing content for this visa first (to handle reordering/deletions easily)
    await supabase.from('visa_premium_content').delete().eq('visa_id', selectedVisaId);

    const rows = sections.map((s, i) => ({
      visa_id: selectedVisaId,
      section_number: i + 1,
      section_title: s.section_title,
      content: s.content,
      tips: s.tips
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
    setSections(data || []);
    setLoading(false);
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
            {sections.map((section, idx) => (
              <Card key={section.id}>
                <CardHeader className="flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">Section {idx + 1}</span>
                  </div>
                  <button onClick={() => removeSection(idx)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Section Title"
                    value={section.section_title || ''}
                    onChange={(e) => updateSection(idx, 'section_title', e.target.value)}
                    placeholder="e.g. Introduction"
                  />

                  <Textarea
                    label="Content (Markdown)"
                    value={section.content || ''}
                    onChange={(e) => updateSection(idx, 'content', e.target.value)}
                    rows={6}
                    placeholder="# Heading&#10;Content goes here..."
                  />

                  <Textarea
                    label="Tips (Optional)"
                    value={section.tips || ''}
                    onChange={(e) => updateSection(idx, 'tips', e.target.value)}
                    rows={3}
                    placeholder="Helpful tips for this section..."
                  />
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="secondary" onClick={addSection}>
              <Plus className="w-4 h-4" /> Add Section
            </Button>
            <Button loading={loading} onClick={saveAll} disabled={sections.length === 0}>
              Save All Sections
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
