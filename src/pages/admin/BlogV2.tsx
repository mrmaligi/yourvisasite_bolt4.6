import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Eye, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'published' | 'draft';
  publishedAt: string;
}

const MOCK_POSTS: BlogPost[] = [
  { id: '1', title: 'Understanding Partner Visas', author: 'Jane Doe', category: 'Family', status: 'published', publishedAt: '2024-03-20' },
  { id: '2', title: 'Skilled Migration Changes 2024', author: 'John Smith', category: 'News', status: 'published', publishedAt: '2024-03-18' },
  { id: '3', title: 'Student Visa Guide', author: 'Jane Doe', category: 'Education', status: 'draft', publishedAt: '-' },
];

export function BlogV2() {
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
  };

  return (
    <>
      <Helmet>
        <title>Blog Posts | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                <p className="text-slate-600">Manage your blog content</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Posts', value: stats.total },
              { label: 'Published', value: stats.published, color: 'text-green-600' },
              { label: 'Drafts', value: stats.draft, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

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
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                      <td className="px-6 py-4 text-slate-700">{post.author}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs">{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{post.publishedAt}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>
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
