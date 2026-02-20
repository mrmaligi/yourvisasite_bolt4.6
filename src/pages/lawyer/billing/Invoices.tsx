import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Download, Send, Plus, Filter, Search } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  createdDate: string;
}

const fetchInvoices = async (): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', number: 'INV-001', client: 'Alice Smith', amount: 1500, status: 'paid', dueDate: '2023-11-20', createdDate: '2023-11-01' },
    { id: '2', number: 'INV-002', client: 'Bob Jones', amount: 2000, status: 'pending', dueDate: '2023-11-30', createdDate: '2023-11-15' },
    { id: '3', number: 'INV-003', client: 'Charlie Brown', amount: 500, status: 'overdue', dueDate: '2023-11-10', createdDate: '2023-10-25' },
    { id: '4', number: 'INV-004', client: 'David Lee', amount: 3000, status: 'draft', dueDate: '2023-12-05', createdDate: '2023-11-20' },
  ];
};

export const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['lawyer-invoices'],
    queryFn: fetchInvoices,
  });

  const filteredInvoices = invoices?.filter(inv =>
    inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusVariant = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
    draft: 'default',
  } as const;

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Invoices</h1>
          <p className="text-neutral-500 mt-1">Create and manage client invoices</p>
        </div>
        <Link to="/lawyer/billing/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 font-medium text-neutral-500 pl-4">Number</th>
                  <th className="pb-3 font-medium text-neutral-500">Client</th>
                  <th className="pb-3 font-medium text-neutral-500">Amount</th>
                  <th className="pb-3 font-medium text-neutral-500">Date Issued</th>
                  <th className="pb-3 font-medium text-neutral-500">Due Date</th>
                  <th className="pb-3 font-medium text-neutral-500">Status</th>
                  <th className="pb-3 font-medium text-neutral-500 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredInvoices?.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 pl-4 font-medium text-neutral-900 dark:text-white">{inv.number}</td>
                    <td className="py-4 font-medium">{inv.client}</td>
                    <td className="py-4">${inv.amount.toLocaleString()}</td>
                    <td className="py-4 text-neutral-500">{new Date(inv.createdDate).toLocaleDateString()}</td>
                    <td className="py-4 text-neutral-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge variant={statusVariant[inv.status] as any}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
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
