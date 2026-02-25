import { useEffect, useState } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/input';
import { useToast } from '../../components/ui/Toast';
import type { NewsArticle } from '../../types/database';

export function NewsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [visas, setVisas] = useState<{ id: string; name: string; subclass: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState({
    title: '',
    body: '',
    excerpt: '',
    category: 'general',
    image_url: '',
    is_published: false,
    visa_ids: [] as string[]
  });
  const [saving, setSaving] = useState(false);

  const fetchArticles = async () => {
    const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const fetchVisas = async () => {
    const { data } = await supabase
      .from('visas')
      .select('id, name, subclass')
      .eq('is_active', true)
      .order('subclass');
    setVisas(data || []);
  };

  useEffect(() => {
    fetchArticles();
    fetchVisas();
  }, []);

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      body: '',
      excerpt: '',
      category: 'general',
      image_url: '',
      is_published: false,
      visa_ids: []
    });
    setShowModal(true);
  };

  const openEdit = (a: NewsArticle) => {
    setEditing(a);
    setForm({
      title: a.title,
      body: a.body,
      excerpt: a.excerpt || '',
      category: a.category || 'general',
      image_url: a.image_url || '',
      is_published: a.is_published,
      visa_ids: a.visa_ids || []
    });
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
      published_at: form.is_published ? (editing?.published_at || new Date().toISOString()) : null,
      author_id: editing?.author_id || user.id,
      visa_ids: form.visa_ids
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
    { key: 'category', header: 'Category', render: (r) => <Badge variant="secondary">{r.category}</Badge>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.is_published ? 'success' : 'default'}>{r.is_published ? 'Published' : 'Draft'}</Badge> },
    { key: 'date', header: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => (
      <div className="flex gap-1 items-center">
        <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
        {r.is_published && (
          <a href={`/news/${r.slug}`} target="_blank" rel="noopener noreferrer" className="p-1 text-neutral-400 hover:text-primary-600 transition-colors" title="View article">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    )},
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
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea label="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">Related Visas</label>
            <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-md p-2 space-y-1 bg-white">
              {visas.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm hover:bg-neutral-50 p-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.visa_ids.includes(v.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((f) => ({ ...f, visa_ids: [...f.visa_ids, v.id] }));
                      } else {
                        setForm((f) => ({ ...f, visa_ids: f.visa_ids.filter((id) => id !== v.id) }));
                      }
                    }}
                    className="rounded border-neutral-300"
                  />
                  <Badge variant="secondary" className="w-16 justify-center">{v.subclass}</Badge>
                  <span className="text-neutral-600 truncate">{v.name}</span>
                </label>
              ))}
              {visas.length === 0 && <p className="text-sm text-neutral-400 p-2">No active visas found.</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm pt-2">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-neutral-300" />
            Publish immediately
          </label>
        </div>
      </Modal>
    </div>
  );
}
