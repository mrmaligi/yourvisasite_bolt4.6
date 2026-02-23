import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Plus, Mail, Shield, MoreVertical } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchTeam = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Jane Doe', email: 'jane@law.com', role: 'Owner', status: 'active' },
    { id: '2', name: 'John Smith', email: 'john@law.com', role: 'Associate', status: 'active' },
    { id: '3', name: 'Emily Davis', email: 'emily@law.com', role: 'Paralegal', status: 'invited' },
  ];
};

export const TeamManagement = () => {
  const { data: team, isLoading } = useQuery({
    queryKey: ['lawyer-team'],
    queryFn: fetchTeam,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Team Management</h1>
          <p className="text-neutral-500 mt-1">Manage your staff and access</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 font-medium text-neutral-500 pl-4">Name</th>
                  <th className="pb-3 font-medium text-neutral-500">Email</th>
                  <th className="pb-3 font-medium text-neutral-500">Role</th>
                  <th className="pb-3 font-medium text-neutral-500">Status</th>
                  <th className="pb-3 font-medium text-neutral-500 text-right pr-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {team?.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 pl-4 font-medium text-neutral-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                    </td>
                    <td className="py-4 text-neutral-500">{member.email}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-neutral-400" />
                        {member.role}
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
