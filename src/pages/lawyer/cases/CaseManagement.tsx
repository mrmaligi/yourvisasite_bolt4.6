import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle, Clock, Plus, Search } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchCases = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Partner Visa 820', client: 'Alice Smith', status: 'in_progress', dueDate: '2023-12-15', progress: 60 },
    { id: '2', title: 'Skilled Independent 189', client: 'Bob Jones', status: 'pending_review', dueDate: '2024-01-20', progress: 40 },
    { id: '3', title: 'Employer Nomination 482', client: 'Tech Corp', status: 'completed', dueDate: '2023-10-30', progress: 100 },
  ];
};

export const CaseManagement = () => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const { data: cases, isLoading } = useQuery({
    queryKey: ['lawyer-cases'],
    queryFn: fetchCases,
  });

  const statusVariant = {
    in_progress: 'info',
    pending_review: 'warning',
    completed: 'success',
    archived: 'default',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Case Management</h1>
          <p className="text-neutral-500 mt-1">Track and manage client cases</p>
        </div>
        <div className="flex gap-2">
           <Link to="/lawyer/cases/kanban">
             <Button variant="secondary">Kanban Board</Button>
           </Link>
           <Button>
             <Plus className="w-4 h-4 mr-2" />
             New Case
           </Button>
        </div>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search cases..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
              />
            </div>
            <div className="flex gap-2">
               <Button variant="secondary" className="px-3">All Status</Button>
               <Button variant="secondary" className="px-3">Due Soon</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases?.map((c) => (
              <Link to={`/lawyer/cases/${c.id}`} key={c.id}>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-primary-300 transition-colors bg-white dark:bg-neutral-800 h-full flex flex-col group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <Badge variant={statusVariant[c.status as keyof typeof statusVariant] as any}>
                      {c.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4">{c.client}</p>

                  <div className="mt-auto space-y-3">
                    <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400">
                       <span className="flex items-center gap-1">
                         <Calendar className="w-3 h-3" /> Due {new Date(c.dueDate).toLocaleDateString()}
                       </span>
                       <span>{c.progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
