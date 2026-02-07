import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import type { NewsArticle } from '../../types/database';

export function NewsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState({ title: '', body: '', image_url: '', is_published: false });
  const [saving, setSaving] = useState(false);

  const fetchArticles = async () => {
    const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', body: '', image_url: '', is_published: false });
    setShowModal(true);
  };

  const openEdit = (a: NewsArticle) => {
    setEditing(a);
    setForm({ title: a.title, body: a.body, image_url: a.image_url || '', is_published: a.is_published });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const slug = slugify(form.title) + '-' + Date.now();
    const payload = {
      ...form,
      slug: editing?.slug || slug,
      image_url: form.image_url || null,
      published_at: form.is_published ? new Date().toISOString() : null,
      author_id: editing?.author_id || user.id,
    };
    if (editing) {
      const { error } = await supabase.from('news_articles').update(payload).eq('id', editing.id);
      if (error) { toast('error', error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('news_articles').insert(payload);
      if (error) { toast('error', error.message); setSaving(false); return; }
    }
    toast('success', editing ? 'Article updated' : 'Article created');
    setSaving(false);
    setShowModal(false);
    fetchArticles();
  };

  const columns: Column<NewsArticle>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_published ? 'success' : 'default'}>{r.is_published ? 'Published' : 'Draft'}</Badge> },
    { key: 'date', header: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">News Management</h1>
        <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> New Article</Button>
      </div>
      <DataTable columns={columns} data={articles} keyExtractor={(r) => r.id} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Article' : 'New Article'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-neutral-300" />
            Publish immediately
          </label>
        </div>
      </Modal>
    </div>
  );
}
