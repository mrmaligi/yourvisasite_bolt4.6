import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, FileText, Upload, Plus, Download, Trash2 } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

interface DocItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  updatedAt: string;
}

const MOCK_DOCS: DocItem[] = [
  { id: '1', name: 'Client Visas', type: 'folder', updatedAt: '2024-03-20' },
  { id: '2', name: 'Templates', type: 'folder', updatedAt: '2024-02-15' },
  { id: '3', name: 'Invoices', type: 'folder', updatedAt: '2024-03-10' },
  { id: '4', name: 'Guide - Partner Visa.pdf', type: 'file', size: '2.4 MB', updatedAt: '2024-03-18' },
  { id: '5', name: 'Checklist - 189 Visa.docx', type: 'file', size: '1.1 MB', updatedAt: '2024-03-12' },
];

export function Documents() {
  const [items] = useState<DocItem[]>(MOCK_DOCS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Documents | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Documents</h1>
            <p className="text-neutral-600 dark:text-neutral-300">Manage and organize your firm's documents.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                New Folder
            </Button>
            <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))
            ) : (
                items.filter(i => i.type === 'folder').map(folder => (
                    <Card key={folder.id} className="hover:border-primary-500 cursor-pointer transition-colors group">
                        <CardBody className="p-4 flex flex-col items-center text-center gap-3">
                            <Folder className="w-12 h-12 text-primary-200 group-hover:text-primary-500 transition-colors" />
                            <div className="w-full">
                                <p className="font-medium text-neutral-900 dark:text-white truncate">{folder.name}</p>
                                <p className="text-xs text-neutral-500">{new Date(folder.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>

        <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Files</h2>
            <div className="space-y-2">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-xl" />
                    ))
                ) : (
                    items.filter(i => i.type === 'file').map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-neutral-900 dark:text-white truncate">{file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <span>{file.size}</span>
                                        <span>•</span>
                                        <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-neutral-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
