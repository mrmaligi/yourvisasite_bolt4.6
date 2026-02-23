import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, Check, X, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchRoles = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      name: 'Owner',
      permissions: { clients: true, billing: true, settings: true, team: true },
    },
    {
      id: '2',
      name: 'Associate',
      permissions: { clients: true, billing: true, settings: false, team: false },
    },
    {
      id: '3',
      name: 'Paralegal',
      permissions: { clients: true, billing: false, settings: false, team: false },
    },
  ];
};

export const RolePermissions = () => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['lawyer-roles'],
    queryFn: fetchRoles,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-neutral-500 mt-1">Control access levels for your team</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-3 font-medium text-neutral-500 pl-4 w-48">Permission</th>
                {roles?.map((role) => (
                  <th key={role.id} className="pb-3 font-medium text-neutral-900 dark:text-white text-center">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                { key: 'clients', label: 'Manage Clients' },
                { key: 'billing', label: 'View Billing' },
                { key: 'settings', label: 'Edit Settings' },
                { key: 'team', label: 'Manage Team' },
              ].map((perm) => (
                <tr key={perm.key} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="py-4 pl-4 font-medium text-neutral-700 dark:text-neutral-300">{perm.label}</td>
                  {roles?.map((role) => (
                    <td key={role.id} className="py-4 text-center">
                      {role.permissions[perm.key as keyof typeof role.permissions] ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </motion.div>
  );
};
