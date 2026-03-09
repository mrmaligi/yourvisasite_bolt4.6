import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Eye, Plus, Trash2, PenTool } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
}

const MOCK_POSTS: BlogPost[] = [
  { id: '1', title: 'Understanding Partner Visas', slug: 'partner-visas-guide', author: 'Sarah Wilson', category: 'Guides', status: 'published', publishedAt: '2024-03-20' },
  { id: '2', title: 'Skilled Migration Changes 2024', slug: 'skilled-migration-2024', author: 'Mike Chen', category: 'News', status: 'published', publishedAt: '2024-03-18' },
  { id: '3', title: 'Document Checklist', slug: 'document-checklist', author: 'Sarah Wilson', category: 'Tips', status: 'draft', publishedAt: '-' },
];

export function BlogV2() {
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="success">Published</Badge>;
      case 'draft': return <Badge variant="warning">Draft</Badge>;
      case 'scheduled': return <Badge variant="primary">Scheduled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
                <p className="text-slate-600">Manage blog posts and articles</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Posts', value: stats.total, icon: PenTool },
              { label: 'Published', value: stats.published, icon: Eye },
              { label: 'Drafts', value: stats.draft, icon: Edit },
              { label: 'Scheduled', value: stats.scheduled, icon: Plus },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Posts Table - SQUARE */}
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Author</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Published</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{post.title}</p>
                          <p className="text-sm text-slate-500">/{post.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{post.author}</td>
                      <td className="px-6 py-4"><Badge variant="secondary">{post.category}</Badge></td>
                      <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{post.publishedAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="danger" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
