import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Zap, Plus, ArrowRight, Play, Settings } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchAutomations = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Auto-Reply to New Leads', trigger: 'New Lead Created', action: 'Send Email', status: 'active' },
    { id: '2', name: 'Task Creation for Consultation', trigger: 'Booking Confirmed', action: 'Create Task', status: 'active' },
    { id: '3', name: 'Request Review After Case Closed', trigger: 'Case Status: Closed', action: 'Send Email (Delay 2d)', status: 'inactive' },
  ];
};

export const WorkflowAutomation = () => {
  const { data: automations, isLoading } = useQuery({
    queryKey: ['lawyer-automations'],
    queryFn: fetchAutomations,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Workflow Automation</h1>
          <p className="text-neutral-500 mt-1">Streamline repetitive tasks</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="space-y-4">
        {automations?.map((auto) => (
          <Card key={auto.id}>
            <CardBody className="flex items-center gap-6">
              <div className={`p-3 rounded-lg ${auto.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-400'}`}>
                <Zap className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{auto.name}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                    {auto.trigger}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                    {auto.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
                <button
                  className={`relative w-10 h-6 rounded-full transition-colors ${auto.status === 'active' ? 'bg-primary-600' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${auto.status === 'active' ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
