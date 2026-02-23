import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FileUpload } from '../../../components/ui/FileUpload';

interface VerificationData {
  status: 'approved' | 'pending' | 'rejected' | 'incomplete';
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
  documents: {
    id: string;
    name: string;
    status: 'approved' | 'pending' | 'rejected';
  }[];
}

const fetchVerification = async (): Promise<VerificationData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    status: 'pending',
    submittedAt: '2023-11-25',
    documents: [
      { id: '1', name: 'Practicing Certificate.pdf', status: 'pending' },
      { id: '2', name: 'ID Document.jpg', status: 'approved' },
    ],
  };
};

export const VerificationStatus = () => {
  const { data: verification, isLoading } = useQuery({
    queryKey: ['lawyer-verification'],
    queryFn: fetchVerification,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const statusColors = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    incomplete: 'default',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Verification Status</h1>
          <p className="text-neutral-500 mt-1">Manage your identity and professional credentials</p>
        </div>
        <Badge variant={statusColors[verification?.status || 'incomplete'] as any} className="text-sm px-3 py-1">
          {verification?.status.toUpperCase()}
        </Badge>
      </div>

      {verification?.status === 'pending' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Review in Progress</h3>
            <p className="text-sm text-amber-700 mt-1">
              Our team is currently reviewing your documents. This usually takes 24-48 hours.
              You will be notified via email once the process is complete.
            </p>
          </div>
        </div>
      )}

      {verification?.status === 'approved' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-emerald-800">Verified Lawyer</h3>
            <p className="text-sm text-emerald-700 mt-1">
              Your account is fully verified. You have access to all features and appear as "Verified" to clients.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Submitted Documents</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {verification?.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{doc.name}</span>
                </div>
                {doc.status === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Badge variant={statusColors[doc.status] as any} className="text-xs">
                    {doc.status}
                  </Badge>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Upload Additional Documents</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-neutral-500">
              If requested, please upload additional documentation here.
            </p>
            <FileUpload onFileSelect={() => {}} accept=".pdf,.jpg,.png" />
            <Button className="w-full" disabled={verification?.status === 'pending'}>
              Submit for Review
            </Button>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
