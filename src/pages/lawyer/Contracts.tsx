import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus } from 'lucide-react';
import { LawyerDashboardLayout } from '@/components/layout/LawyerDashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const TEMPLATES = [
  { id: '1', name: 'Service Agreement - Standard', lastModified: '2024-03-01' },
  { id: '2', name: 'Consultation Waiver', lastModified: '2024-02-15' },
  { id: '3', name: 'Privacy Consent Form', lastModified: '2024-01-20' },
];

export function Contracts() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const handleEdit = (template: any) => {
    setActiveTemplate(template.id);
    setEditorContent(`Terms and Conditions for ${template.name}...\n\n[Contract content placeholder]`);
  };

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Contracts & Templates | VisaBuild</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Contracts</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage legal templates and agreements.</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Templates</h2>
            </CardHeader>
            <CardBody className="p-2">
              <div className="space-y-1">
                {TEMPLATES.map((temp) => (
                  <button
                    key={temp.id}
                    onClick={() => handleEdit(temp)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTemplate === temp.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex-1 truncate">
                      <p className="font-medium text-sm truncate">{temp.name}</p>
                      <p className="text-xs text-neutral-500">Modified {temp.lastModified}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Editor */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between items-center">
               <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                 {activeTemplate ? 'Editor' : 'Select a template'}
               </h2>
               {activeTemplate && (
                 <div className="flex gap-2">
                   <Button size="sm" variant="secondary">Preview</Button>
                   <Button size="sm">Save</Button>
                 </div>
               )}
            </CardHeader>
            <CardBody>
              {activeTemplate ? (
                <textarea
                  className="w-full h-[500px] p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 font-mono text-sm focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 dark:bg-neutral-900"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center text-neutral-400">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p>Select a template to start editing</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
