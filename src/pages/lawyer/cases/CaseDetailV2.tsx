import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { CheckSquare, Clock, FileText, User, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const MOCK_CASE = {
  id: '1',
  title: 'Partner Visa 820',
  client: 'Alice Smith',
  description: 'Application for onshore Partner Visa (Subclass 820/801).',
  status: 'In Progress',
  dueDate: '2023-12-15',
  stages: [
    { id: '1', title: 'Initial Assessment', status: 'completed' },
    { id: '2', title: 'Document Collection', status: 'in_progress' },
    { id: '3', title: 'Application Submission', status: 'pending' },
  ],
  tasks: [
    { id: 't1', title: 'Review Relationship Statement', status: 'pending' },
    { id: 't2', title: 'Upload Police Check', status: 'completed' },
  ],
  documents: [
    { id: 'd1', name: 'Relationship Statement.docx', date: '2023-11-20' },
  ],
};

export function CaseDetailV2() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <>
      <Helmet>
        <title>{MOCK_CASE.title} | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/lawyer/cases">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500">Cases /</span>
                  <span className="text-slate-900 font-medium">{MOCK_CASE.title}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  {MOCK_CASE.title}
                  <Badge variant="primary">{MOCK_CASE.status}</Badge>
                </h1>
                <p className="text-slate-600 mt-1">{MOCK_CASE.description}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  {MOCK_CASE.client}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Stages</h2>
                
                <div className="space-y-4">
                  {MOCK_CASE.stages.map((stage, i) => (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
                        stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                        stage.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{stage.title}</p>
                        <p className="text-sm text-slate-500 capitalize">{stage.status.replace('_', ' ')}</p>
                      </div>
                      
                      {stage.status === 'completed' && <CheckSquare className="w-5 h-5 text-green-600" />}
                      {stage.status === 'in_progress' && <Clock className="w-5 h-5 text-blue-600" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Due Date</p>
                    <p className="font-medium text-slate-900">{MOCK_CASE.dueDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Client</p>
                    <p className="font-medium text-slate-900">{MOCK_CASE.client}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Case ID</p>
                    <p className="font-medium text-slate-900">#{id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-3">
                {MOCK_CASE.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200">
                    <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-300'
                    }`}>
                      {task.status === 'completed' && <CheckSquare className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>
              
              <div className="space-y-3">
                {MOCK_CASE.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Notes</h2>
              
              <textarea 
                className="w-full h-48 p-4 border border-slate-200"
                placeholder="Add notes about this case..."
              />
              
              <div className="mt-4 flex justify-end">
                <Button variant="primary">Save Notes</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
