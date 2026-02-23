import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
}

const MOCK_POSTS: BlogPost[] = [
  { id: '1', title: 'Top 5 Visa Tips for 2024', author: 'Jane Doe', category: 'Guides', status: 'published', publishedAt: '2024-03-15' },
  { id: '2', title: 'Migration Policy Updates', author: 'John Smith', category: 'News', status: 'published', publishedAt: '2024-03-10' },
  { id: '3', title: 'Success Story: Partner Visa', author: 'Sarah Johnson', category: 'Success Stories', status: 'draft', publishedAt: '2024-03-25' },
];

export function Blog() {
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div>
            <p className="font-medium text-neutral-900 dark:text-white">{row.title}</p>
            <p className="text-xs text-neutral-500">By {row.author}</p>
        </div>
      ),
    },
    {
        key: 'category',
        header: 'Category',
        render: (row) => <Badge variant="secondary">{row.category}</Badge>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'published' ? 'success' : row.status === 'scheduled' ? 'info' : 'default'}>
            {row.status}
        </Badge>
      ),
    },
    {
        key: 'publishedAt',
        header: 'Date',
        render: (row) => <span className="text-neutral-500">{new Date(row.publishedAt).toLocaleDateString()}</span>
    },
    {
        key: 'actions',
        header: '',
        render: () => (
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-700">
                    <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }
  ];

  return (
    <AdminDashboardLayout>
        <Helmet>
            <title>Blog Management | VisaBuild</title>
        </Helmet>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Blog Management</h1>
                    <p className="text-neutral-600 dark:text-neutral-300">Create and edit blog posts.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                </Button>
            </div>

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={posts}
                        keyExtractor={(row) => row.id}
                        searchable
                        searchPlaceholder="Search posts..."
                        loading={loading}
                    />
                </CardBody>
            </Card>
        </div>
    </AdminDashboardLayout>
  );
}
