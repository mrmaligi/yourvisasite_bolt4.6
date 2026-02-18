import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileJson, ToggleLeft, ToggleRight, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import type { Visa, VisaCategory } from '../../types/database';

const CATEGORY_OPTIONS = [
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'student', label: 'Student' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'humanitarian', label: 'Humanitarian' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

const EMPTY_VISA = {
  subclass: '', name: '', country: 'Australia', category: 'work' as string,
  official_link: '', summary: '', processing_fee_description: '',
};

const REQUIREMENTS_TEMPLATE = JSON.stringify({
  eligibility: [
    "Example: Must be under 45 years of age",
    "Example: Must have a positive skills assessment"
  ],
  documents: {
    identity: ["Valid passport (all pages)", "Birth certificate"],
    qualifications: ["Degree certificates", "Skills assessment letter"],
    financial: ["Bank statements (3 months)", "Proof of funds"],
    character: ["Police clearance certificates"]
  },
  processing_times: {
    summary: "75% of applications processed in X months, 90% in Y months.",
    source: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times",
    last_checked: new Date().toISOString().split('T')[0]
  }
}, null, 2);

type ModalTab = 'details' | 'requirements';

export function VisaManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [filtered, setFiltered] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Visa | null>(null);
  const [form, setForm] = useState(EMPTY_VISA);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('details');
  
  // Requirements JSON editor state
  const [reqsJson, setReqsJson] = useState('');
  const [jsonValid, setJsonValid] = useState(true);
  const [jsonError, setJsonError] = useState('');
  const [reqsLoading, setReqsLoading] = useState(false);

  const fetchVisas = async () => {
    const { data } = await supabase.from('visas').select('*').order('name');
    setVisas(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVisas(); }, []);

  const fetchRequirements = useCallback(async (visaId: string) => {
    setReqsLoading(true);
    const { data } = await supabase
      .from('visa_requirements')
      .select('*')
      .eq('visa_id', visaId)
      .maybeSingle();
    
    if (data?.requirements_json) {
      setReqsJson(JSON.stringify(data.requirements_json, null, 2));
    } else {
      setReqsJson(REQUIREMENTS_TEMPLATE);
    }
    setJsonValid(true);
    setJsonError('');
    setReqsLoading(false);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_VISA);
    setReqsJson(REQUIREMENTS_TEMPLATE);
    setJsonValid(true);
    setJsonError('');
    setActiveTab('details');
    setShowModal(true);
  };

  const openEdit = (v: Visa) => {
    setEditing(v);
    setForm({
      subclass: v.subclass, name: v.name, country: v.country,
      category: v.category, official_link: v.official_link || '',
      summary: v.summary || '', processing_fee_description: v.processing_fee_description || '',
    });
    setActiveTab('details');
    setShowModal(true);
    fetchRequirements(v.id);
  };

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setJsonValid(true);
      setJsonError('');
      return true;
    } catch (e) {
      setJsonValid(false);
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
      return false;
    }
  };

  const handleJsonChange = (text: string) => {
    setReqsJson(text);
    validateJson(text);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let visaId: string;

      if (editing) {
        const { error } = await supabase.from('visas').update(form).eq('id', editing.id);
        if (error) throw error;
        visaId = editing.id;
        toast('success', 'Visa updated');
      } else {
        const { data, error } = await supabase.from('visas').insert(form).select().single();
        if (error) throw error;
        visaId = data.id;
        toast('success', 'Visa created');
      }

      // Save requirements JSON if valid
      if (reqsJson.trim() && jsonValid) {
        const parsed = JSON.parse(reqsJson);
        const { data: existing } = await supabase
          .from('visa_requirements')
          .select('id')
          .eq('visa_id', visaId)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('visa_requirements')
            .update({ requirements_json: parsed, updated_at: new Date().toISOString() })
            .eq('visa_id', visaId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('visa_requirements')
            .insert({ visa_id: visaId, requirements_json: parsed });
          if (error) throw error;
        }
        toast('success', 'Requirements saved');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      toast('error', msg);
    } finally {
      setSaving(false);
      setShowModal(false);
      fetchVisas();
    }
  };

  const handleToggleActive = async (visa: Visa) => {
    const { error } = await supabase
      .from('visas')
      .update({ is_active: !visa.is_active })
      .eq('id', visa.id);
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', `${visa.name} ${visa.is_active ? 'deactivated' : 'activated'}`);
      fetchVisas();
    }
  };

  const handleSearch = (q: string) => {
    if (!q) { setFiltered(visas); return; }
    const lower = q.toLowerCase();
    setFiltered(visas.filter((v) =>
      v.name.toLowerCase().includes(lower) ||
      v.subclass.toLowerCase().includes(lower) ||
      v.country.toLowerCase().includes(lower)
    ));
  };

  const columns: Column<Visa>[] = [
    { key: 'subclass', header: 'Subclass', render: (r) => <Badge>{r.subclass}</Badge>, sortable: true },
    { key: 'name', header: 'Name', render: (r) => (
      <div>
        <span className="font-medium text-neutral-900">{r.name}</span>
        {r.official_link && (
          <a href={r.official_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary-500 hover:text-primary-700">
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        )}
      </div>
    ), sortable: true },
    { key: 'country', header: 'Country', render: (r) => r.country, sortable: true },
    { key: 'category', header: 'Category', render: (r) => <Badge variant="primary">{r.category}</Badge> },
    { key: 'status', header: 'Active', render: (r) => (
      <button onClick={() => handleToggleActive(r)} className="flex items-center gap-1 group" title={r.is_active ? 'Click to deactivate' : 'Click to activate'}>
        {r.is_active ? (
          <ToggleRight className="w-6 h-6 text-green-600 group-hover:text-green-800" />
        ) : (
          <ToggleLeft className="w-6 h-6 text-neutral-400 group-hover:text-neutral-600" />
        )}
      </button>
    )},
    { key: 'actions', header: '', render: (r) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/premium?visa_id=${r.id}`)}>Content</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Visa Management</h1>
          <p className="text-sm text-neutral-500 mt-1">{visas.length} visas • {visas.filter(v => v.is_active).length} active</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Visa</Button>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} loading={loading} searchable onSearch={handleSearch} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? `Edit: ${editing.subclass} ${editing.name}` : 'Create Visa'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button loading={saving} disabled={activeTab === 'requirements' && !jsonValid} onClick={handleSave}>
              Save All
            </Button>
          </>
        }
      >
        {/* Tab bar */}
        <div className="flex border-b border-neutral-200 mb-4 -mt-2">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Visa Details
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'requirements'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('requirements')}
          >
            <FileJson className="w-3.5 h-3.5" />
            Requirements JSON
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Subclass Number" value={form.subclass} onChange={(e) => setForm({ ...form, subclass: e.target.value })} placeholder="e.g. 189" />
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Skilled Independent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Australia" />
              <Select label="Category" value={form.category} options={CATEGORY_OPTIONS} onChange={(e) => setForm({ ...form, category: (e.target as HTMLSelectElement).value as VisaCategory })} />
            </div>
            <Input label="Official URL" value={form.official_link} onChange={(e) => setForm({ ...form, official_link: e.target.value })} placeholder="https://immi.homeaffairs.gov.au/..." />
            <Textarea label="Summary (shown on free tier)" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} />
            <Input label="Processing Fee Description" value={form.processing_fee_description} onChange={(e) => setForm({ ...form, processing_fee_description: e.target.value })} placeholder="e.g. AUD $4,640 (principal applicant)" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Edit the requirements JSON that powers eligibility, document checklists, and processing time data on the visa detail page.
              </p>
              {jsonValid ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Valid
                </Badge>
              ) : (
                <Badge variant="danger" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Invalid
                </Badge>
              )}
            </div>

            {!jsonValid && jsonError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-mono">
                {jsonError}
              </div>
            )}

            {reqsLoading ? (
              <div className="h-64 bg-neutral-100 rounded-lg animate-pulse" />
            ) : (
              <textarea
                className={`w-full h-80 font-mono text-xs p-3 rounded-lg border ${
                  jsonValid ? 'border-neutral-300 focus:border-primary-500' : 'border-red-400 focus:border-red-600'
                } bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  jsonValid ? 'focus:ring-primary-200' : 'focus:ring-red-200'
                } resize-y`}
                value={reqsJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
              />
            )}

            <Card className="bg-neutral-50 border-neutral-200">
              <CardBody className="py-3">
                <p className="text-xs text-neutral-500 font-medium mb-2">Expected structure:</p>
                <ul className="text-xs text-neutral-500 space-y-1 list-disc list-inside">
                  <li><code className="bg-neutral-200 px-1 rounded">eligibility</code> — Array of eligibility criteria strings</li>
                  <li><code className="bg-neutral-200 px-1 rounded">documents</code> — Object with categories as keys, each an array of required doc strings</li>
                  <li><code className="bg-neutral-200 px-1 rounded">processing_times</code> — Object with <code>summary</code>, <code>source</code> URL, and <code>last_checked</code> date</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
