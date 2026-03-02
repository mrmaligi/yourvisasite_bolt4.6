import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchBillingSummary = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    outstanding: 3500,
    paidThisMonth: 12000,
    upcomingInvoices: 4,
    recentInvoices: [
      { id: 'INV-001', client: 'Alice Smith', amount: 1500, status: 'paid', date: '2023-11-20' },
      { id: 'INV-002', client: 'Bob Jones', amount: 2000, status: 'pending', date: '2023-11-25' },
      { id: 'INV-003', client: 'Charlie Brown', amount: 500, status: 'overdue', date: '2023-11-10' },
    ],
  };
};

export const Billing = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-billing-summary'],
    queryFn: fetchBillingSummary,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const statusVariant = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Billing & Invoicing</h1>
          <p className="text-neutral-500 mt-1">Manage payments and financial records</p>
        </div>
        <Link to="/lawyer/billing/invoices">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Outstanding</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">${data?.outstanding}</h2>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Paid (This Month)</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">${data?.paidThisMonth}</h2>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Upcoming Invoices</p>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{data?.upcomingInvoices}</h2>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Link to="/lawyer/billing/invoices">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-3 font-medium text-neutral-500">Invoice ID</th>
                <th className="pb-3 font-medium text-neutral-500">Client</th>
                <th className="pb-3 font-medium text-neutral-500">Date</th>
                <th className="pb-3 font-medium text-neutral-500">Amount</th>
                <th className="pb-3 font-medium text-neutral-500">Status</th>
                <th className="pb-3 font-medium text-neutral-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data?.recentInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 font-medium">{inv.id}</td>
                  <td className="py-3">{inv.client}</td>
                  <td className="py-3">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="py-3 font-medium">${inv.amount}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant[inv.status as keyof typeof statusVariant] as any}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </motion.div>
  );
};
