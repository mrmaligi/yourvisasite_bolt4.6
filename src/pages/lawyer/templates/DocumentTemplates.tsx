import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Copy, Download, Edit } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchTemplates = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Standard Retainer Agreement', category: 'Agreements', lastEdited: '2 days ago' },
    { id: '2', name: 'Client Intake Form', category: 'Forms', lastEdited: '1 week ago' },
    { id: '3', name: 'Invoice Template - Hourly', category: 'Billing', lastEdited: '1 month ago' },
  ];
};

export const DocumentTemplates = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['lawyer-templates'],
    queryFn: fetchTemplates,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Document Templates</h1>
          <p className="text-neutral-500 mt-1">Reusable documents for your practice</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Card key={template.id} className="group cursor-pointer hover:border-primary-300 transition-colors">
            <CardBody className="flex flex-col h-48">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                  <FileText className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600" />
                </div>
                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                  {template.category}
                </span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-auto">
                {template.name}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">Last edited {template.lastEdited}</p>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="flex-1"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="flex-1"><Copy className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="flex-1"><Download className="w-4 h-4" /></Button>
              </div>
            </CardBody>
          </Card>
        ))}
        <button className="h-48 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all">
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">Create New Template</span>
        </button>
      </div>
    </motion.div>
  );
};
