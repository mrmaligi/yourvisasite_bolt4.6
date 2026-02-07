import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
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
  subclass_number: '', name: '', country: '', category: 'work' as VisaCategory,
  official_url: '', summary: '', processing_fee_description: '',
};

export function VisaManagement() {
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [filtered, setFiltered] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Visa | null>(null);
  const [form, setForm] = useState(EMPTY_VISA);
  const [saving, setSaving] = useState(false);

  const fetchVisas = async () => {
    const { data } = await supabase.from('visas').select('*').order('name');
    setVisas(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVisas(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_VISA); setShowModal(true); };
  const openEdit = (v: Visa) => {
    setEditing(v);
    setForm({
      subclass_number: v.subclass_number, name: v.name, country: v.country,
      category: v.category, official_url: v.official_url || '',
      summary: v.summary || '', processing_fee_description: v.processing_fee_description || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('visas').update(form).eq('id', editing.id);
      if (error) { toast('error', error.message); setSaving(false); return; }
      toast('success', 'Visa updated');
    } else {
      const { error } = await supabase.from('visas').insert(form);
      if (error) { toast('error', error.message); setSaving(false); return; }
      toast('success', 'Visa created');
    }
    setSaving(false);
    setShowModal(false);
    fetchVisas();
  };

  const handleSearch = (q: string) => {
    if (!q) { setFiltered(visas); return; }
    const lower = q.toLowerCase();
    setFiltered(visas.filter((v) => v.name.toLowerCase().includes(lower) || v.subclass_number.toLowerCase().includes(lower)));
  };

  const columns: Column<Visa>[] = [
    { key: 'subclass', header: 'Subclass', render: (r) => <Badge>{r.subclass_number}</Badge>, sortable: true },
    { key: 'name', header: 'Name', render: (r) => r.name, sortable: true },
    { key: 'country', header: 'Country', render: (r) => r.country, sortable: true },
    { key: 'category', header: 'Category', render: (r) => <Badge variant="primary">{r.category}</Badge> },
    { key: 'status', header: 'Active', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Yes' : 'No'}</Badge> },
    { key: 'actions', header: '', render: (r) => <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Visa Management</h1>
        <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Visa</Button>
      </div>
      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} loading={loading} searchable onSearch={handleSearch} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Visa' : 'Create Visa'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Subclass Number" value={form.subclass_number} onChange={(e) => setForm({ ...form, subclass_number: e.target.value })} />
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <Select label="Category" value={form.category} options={CATEGORY_OPTIONS} onChange={(e) => setForm({ ...form, category: (e.target as HTMLSelectElement).value as VisaCategory })} />
          <Input label="Official URL" value={form.official_url} onChange={(e) => setForm({ ...form, official_url: e.target.value })} />
          <Textarea label="Summary (Free Tier)" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <Input label="Processing Fee Description" value={form.processing_fee_description} onChange={(e) => setForm({ ...form, processing_fee_description: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
