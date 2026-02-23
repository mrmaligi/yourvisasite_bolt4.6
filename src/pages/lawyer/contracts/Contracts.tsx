import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

interface Contract {
  id: string;
  title: string;
  client: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  lastModified: string;
}

const fetchContracts = async (): Promise<Contract[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Service Agreement - Alice Smith', client: 'Alice Smith', status: 'signed', lastModified: '2023-11-20' },
    { id: '2', title: 'Retainer Agreement', client: 'Bob Jones', status: 'sent', lastModified: '2023-11-25' },
    { id: '3', title: 'Consultation Terms', client: 'Charlie Brown', status: 'draft', lastModified: '2023-11-10' },
  ];
};

export const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['lawyer-contracts'],
    queryFn: fetchContracts,
  });

  const filteredContracts = contracts?.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusVariant = {
    draft: 'default',
    sent: 'info',
    signed: 'success',
    expired: 'danger',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Contracts</h1>
          <p className="text-neutral-500 mt-1">Manage legal agreements with clients</p>
        </div>
        <Link to="/lawyer/contracts/editor">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Contract
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
                placeholder="Search contracts..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary">All Statuses</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts?.map((contract) => (
              <div key={contract.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:border-primary-300 transition-colors bg-white dark:bg-neutral-800">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                    <FileText className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <Badge variant={statusVariant[contract.status] as any}>
                    {contract.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 truncate" title={contract.title}>
                  {contract.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">{contract.client}</p>
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                  <span>Updated {new Date(contract.lastModified).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button className="hover:text-primary-600 transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="hover:text-primary-600 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="hover:text-primary-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
