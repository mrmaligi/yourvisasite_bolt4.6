import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Download, Filter, Search } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

interface Payment {
  id: string;
  transactionId: string;
  client: string;
  amount: number;
  method: 'Stripe' | 'Bank Transfer' | 'PayPal';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

const fetchPayments = async (): Promise<Payment[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', transactionId: 'txn_12345', client: 'Alice Smith', amount: 1500, method: 'Stripe', status: 'completed', date: '2023-11-20' },
    { id: '2', transactionId: 'txn_67890', client: 'Bob Jones', amount: 2000, method: 'Bank Transfer', status: 'pending', date: '2023-11-25' },
    { id: '3', transactionId: 'txn_54321', client: 'Charlie Brown', amount: 500, method: 'Stripe', status: 'failed', date: '2023-11-10' },
  ];
};

export const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: payments, isLoading } = useQuery({
    queryKey: ['lawyer-payments'],
    queryFn: fetchPayments,
  });

  const filteredPayments = payments?.filter(pay =>
    pay.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusVariant = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'info',
  } as const;

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payments</h1>
          <p className="text-neutral-500 mt-1">Track incoming transactions</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by client or transaction ID..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 font-medium text-neutral-500 pl-4">Transaction ID</th>
                  <th className="pb-3 font-medium text-neutral-500">Client</th>
                  <th className="pb-3 font-medium text-neutral-500">Method</th>
                  <th className="pb-3 font-medium text-neutral-500">Date</th>
                  <th className="pb-3 font-medium text-neutral-500">Amount</th>
                  <th className="pb-3 font-medium text-neutral-500 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredPayments?.map((pay) => (
                  <tr key={pay.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 pl-4 font-mono text-neutral-500 text-xs">{pay.transactionId}</td>
                    <td className="py-4 font-medium text-neutral-900 dark:text-white">{pay.client}</td>
                    <td className="py-4 text-neutral-500 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {pay.method}
                    </td>
                    <td className="py-4 text-neutral-500">{new Date(pay.date).toLocaleDateString()}</td>
                    <td className="py-4 font-medium text-neutral-900 dark:text-white">${pay.amount.toLocaleString()}</td>
                    <td className="py-4 pr-4 text-right">
                      <Badge variant={statusVariant[pay.status] as any}>
                        {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
