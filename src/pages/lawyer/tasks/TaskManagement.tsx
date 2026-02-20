import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Plus, Calendar, Flag } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  client?: string;
}

const fetchTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Prepare affidavit for Alice', dueDate: '2023-11-25', priority: 'high', completed: false, client: 'Alice Smith' },
    { id: '2', title: 'Call Bob regarding documents', dueDate: '2023-11-22', priority: 'medium', completed: true, client: 'Bob Jones' },
    { id: '3', title: 'Update case notes', dueDate: '2023-11-26', priority: 'low', completed: false },
  ];
};

export const TaskManagement = () => {
  const { addToast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['lawyer-tasks'],
    queryFn: fetchTasks,
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return id;
    },
    onSuccess: () => {
      refetch(); // Ideally optimistic update
    }
  });

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return title;
    },
    onSuccess: () => {
      setNewTaskTitle('');
      addToast('Task added', 'success');
      refetch();
    }
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addMutation.mutate(newTaskTitle);
    }
  };

  const priorityColor = {
    high: 'text-red-500 bg-red-50',
    medium: 'text-amber-500 bg-amber-50',
    low: 'text-blue-500 bg-blue-50',
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tasks</h1>
          <p className="text-neutral-500 mt-1">Manage your daily to-dos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  className="flex-1"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Button type="submit" disabled={!newTaskTitle || addMutation.isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </form>

              <div className="space-y-2">
                {tasks?.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      task.completed
                        ? 'bg-neutral-50 border-transparent opacity-60'
                        : 'bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => toggleMutation.mutate(task.id)}
                      className={`p-1 rounded transition-colors ${
                        task.completed ? 'text-primary-600' : 'text-neutral-400 hover:text-primary-600'
                      }`}
                    >
                      {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                        {task.title}
                      </p>
                      {task.client && (
                        <p className="text-xs text-neutral-500">{task.client}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <span className={`p-1 rounded text-xs ${priorityColor[task.priority]}`}>
                          <Flag className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Stats</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Completed Today</span>
                <span className="font-bold text-xl">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Pending High Priority</span>
                <span className="font-bold text-xl text-red-500">2</span>
              </div>
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-xs text-center mt-2 text-neutral-500">65% of weekly goals met</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
