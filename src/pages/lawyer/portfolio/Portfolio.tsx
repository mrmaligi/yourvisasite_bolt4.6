import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, Link as LinkIcon, Plus, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { FileUpload } from '../../../components/ui/FileUpload';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

const fetchPortfolio = async (): Promise<PortfolioItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      title: 'Successful Tech Visa Case',
      description: 'Helped a software engineer secure a Global Talent Visa in record time.',
      link: 'https://example.com/case-study-1',
    },
    {
      id: '2',
      title: 'Complex Family Reunification',
      description: 'Navigated complex health waiver requirements to reunite a family.',
    },
  ];
};

export const Portfolio = () => {
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({});

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-portfolio'],
    queryFn: fetchPortfolio,
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<PortfolioItem>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.random().toString(), ...data };
    },
    onSuccess: () => {
      addToast('success', 'Portfolio item added');
      setIsAdding(false);
      setNewItem({});
      refetch();
    },
    onError: () => {
      addToast('error', 'Failed to add item');
    }
  });

  const handleSubmit = () => {
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Portfolio</h1>
          <p className="text-neutral-500 mt-1">Highlight your expertise with case studies</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in slide-in-from-top-4">
          <CardHeader>
            <h2 className="text-lg font-semibold">New Case Study / Item</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g. Successful Tech Visa"
              value={newItem.title || ''}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
            <Textarea
              label="Description"
              placeholder="Describe the challenge and outcome..."
              value={newItem.description || ''}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <Input
              label="Link (Optional)"
              placeholder="https://..."
              value={newItem.link || ''}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cover Image (Optional)
              </label>
              <FileUpload onFileSelect={() => {}} accept="image/*" compact />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newItem.title || mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Add to Portfolio'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <Card key={item.id} className="overflow-hidden h-full flex flex-col">
            <div className="h-40 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Briefcase className="w-12 h-12 text-neutral-300" />
              )}
            </div>
            <CardBody className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm flex-1 mb-4">
                {item.description}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  View Case Study
                </a>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
