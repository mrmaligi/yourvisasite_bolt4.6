import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

const MOCK_PAGES: Page[] = [
  { id: '1', title: 'About Us', slug: '/about', status: 'published', updatedAt: '2024-03-01' },
  { id: '2', title: 'Privacy Policy', slug: '/privacy', status: 'published', updatedAt: '2024-02-15' },
  { id: '3', title: 'Terms of Service', slug: '/terms', status: 'published', updatedAt: '2024-02-15' },
  { id: '4', title: 'Careers', slug: '/careers', status: 'draft', updatedAt: '2024-03-20' },
];

export function Pages() {
  const [pages] = useState<Page[]>(MOCK_PAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns: Column<Page>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div>
            <p className="font-medium text-neutral-900 dark:text-white">{row.title}</p>
            <p className="text-xs text-neutral-500">{row.slug}</p>
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
        key: 'updatedAt',
        header: 'Last Updated',
        render: (row) => <span className="text-neutral-500">{new Date(row.updatedAt).toLocaleDateString()}</span>
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
            <title>Pages | VisaBuild</title>
        </Helmet>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Pages</h1>
                    <p className="text-neutral-600 dark:text-neutral-300">Manage static pages and content.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Page
                </Button>
            </div>

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={pages}
                        keyExtractor={(row) => row.id}
                        searchable
                        searchPlaceholder="Search pages..."
                        loading={loading}
                    />
                </CardBody>
            </Card>
        </div>
    </AdminDashboardLayout>
  );
}
