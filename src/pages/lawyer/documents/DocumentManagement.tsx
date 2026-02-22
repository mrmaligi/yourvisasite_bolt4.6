import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Folder, File, Upload, Trash2, Download, Search, Plus, MoreVertical } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FileUpload } from '../../../components/ui/FileUpload';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';

interface Doc {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  client?: string;
}

const fetchDocuments = async (): Promise<Doc[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Alice Smith - Case Files', type: 'folder', modified: '2023-11-20' },
    { id: '2', name: 'Bob Jones - Visas', type: 'folder', modified: '2023-11-25' },
    { id: '3', name: 'Retainer Agreement Template.pdf', type: 'file', size: '1.2 MB', modified: '2023-10-15' },
    { id: '4', name: 'Fee Schedule 2024.pdf', type: 'file', size: '0.5 MB', modified: '2023-11-01' },
  ];
};

export const DocumentManagement = () => {
  const { addToast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [uploading, setUploading] = useState(false);

  const { data: docs, isLoading } = useQuery({
    queryKey: ['lawyer-documents'],
    queryFn: fetchDocuments,
  });

  const handleUpload = (file: File) => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      addToast('success', `Uploaded ${file.name}`);
    }, 1500);
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Documents</h1>
          <p className="text-neutral-500 mt-1">Centralized file storage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setView(view === 'list' ? 'grid' : 'list')}>
            {view === 'list' ? 'Grid View' : 'List View'}
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex gap-4 items-center mb-4">
             <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent"
              />
            </div>
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>

          {view === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="pb-3 font-medium text-neutral-500 pl-4 w-10"></th>
                    <th className="pb-3 font-medium text-neutral-500">Name</th>
                    <th className="pb-3 font-medium text-neutral-500">Size</th>
                    <th className="pb-3 font-medium text-neutral-500">Modified</th>
                    <th className="pb-3 font-medium text-neutral-500 text-right pr-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {docs?.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                      <td className="py-3 pl-4">
                        {doc.type === 'folder' ? (
                          <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <File className="w-5 h-5 text-blue-500" />
                        )}
                      </td>
                      <td className="py-3 font-medium text-neutral-900 dark:text-white">{doc.name}</td>
                      <td className="py-3 text-neutral-500">{doc.size || '-'}</td>
                      <td className="py-3 text-neutral-500">{new Date(doc.modified).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-end gap-2">
                           <button className="p-1 hover:bg-neutral-200 rounded text-neutral-500">
                            <Download className="w-4 h-4" />
                          </button>
                           <button className="p-1 hover:bg-neutral-200 rounded text-neutral-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                           <button className="p-1 hover:bg-neutral-200 rounded text-neutral-500">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {docs?.map((doc) => (
                <div key={doc.id} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer flex flex-col items-center text-center gap-3 group relative">
                   {doc.type === 'folder' ? (
                      <Folder className="w-16 h-16 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <File className="w-16 h-16 text-blue-500" />
                    )}
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate w-full" title={doc.name}>
                      {doc.name}
                    </p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1 hover:bg-white rounded-full text-neutral-500 shadow-sm border border-neutral-100">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {uploading && (
         <div className="fixed bottom-6 right-6 bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 animate-in slide-in-from-bottom-4">
            <p className="text-sm font-medium flex items-center gap-2">
               <Upload className="w-4 h-4 animate-bounce" />
               Uploading file...
            </p>
         </div>
      )}
    </motion.div>
  );
};
