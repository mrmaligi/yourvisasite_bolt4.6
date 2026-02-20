import { useState } from 'react';
import {
  Image,
  FileText,
  Trash2,
  Download,
  Filter,
  Search,
  Upload,
  MoreVertical,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    size: '1.2 MB',
    uploadedAt: '2024-03-15T10:30:00Z',
    uploadedBy: 'Admin User'
  },
  {
    id: '2',
    name: 'visa-guide-v2.pdf',
    type: 'document',
    url: '#',
    size: '3.5 MB',
    uploadedAt: '2024-03-14T14:20:00Z',
    uploadedBy: 'John Doe'
  },
  {
    id: '3',
    name: 'australia-map.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    size: '850 KB',
    uploadedAt: '2024-03-12T09:15:00Z',
    uploadedBy: 'Admin User'
  },
  {
    id: '4',
    name: 'client-onboarding.mp4',
    type: 'video',
    url: '#',
    size: '15.2 MB',
    uploadedAt: '2024-03-10T16:45:00Z',
    uploadedBy: 'Sarah Smith'
  },
  {
    id: '5',
    name: 'terms-and-conditions.pdf',
    type: 'document',
    url: '#',
    size: '156 KB',
    uploadedAt: '2024-03-08T11:00:00Z',
    uploadedBy: 'Admin User'
  },
  {
    id: '6',
    name: 'logo-dark.svg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    size: '45 KB',
    uploadedAt: '2024-03-05T13:20:00Z',
    uploadedBy: 'Design Team'
  }
];

export function Media() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = (files: File[]) => {
    // Mock upload logic
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    } as MediaItem));

    setMediaItems([...newItems, ...mediaItems]);
    setIsUploadOpen(false);
    toast('success', `${files.length} file(s) uploaded successfully`);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setMediaItems(mediaItems.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
      setIsDeleteOpen(false);
      toast('success', 'File deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Media Library</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage and organize your digital assets</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-neutral-800 rounded-lg p-1 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-neutral-900 dark:text-white"
          />
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-800">
                    {item.type === 'video' ? <Upload className="w-8 h-8 text-neutral-500" /> : <FileText className="w-8 h-8 text-neutral-500" />}
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsDeleteOpen(true); }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-neutral-900 dark:text-white truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-neutral-500 mt-1">{item.size}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Uploaded</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                            {item.type === 'image' ? <Image className="w-4 h-4" /> : item.type === 'video' ? <Upload className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-neutral-500">{item.size}</td>
                      <td className="px-6 py-3">
                        <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                      </td>
                      <td className="px-6 py-3 text-neutral-500">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Media"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsUploadOpen(false)}>Done</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FileUpload
            label="Drag and drop files here"
            onFileSelect={handleUpload}
            maxSize={10 * 1024 * 1024} // 10MB
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
              'application/pdf': ['.pdf'],
              'video/*': ['.mp4', '.webm']
            }}
          />
          <p className="text-sm text-neutral-500">
            Supported formats: JPG, PNG, GIF, PDF, MP4. Max size: 10MB.
          </p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedItem(null); }}
        title="Delete File"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsDeleteOpen(false); setSelectedItem(null); }}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete <span className="font-semibold text-neutral-900 dark:text-white">{selectedItem?.name}</span>? This action cannot be undone.
        </p>
      </Modal>

      {/* Preview Modal (could be expanded) */}
      {selectedItem && !isDeleteOpen && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
          size="lg"
          footer={
             <div className="flex justify-between w-full">
               <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
               <Button onClick={() => setSelectedItem(null)}>Close</Button>
             </div>
          }
        >
          <div className="space-y-4">
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden">
               {selectedItem.type === 'image' ? (
                 <img src={selectedItem.url} alt={selectedItem.name} className="max-w-full max-h-full object-contain" />
               ) : (
                 <div className="text-center">
                   <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-2" />
                   <p className="text-neutral-500">Preview not available for this file type.</p>
                 </div>
               )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">File Size</p>
                <p className="font-medium text-neutral-900 dark:text-white">{selectedItem.size}</p>
              </div>
              <div>
                <p className="text-neutral-500">Uploaded By</p>
                <p className="font-medium text-neutral-900 dark:text-white">{selectedItem.uploadedBy}</p>
              </div>
              <div>
                <p className="text-neutral-500">Uploaded At</p>
                <p className="font-medium text-neutral-900 dark:text-white">{new Date(selectedItem.uploadedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-neutral-500">Type</p>
                <p className="font-medium text-neutral-900 dark:text-white capitalize">{selectedItem.type}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
