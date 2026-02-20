import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

const fetchSpecializations = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    'Skilled Migration',
    'Partner Visas',
    'Student Visas',
    'Employer Sponsored',
    'Citizenship',
  ];
};

const allSpecializations = [
  'Skilled Migration',
  'Partner Visas',
  'Student Visas',
  'Employer Sponsored',
  'Citizenship',
  'Business Visas',
  'Refugee & Humanitarian',
  'Appeals & Tribunals',
  'Visitor Visas',
  'Family Visas',
];

export const Specializations = () => {
  const { addToast } = useToast();
  const { data: specializations, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-specializations'],
    queryFn: fetchSpecializations,
  });

  const mutation = useMutation({
    mutationFn: async (newSpecs: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newSpecs;
    },
    onSuccess: () => {
      addToast('Specializations updated', 'success');
      refetch();
    }
  });

  const toggleSpecialization = (spec: string) => {
    if (!specializations) return;
    const newSpecs = specializations.includes(spec)
      ? specializations.filter(s => s !== spec)
      : [...specializations, spec];
    mutation.mutate(newSpecs);
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Specializations</h1>
          <p className="text-neutral-500 mt-1">Select the areas of law you practice</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Your Expertise</h2>
            <p className="text-sm text-neutral-500">These will appear on your profile</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {specializations?.map((spec) => (
                <Badge key={spec} variant="primary" className="flex items-center gap-1 pr-1">
                  {spec}
                  <button
                    onClick={() => toggleSpecialization(spec)}
                    className="p-0.5 hover:bg-white/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {specializations?.length === 0 && (
                <p className="text-sm text-neutral-500 italic">No specializations selected.</p>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Available Areas</h2>
            <p className="text-sm text-neutral-500">Click to add to your profile</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {allSpecializations.filter(s => !specializations?.includes(s)).map((spec) => (
                <button
                  key={spec}
                  onClick={() => toggleSpecialization(spec)}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {spec}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
