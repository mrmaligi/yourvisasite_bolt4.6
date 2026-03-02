import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { StickyNote, Search, Plus, Filter, Calendar } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchNotes = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Meeting with Alice', preview: 'Discussed visa options and timeline...', date: '2023-11-20', client: 'Alice Smith', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    { id: '2', title: 'Phone Call Summary', preview: 'Client confirmed document availability.', date: '2023-11-22', client: 'Bob Jones', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { id: '3', title: 'Case Strategy', preview: 'Strategy for upcoming hearing.', date: '2023-11-15', client: 'Charlie Brown', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  ];
};

export const ClientNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: notes, isLoading } = useQuery({
    queryKey: ['lawyer-notes'],
    queryFn: fetchNotes,
  });

  const filteredNotes = notes?.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notes</h1>
          <p className="text-neutral-500 mt-1">Keep track of important details</p>
        </div>
        <Link to="/lawyer/notes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes?.map((note) => (
          <Link to={`/lawyer/notes/${note.id}`} key={note.id}>
            <div className={`p-6 rounded-xl border transition-all hover:shadow-md h-full flex flex-col ${note.color} bg-opacity-50`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">{note.title}</h3>
                <StickyNote className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-4 flex-1">
                {note.preview}
              </p>
              <div className="flex justify-between items-center text-xs text-neutral-500 pt-4 border-t border-black/5 dark:border-white/5">
                <span className="font-medium">{note.client}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
