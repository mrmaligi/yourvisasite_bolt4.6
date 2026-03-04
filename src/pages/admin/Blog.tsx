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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name: string;
  category: string;
  featured_image_url: string;
  status: 'published' | 'draft' | 'scheduled';
  published_at: string;
  created_at: string;
}

export function Blog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author_name: '',
    category: 'General',
    featured_image_url: '',
    status: 'draft' as 'published' | 'draft' | 'scheduled',
  });

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast('error', 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author_name: '',
      category: 'General',
      featured_image_url: '',
      status: 'draft',
    });
    setShowModal(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author_name: post.author_name,
      category: post.category,
      featured_image_url: post.featured_image_url || '',
      status: post.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const postData = {
        ...form,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      };

      if (editing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...postData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id);
        if (error) throw error;
        toast('success', 'Post updated');
      } else {
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
        toast('success', 'Post created');
      }
      setShowModal(false);
      fetchPosts();
    } catch (error) {
      toast('error', 'Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast('success', 'Post deleted');
      fetchPosts();
    } catch (error) {
      toast('error', 'Failed to delete post');
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{row.title}</p>
          <p className="text-xs text-neutral-500">By {row.author_name}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <Badge variant="secondary">{row.category}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const colors = {
          published: 'bg-green-100 text-green-700',
          draft: 'bg-neutral-100 text-neutral-600',
          scheduled: 'bg-blue-100 text-blue-700',
        };
        return <Badge className={colors[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: 'published_at',
      header: 'Published',
      render: (row) =>
        row.published_at ? new Date(row.published_at).toLocaleDateString() : '-',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Blog Posts</h1>
          <p className="text-neutral-500 mt-1">Manage blog content</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card>
        <CardBody>
          <DataTable<BlogPost>
            columns={columns}
            data={posts}
            loading={loading}
            emptyMessage="No blog posts found"
          />
        </CardBody>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Post' : 'Create Post'}
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
          />
          <Textarea
            label="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
          />
          <Textarea
            label="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={10}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Author Name"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            />
            <Input
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <Input
            label="Featured Image URL"
            value={form.featured_image_url}
            onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as 'published' | 'draft' | 'scheduled' })
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
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
