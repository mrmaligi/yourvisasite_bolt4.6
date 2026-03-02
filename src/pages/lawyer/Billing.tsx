import { Helmet } from 'react-helmet-async';
import { Plus, Download } from 'lucide-react';
import { LawyerDashboardLayout } from '@/components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';

const MOCK_INVOICES = [
  { id: 'INV-001', client: 'John Doe', date: '2024-03-20', amount: '$1,500', status: 'paid' },
  { id: 'INV-002', client: 'Alice Smith', date: '2024-03-18', amount: '$2,200', status: 'pending' },
  { id: 'INV-003', client: 'Robert Brown', date: '2024-03-15', amount: '$850', status: 'overdue' },
];

export function Billing() {
  const columns = [
    { key: 'id', header: 'Invoice ID', render: (row: any) => <span className="font-medium">{row.id}</span> },
    { key: 'client', header: 'Client', render: (row: any) => row.client },
    { key: 'date', header: 'Date', render: (row: any) => row.date },
    { key: 'amount', header: 'Amount', render: (row: any) => row.amount },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={
          row.status === 'paid' ? 'success' :
          row.status === 'pending' ? 'warning' : 'danger'
        }>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="ghost" size="sm" className="px-2">
          <Download className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Billing & Invoices | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Billing</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage invoices and track payments.</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        <Card>
          <CardBody>
            <DataTable
              columns={columns}
              data={MOCK_INVOICES}
              keyExtractor={(row) => row.id}
              searchable
            />
          </CardBody>
        </Card>
      </div>
    </LawyerDashboardLayout>
  );
}
