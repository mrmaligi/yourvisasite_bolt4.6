import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchKanban = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    columns: [
      {
        id: 'new',
        title: 'New / Intake',
        cards: [
          { id: 'c1', title: 'Consultation - John Doe', client: 'John Doe', tag: 'Consultation', urgent: false },
        ],
      },
      {
        id: 'collecting',
        title: 'Document Collection',
        cards: [
          { id: 'c2', title: 'Partner Visa 820', client: 'Alice Smith', tag: 'Visa Application', urgent: true },
        ],
      },
      {
        id: 'review',
        title: 'Under Review',
        cards: [
          { id: 'c3', title: 'Skilled Independent 189', client: 'Bob Jones', tag: 'Review' },
        ],
      },
      {
        id: 'submitted',
        title: 'Submitted',
        cards: [
          { id: 'c4', title: 'Employer Nomination 482', client: 'Tech Corp', tag: 'Submitted' },
        ],
      },
    ],
  };
};

export const CaseKanban = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-case-kanban'],
    queryFn: fetchKanban,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-12rem)] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Case Board</h1>
          <p className="text-neutral-500 mt-1">Manage case workflow</p>
        </div>
        <Link to="/lawyer/cases">
          <Button variant="secondary">List View</Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max px-1">
          {data?.columns.map((col) => (
            <div key={col.id} className="w-80 flex flex-col h-full bg-neutral-100 dark:bg-neutral-800/50 rounded-xl p-3">
              <div className="flex justify-between items-center px-2 py-2 mb-2">
                <h3 className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  {col.title}
                  <span className="bg-neutral-200 dark:bg-neutral-700 text-xs px-2 py-0.5 rounded-full text-neutral-600 dark:text-neutral-400">
                    {col.cards.length}
                  </span>
                </h3>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
                {col.cards.map((card) => (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
                        {card.tag}
                      </Badge>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900 dark:text-white mb-1">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mb-3">{card.client}</p>
                    {(card as any).urgent && (
                      <div className="flex justify-end">
                        <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Urgent
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-80 h-12 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-center text-neutral-500">
            <Plus className="w-4 h-4 mr-2" /> Add Column
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
