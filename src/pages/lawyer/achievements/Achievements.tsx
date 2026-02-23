import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface Achievement {
  id: string;
  title: string;
  year: string;
  issuer: string;
}

const fetchAchievements = async (): Promise<Achievement[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      title: 'Best Immigration Lawyer of the Year',
      year: '2023',
      issuer: 'Legal Awards Australia',
    },
    {
      id: '2',
      title: 'Top Rated Solicitor',
      year: '2022',
      issuer: 'ThreeBestRated',
    },
  ];
};

export const Achievements = () => {
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Achievement>>({});

  const { data: achievements, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-achievements'],
    queryFn: fetchAchievements,
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<Achievement>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.random().toString(), ...data };
    },
    onSuccess: () => {
      addToast('success', 'Achievement added');
      setIsAdding(false);
      setNewItem({});
      refetch();
    },
    onError: () => {
      addToast('error', 'Failed to add achievement');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      addToast('success', 'Achievement removed');
      refetch();
    }
  });

  const handleAdd = () => {
    mutation.mutate(newItem);
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Achievements</h1>
          <p className="text-neutral-500 mt-1">Awards, certifications, and recognitions</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in slide-in-from-top-4">
          <CardHeader>
            <h2 className="text-lg font-semibold">New Achievement</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Title/Award Name"
                value={newItem.title || ''}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
              <Input
                label="Year"
                value={newItem.year || ''}
                onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
              />
            </div>
            <Input
              label="Issuing Organization"
              value={newItem.issuer || ''}
              onChange={(e) => setNewItem({ ...newItem, issuer: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newItem.title || mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Add to Profile'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {achievements?.map((item) => (
          <Card key={item.id}>
            <CardBody className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.issuer}</p>
                  <p className="text-xs font-medium text-neutral-400 mt-1">{item.year}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
