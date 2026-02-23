import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  content: string;
  status: 'published' | 'pending' | 'hidden';
  date: string;
}

const MOCK_REVIEWS: Testimonial[] = [
  { id: '1', clientName: 'Sarah Johnson', rating: 5, content: 'Excellent service, very professional.', status: 'published', date: '2024-03-18' },
  { id: '2', clientName: 'Michael Chen', rating: 4, content: 'Good communication but slightly delayed.', status: 'pending', date: '2024-03-15' },
  { id: '3', clientName: 'Anonymous', rating: 5, content: 'Highly recommend!', status: 'published', date: '2024-03-10' },
];

export function Testimonials() {
  const [reviews] = useState<Testimonial[]>(MOCK_REVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns: Column<Testimonial>[] = [
    {
      key: 'clientName',
      header: 'Client',
      render: (row) => <span className="font-medium text-neutral-900 dark:text-white">{row.clientName}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: row.rating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
            ))}
        </div>
      ),
    },
    {
        key: 'content',
        header: 'Review',
        render: (row) => <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs">{row.content}</p>
    },
    {
        key: 'status',
        header: 'Status',
        render: (row) => (
            <Badge variant={row.status === 'published' ? 'success' : row.status === 'pending' ? 'warning' : 'default'}>
                {row.status}
            </Badge>
        )
    },
    {
        key: 'date',
        header: 'Date',
        render: (row) => <span className="text-neutral-500">{new Date(row.date).toLocaleDateString()}</span>
    },
    {
        key: 'actions',
        header: '',
        render: (row) => (
            <div className="flex justify-end gap-2">
                {row.status === 'pending' && (
                    <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <CheckCircle className="w-4 h-4" />
                    </Button>
                )}
                {row.status === 'published' && (
                     <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                        <XCircle className="w-4 h-4" />
                    </Button>
                )}
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }
  ];

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Testimonials | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Testimonials</h1>
            <p className="text-neutral-600 dark:text-neutral-300">Manage client reviews and testimonials.</p>
        </div>

        <Card>
            <CardBody>
                <DataTable
                    columns={columns}
                    data={reviews}
                    keyExtractor={(row) => row.id}
                    loading={loading}
                />
            </CardBody>
        </Card>
      </div>
    </LawyerDashboardLayout>
  );
}
