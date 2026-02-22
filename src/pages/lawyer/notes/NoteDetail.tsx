import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Calendar, User } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

const fetchNote = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id,
    title: 'Meeting with Alice',
    content: 'Discussed visa options and timeline. Alice is concerned about the processing time for the Partner Visa. Advised her to gather evidence of relationship history immediately. Next meeting scheduled for next week.',
    client: 'Alice Smith',
    date: '2023-11-20',
  };
};

export const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const { data: note, isLoading } = useQuery({
    queryKey: ['lawyer-note', id],
    queryFn: async () => {
      const data = await fetchNote(id!);
      setTitle(data.title);
      setContent(data.content);
      return data;
    },
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      addToast('success', 'Note saved');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      addToast('success', 'Note deleted');
      navigate('/lawyer/notes');
    },
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/lawyer/notes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Edit Note</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="danger" onClick={() => deleteMutation.mutate()}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[500px] flex flex-col">
            <CardBody className="flex-1 p-6">
              <Input
                className="text-2xl font-bold border-none px-0 mb-4 focus:ring-0"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full h-full resize-none focus:outline-none bg-transparent text-neutral-700 dark:text-neutral-300 leading-relaxed"
                placeholder="Start typing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-2 text-neutral-500">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Client</span>
                </div>
                <span className="font-medium">{note?.client}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date</span>
                </div>
                <span className="font-medium">{new Date(note?.date || '').toLocaleDateString()}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
