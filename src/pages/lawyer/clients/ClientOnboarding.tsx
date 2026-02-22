import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, UserPlus, FileText, Send } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

const fetchOnboarding = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    steps: [
      { id: '1', title: 'Initial Consultation', status: 'completed' },
      { id: '2', title: 'Sign Retainer Agreement', status: 'pending' },
      { id: '3', title: 'Fill Client Intake Form', status: 'pending' },
      { id: '4', title: 'Upload ID Documents', status: 'pending' },
      { id: '5', title: 'Case Strategy Meeting', status: 'upcoming' },
    ],
  };
};

export const ClientOnboarding = () => {
  const { addToast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-client-onboarding'],
    queryFn: fetchOnboarding,
  });

  const handleSendReminder = () => {
    addToast('success', 'Reminder sent to client');
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Client Onboarding</h1>
          <p className="text-neutral-500 mt-1">Track new client progress</p>
        </div>
        <Button onClick={handleSendReminder}>
          <Send className="w-4 h-4 mr-2" />
          Send Reminder
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Onboarding Checklist</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {data?.steps.map((step) => (
                <div key={step.id} className="flex items-center gap-4 p-4 border border-neutral-100 dark:border-neutral-700 rounded-lg">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                      step.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-400'}
                  `}>
                    {step.status === 'completed' ? <Check className="w-5 h-5" /> : <UserPlus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.status === 'completed' ? 'line-through text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-neutral-500 capitalize">{step.status}</p>
                  </div>
                  {step.status === 'pending' && (
                    <Button size="sm" variant="secondary">Mark Done</Button>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Automation</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-neutral-500 mb-4">
                Configure automated emails and tasks for onboarding steps.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-sm font-medium">Welcome Email</span>
                  <div className="w-10 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <span className="text-sm font-medium">Document Chaser (3 days)</span>
                  <div className="w-10 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
