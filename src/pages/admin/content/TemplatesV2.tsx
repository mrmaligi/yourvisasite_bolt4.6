import { FileText, Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TemplatesV2() {
  const templates = [
    { id: 1, name: 'Blog Post', description: 'Standard blog post layout', lastUsed: '2024-03-20' },
    { id: 2, name: 'Landing Page', description: 'Conversion focused layout', lastUsed: '2024-03-15' },
    { id: 3, name: 'Documentation', description: 'Technical documentation layout', lastUsed: '2024-03-10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
            <p className="text-slate-600">Manage content templates</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-slate-200 p-6">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{template.description}</p>
              <p className="text-xs text-slate-400 mb-4">Last used: {template.lastUsed}</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <button className="p-2 text-slate-400 hover:text-blue-600"><Copy className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
