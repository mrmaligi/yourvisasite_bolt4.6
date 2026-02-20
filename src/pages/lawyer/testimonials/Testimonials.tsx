import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Quote, Plus, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface Testimonial {
  id: string;
  clientName: string;
  quote: string;
  source: string; // e.g. "Google Reviews", "Direct Email"
}

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      clientName: 'Sarah J.',
      quote: 'Jane helped me navigate a complex visa situation with ease. Forever grateful!',
      source: 'Google Reviews',
    },
    {
      id: '2',
      clientName: 'Mike T.',
      quote: 'Professional, efficient, and caring. The best immigration lawyer in Sydney.',
      source: 'Direct Email',
    },
  ];
};

export const Testimonials = () => {
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ clientName: '', quote: '', source: '' });

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-testimonials'],
    queryFn: fetchTestimonials,
  });

  const mutation = useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.random().toString(), ...data };
    },
    onSuccess: () => {
      addToast('Testimonial added', 'success');
      setIsAdding(false);
      setNewTestimonial({ clientName: '', quote: '', source: '' });
      refetch();
    },
    onError: () => {
      addToast('Failed to add testimonial', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      addToast('Testimonial removed', 'success');
      refetch();
    }
  });

  const handleAdd = () => {
    mutation.mutate(newTestimonial);
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Testimonials</h1>
          <p className="text-neutral-500 mt-1">Showcase your success stories</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in slide-in-from-top-4">
          <CardHeader>
            <h2 className="text-lg font-semibold">New Testimonial</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                value={newTestimonial.clientName}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
              />
              <Input
                label="Source (e.g. Google)"
                value={newTestimonial.source}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, source: e.target.value })}
              />
            </div>
            <Textarea
              label="Quote"
              value={newTestimonial.quote}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newTestimonial.clientName || !newTestimonial.quote || mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add to Profile'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials?.map((t) => (
          <Card key={t.id} className="h-full">
            <CardBody className="flex flex-col h-full">
              <Quote className="w-8 h-8 text-primary-200 mb-4" />
              <p className="text-neutral-700 dark:text-neutral-300 italic mb-4 flex-1">
                "{t.quote}"
              </p>
              <div className="flex justify-between items-end border-t border-neutral-100 pt-4 mt-auto">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{t.clientName}</p>
                  <p className="text-xs text-neutral-500">{t.source}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteMutation.mutate(t.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
