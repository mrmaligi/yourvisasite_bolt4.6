import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Zap, Mail, Clock, Plus, Pause, Play } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchWorkflows = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'New Inquiry Follow-up', status: 'active', steps: 3, enrolled: 12 },
    { id: '2', name: 'Consultation No-Show', status: 'active', steps: 2, enrolled: 3 },
    { id: '3', name: 'Post-Consultation Drip', status: 'paused', steps: 5, enrolled: 0 },
  ];
};

export const LeadNurture = () => {
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['lawyer-lead-nurture'],
    queryFn: fetchWorkflows,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Lead Nurture</h1>
          <p className="text-neutral-500 mt-1">Automate your follow-up process</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="space-y-4">
        {workflows?.map((flow) => (
          <Card key={flow.id}>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${flow.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{flow.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {flow.steps} emails</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Drip sequence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{flow.enrolled}</p>
                  <p className="text-xs text-neutral-500">Active Leads</p>
                </div>
                <Button variant="secondary" size="sm">
                  {flow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
