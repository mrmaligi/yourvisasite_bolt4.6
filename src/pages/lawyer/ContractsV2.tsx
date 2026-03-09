import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TEMPLATES = [
  { id: '1', name: 'Service Agreement - Standard', lastModified: '2024-03-01', type: 'agreement' },
  { id: '2', name: 'Consultation Waiver', lastModified: '2024-02-15', type: 'waiver' },
  { id: '3', name: 'Privacy Consent Form', lastModified: '2024-01-20', type: 'consent' },
  { id: '4', name: 'Retainer Agreement', lastModified: '2024-03-10', type: 'agreement' },
];

export function ContractsV2() {
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');

  const handleEdit = (template: any) => {
    setActiveTemplate(template);
    setEditorContent(`TERMS AND CONDITIONS\n\n${template.name}\n\n[Contract content placeholder - Edit this template]`);
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      agreement: 'bg-blue-100 text-blue-700',
      waiver: 'bg-amber-100 text-amber-700',
      consent: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[type] || 'bg-slate-100 text-slate-700'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Contracts | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
                <p className="text-slate-600">Manage legal templates and agreements</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Templates List - SQUARE */}
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Templates</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleEdit(template)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      activeTemplate?.id === template.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 truncate">{template.name}</p>
                      <p className="text-sm text-slate-500">Modified: {template.lastModified}</p>
                    </div>
                    {getTypeBadge(template.type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor - SQUARE */}
            <div className="lg:col-span-2 bg-white border border-slate-200">
              {activeTemplate ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">{activeTemplate.name}</h2>
                      <p className="text-sm text-slate-500">Last modified: {activeTemplate.lastModified}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="primary" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <textarea
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full h-96 px-4 py-3 border border-slate-200 focus:border-blue-500 outline-none font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select a template to edit</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
