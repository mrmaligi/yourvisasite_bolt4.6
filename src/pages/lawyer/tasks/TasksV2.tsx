import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckSquare, Plus, Calendar, Flag } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  client?: string;
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Prepare affidavit', dueDate: '2024-03-25', priority: 'high', completed: false, client: 'Alice Smith' },
  { id: '2', title: 'Call regarding documents', dueDate: '2024-03-22', priority: 'medium', completed: true, client: 'Bob Jones' },
  { id: '3', title: 'Update case notes', dueDate: '2024-03-26', priority: 'low', completed: false },
];

export function TasksV2() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium ${colors[priority]}`}>{priority}</span>;
  };

  return (
    <>
      <Helmet>
        <title>Tasks | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
                <p className="text-slate-600">Manage your to-do list</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Completed', value: stats.completed, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
              { label: 'High Priority', value: stats.highPriority, color: 'text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200"
              />
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="divide-y divide-slate-200">
              {tasks.map((task) => (
                <div key={task.id} className={`p-4 flex items-center gap-4 ${task.completed ? 'bg-slate-50' : ''}`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 border-2 flex items-center justify-center ${
                      task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
                    }`}
                  >
                    {task.completed && <CheckSquare className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    {task.client && <p className="text-sm text-slate-500">{task.client}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate}
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
