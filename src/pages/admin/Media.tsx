import { useState, useEffect } from 'react';
import { Image, FileText, Trash2, Download, Upload, Grid, List as ListIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  size: number;
  created_at: string;
}

export function Media() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase.storage.from('documents').list();
      if (error) throw error;

      const items: MediaItem[] =
        data?.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'document',
          url: supabase.storage.from('documents').getPublicUrl(item.name).data.publicUrl,
          size: item.metadata?.size || 0,
          created_at: item.created_at,
        })) || [];

      setMedia(items);
    } catch (error) {
      toast('error', 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        const { error } = await supabase.storage.from('documents').upload(file.name, file);
        if (error) throw error;
      }
      toast('success', 'Files uploaded');
      setShowUpload(false);
      fetchMedia();
    } catch (error) {
      toast('error', 'Upload failed');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      const { error } = await supabase.storage.from('documents').remove([name]);
      if (error) throw error;
      toast('success', 'File deleted');
      fetchMedia();
    } catch (error) {
      toast('error', 'Delete failed');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Media Library</h1>
          <p className="text-neutral-500 mt-1">Manage uploaded files and images</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-6">
          {loading ? (
            <div className="animate-pulse grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-neutral-200 rounded-lg" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500">No media files yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowUpload(true)}>
                Upload Files
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-12 h-12 text-neutral-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">{formatSize(item.size)}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90"
                      onClick={() => handleDelete(item.name)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {media.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <FileText className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-neutral-500">{formatSize(item.size)} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge>{item.type}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.name)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Files">
        <FileUpload
          onUpload={handleUpload}
          accept="image/*,.pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024}
        />
      </Modal>
    </div>
  );
}
