import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Filter, Search } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchLeads = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'John Smith', email: 'john@example.com', phone: '0400 000 000', status: 'new', source: 'Website', date: '2023-11-28' },
    { id: '2', name: 'Sarah Connor', email: 'sarah@example.com', phone: '0400 111 222', status: 'contacted', source: 'Referral', date: '2023-11-27' },
    { id: '3', name: 'Kyle Reese', email: 'kyle@example.com', phone: '0400 333 444', status: 'qualified', source: 'Ad Campaign', date: '2023-11-26' },
  ];
};

export const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: leads, isLoading } = useQuery({
    queryKey: ['lawyer-leads'],
    queryFn: fetchLeads,
  });

  const filteredLeads = leads?.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusVariant = {
    new: 'primary',
    contacted: 'warning',
    qualified: 'success',
    lost: 'danger',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Leads</h1>
          <p className="text-neutral-500 mt-1">Manage incoming inquiries</p>
        </div>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search leads..."
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
                  <th className="pb-3 font-medium text-neutral-500 pl-4">Name</th>
                  <th className="pb-3 font-medium text-neutral-500">Contact</th>
                  <th className="pb-3 font-medium text-neutral-500">Source</th>
                  <th className="pb-3 font-medium text-neutral-500">Date</th>
                  <th className="pb-3 font-medium text-neutral-500">Status</th>
                  <th className="pb-3 font-medium text-neutral-500 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredLeads?.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 pl-4 font-medium text-neutral-900 dark:text-white">{lead.name}</td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1 text-xs text-neutral-500">
                        <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</div>
                        <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 text-neutral-500">{lead.source}</td>
                    <td className="py-4 text-neutral-500">{new Date(lead.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge variant={statusVariant[lead.status as keyof typeof statusVariant] as any}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <Button size="sm">Contact</Button>
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
