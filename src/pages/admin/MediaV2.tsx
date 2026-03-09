import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Image, FileText, Trash2, Upload, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'document';
  size: string;
  createdAt: string;
}

const MOCK_MEDIA: MediaItem[] = [
  { id: '1', name: 'visa-guide-cover.jpg', type: 'image', size: '2.4 MB', createdAt: '2024-03-20' },
  { id: '2', name: 'partner-visa-checklist.pdf', type: 'document', size: '1.2 MB', createdAt: '2024-03-18' },
  { id: '3', name: 'lawyer-profile-1.jpg', type: 'image', size: '850 KB', createdAt: '2024-03-15' },
  { id: '4', name: 'terms-of-service.pdf', type: 'document', size: '450 KB', createdAt: '2024-03-10' },
];

export function MediaV2() {
  const [media] = useState<MediaItem[]>(MOCK_MEDIA);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    documents: media.filter(m => m.type === 'document').length,
  };

  const getFileIcon = (type: string) => {
    return type === 'image' ? <Image className="w-8 h-8 text-blue-600" /> : <FileText className="w-8 h-8 text-red-600" />;
  };

  return (
    <>
      <Helmet>
        <title>Media Library | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                <p className="text-slate-600">Manage images and documents</p>
              </div>
              <div className="flex gap-2">
                <div className="flex bg-slate-100 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
                <Button variant="primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Files', value: stats.total },
              { label: 'Images', value: stats.images },
              { label: 'Documents', value: stats.documents },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Media Grid - SQUARE */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 p-4 group">
                  <div className="aspect-square bg-slate-100 flex items-center justify-center mb-3">
                    {getFileIcon(item.type)}
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.size}</p>
                  
                  <button className="mt-2 text-red-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">File</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Size</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {media.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(item.type)}
                            <span className="font-medium text-slate-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><Badge variant="secondary">{item.type}</Badge></td>
                        <td className="px-6 py-4 text-slate-600">{item.size}</td>
                        <td className="px-6 py-4">
                          <Button variant="danger" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
