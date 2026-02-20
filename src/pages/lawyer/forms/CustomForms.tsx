import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FormInput, Plus, Share2, Eye } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchForms = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'New Client Intake', submissions: 45, status: 'active' },
    { id: '2', title: 'Feedback Survey', submissions: 12, status: 'active' },
    { id: '3', title: 'Incident Report', submissions: 0, status: 'draft' },
  ];
};

export const CustomForms = () => {
  const { data: forms, isLoading } = useQuery({
    queryKey: ['lawyer-forms'],
    queryFn: fetchForms,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Custom Forms</h1>
          <p className="text-neutral-500 mt-1">Collect data from clients securely</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      <div className="space-y-4">
        {forms?.map((form) => (
          <Card key={form.id}>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <FormInput className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{form.title}</h3>
                  <p className="text-sm text-neutral-500">{form.submissions} submissions</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  form.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {form.status.toUpperCase()}
                </span>
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
