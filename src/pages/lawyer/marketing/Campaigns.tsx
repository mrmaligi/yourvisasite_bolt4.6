import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, Plus, Send, BarChart2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchCampaigns = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'November Newsletter', type: 'Email', status: 'sent', sent: 1200, openRate: '45%' },
    { id: '2', name: 'Visa Changes Alert', type: 'Email', status: 'draft', sent: 0, openRate: '-' },
    { id: '3', name: 'Google Ads - Partner Visa', type: 'Ad', status: 'active', clicks: 450, cost: '$200' },
  ];
};

export const Campaigns = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['lawyer-campaigns'],
    queryFn: fetchCampaigns,
  });

  const statusVariant = {
    sent: 'success',
    draft: 'default',
    active: 'info',
    paused: 'warning',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Campaigns</h1>
          <p className="text-neutral-500 mt-1">Manage email and ad campaigns</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns?.map((camp) => (
          <Card key={camp.id}>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <Mail className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{camp.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusVariant[camp.status as keyof typeof statusVariant] as any}>
                      {camp.status}
                    </Badge>
                    <span className="text-xs text-neutral-500">• {camp.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm">
                {camp.type === 'Email' ? (
                  <>
                    <div className="text-center">
                      <p className="font-medium">{camp.sent}</p>
                      <p className="text-neutral-500 text-xs">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">{camp.openRate}</p>
                      <p className="text-neutral-500 text-xs">Open Rate</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="font-medium">{camp.clicks}</p>
                      <p className="text-neutral-500 text-xs">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{camp.cost}</p>
                      <p className="text-neutral-500 text-xs">Cost</p>
                    </div>
                  </>
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Report</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
