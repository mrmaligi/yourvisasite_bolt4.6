import { CheckSquare, Square, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export function LawyerTasksV2() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review John Doe application', due: 'Today', priority: 'high', completed: false },
    { id: 2, title: 'Prepare consultation notes', due: 'Tomorrow', priority: 'medium', completed: false },
    { id: 3, title: 'Upload case documents', due: 'Mar 25', priority: 'low', completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-slate-400">Manage your to-do list</p>
          </div>
          <Button variant="primary">+ New Task</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 flex items-center gap-4">
                <button onClick={() => toggleTask(task.id)} className="text-blue-600">
                  {task.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3" /> {task.due}</span>
                    <span className={`px-2 py-0.5 text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{task.priority}</span>
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-red-600">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
