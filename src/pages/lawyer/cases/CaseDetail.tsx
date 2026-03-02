import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, FileText, User, MessageSquare, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useParams, Link } from 'react-router-dom';

const fetchCaseDetail = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id,
    title: 'Partner Visa 820',
    client: 'Alice Smith',
    description: 'Application for onshore Partner Visa (Subclass 820/801).',
    status: 'In Progress',
    dueDate: '2023-12-15',
    stages: [
      { id: '1', title: 'Initial Assessment', status: 'completed' },
      { id: '2', title: 'Document Collection', status: 'in_progress' },
      { id: '3', title: 'Application Submission', status: 'pending' },
    ],
    tasks: [
      { id: 't1', title: 'Review Relationship Statement', status: 'pending' },
      { id: 't2', title: 'Upload Police Check', status: 'completed' },
    ],
    documents: [
      { id: 'd1', name: 'Relationship Statement.docx', date: '2023-11-20' },
    ],
  };
};

export const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: caseDetail, isLoading } = useQuery({
    queryKey: ['lawyer-case-detail', id],
    queryFn: () => fetchCaseDetail(id!),
    enabled: !!id,
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
          <div className="flex items-center gap-2 mb-1">
             <Link to="/lawyer/cases" className="text-neutral-500 hover:text-neutral-900 transition-colors">Cases</Link>
             <span className="text-neutral-300">/</span>
             <span className="text-neutral-900 font-medium">{caseDetail?.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            {caseDetail?.title}
            <Badge variant="info">{caseDetail?.status}</Badge>
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
             <Clock className="w-4 h-4 mr-2" />
             Log Time
          </Button>
          <Button>
             <MessageSquare className="w-4 h-4 mr-2" />
             Message Client
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardHeader>
               <h2 className="text-lg font-semibold">Progress</h2>
             </CardHeader>
             <CardBody>
               <div className="relative">
                 {caseDetail?.stages.map((stage, i) => (
                   <div key={stage.id} className="flex items-center gap-4 mb-6 last:mb-0 relative z-10">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                       stage.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' :
                       stage.status === 'in_progress' ? 'bg-blue-100 border-blue-500 text-blue-600' :
                       'bg-neutral-50 border-neutral-300 text-neutral-300'
                     }`}>
                       {i + 1}
                     </div>
                     <div className="flex-1">
                       <h3 className={`font-medium ${stage.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                         {stage.title}
                       </h3>
                       <p className="text-xs text-neutral-500 capitalize">{stage.status.replace('_', ' ')}</p>
                     </div>
                   </div>
                 ))}
                 <div className="absolute top-4 bottom-4 left-4 w-px bg-neutral-200 dark:bg-neutral-700 -z-0" />
               </div>
             </CardBody>
           </Card>

           <Card>
             <CardHeader className="flex justify-between items-center">
               <h2 className="text-lg font-semibold">Tasks</h2>
               <Button size="sm" variant="ghost">
                 <Plus className="w-4 h-4" />
               </Button>
             </CardHeader>
             <CardBody className="space-y-2">
               {caseDetail?.tasks.map((task) => (
                 <div key={task.id} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg group hover:bg-neutral-100 transition-colors cursor-pointer">
                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                     task.status === 'completed' ? 'bg-primary-600 border-primary-600 text-white' : 'border-neutral-300'
                   }`}>
                     {task.status === 'completed' && <CheckSquare className="w-3 h-3" />}
                   </div>
                   <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                     {task.title}
                   </span>
                 </div>
               ))}
             </CardBody>
           </Card>
        </div>

        <div className="space-y-6">
          <Card>
             <CardHeader>
               <h2 className="text-lg font-semibold">Client Details</h2>
             </CardHeader>
             <CardBody className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                   <User className="w-5 h-5 text-neutral-500" />
                 </div>
                 <div>
                   <p className="font-medium text-neutral-900 dark:text-white">{caseDetail?.client}</p>
                   <Link to="/lawyer/clients/detailed" className="text-xs text-primary-600 hover:underline">View Profile</Link>
                 </div>
               </div>
               <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700">
                 <p className="text-sm text-neutral-500 mb-1">Due Date</p>
                 <p className="font-medium">{new Date(caseDetail?.dueDate || '').toLocaleDateString()}</p>
               </div>
             </CardBody>
          </Card>

          <Card>
             <CardHeader>
               <h2 className="text-lg font-semibold">Documents</h2>
             </CardHeader>
             <CardBody className="space-y-2">
               {caseDetail?.documents.map((doc) => (
                 <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded transition-colors cursor-pointer">
                   <FileText className="w-4 h-4 text-neutral-400" />
                   <span className="text-sm text-primary-600 truncate">{doc.name}</span>
                 </div>
               ))}
               <Button variant="secondary" className="w-full mt-2">Upload Document</Button>
             </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
