import { useState, useEffect } from 'react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  status: 'published' | 'draft';
  updated_at: string;
}

export function Pages() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    status: 'draft' as 'published' | 'draft',
  });

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      toast('error', 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', content: '', meta_description: '', status: 'draft' });
    setShowModal(true);
  };

  const handleEdit = (page: Page) => {
    setEditing(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || '',
      status: page.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const { error } = await supabase
          .from('cms_pages')
          .update({
            title: form.title,
            slug: form.slug,
            content: form.content,
            meta_description: form.meta_description,
            status: form.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id);
        if (error) throw error;
        toast('success', 'Page updated');
      } else {
        const { error } = await supabase.from('cms_pages').insert({
          title: form.title,
          slug: form.slug,
          content: form.content,
          meta_description: form.meta_description,
          status: form.status,
        });
        if (error) throw error;
        toast('success', 'Page created');
      }
      setShowModal(false);
      fetchPages();
    } catch (error) {
      toast('error', 'Failed to save page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const { error } = await supabase.from('cms_pages').delete().eq('id', id);
      if (error) throw error;
      toast('success', 'Page deleted');
      fetchPages();
    } catch (error) {
      toast('error', 'Failed to delete page');
    }
  };

  const columns: Column<Page>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{row.title}</p>
          <p className="text-xs text-neutral-500">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'published' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">CMS Pages</h1>
          <p className="text-neutral-500 mt-1">Manage static pages</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <Card>
        <CardBody>
          <DataTable
            columns={columns}
            data={pages}
            loading={loading}
            emptyMessage="No pages found"
          />
        </CardBody>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Page' : 'Create Page'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            helperText="URL-friendly identifier (e.g., 'about-us')"
          />
          <Textarea
            label="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={10}
          />
          <Input
            label="Meta Description"
            value={form.meta_description}
            onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
