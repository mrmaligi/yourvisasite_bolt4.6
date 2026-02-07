import { useEffect, useState } from 'react';
import { FolderOpen, Trash2, Download, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { UserDocument } from '../../types/database';

const statusVariant = {
  pending: 'warning' as const,
  verified: 'success' as const,
  rejected: 'danger' as const,
};

export function MyDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, [user]);

  const handleDelete = async (doc: UserDocument) => {
    await supabase.storage.from('user-documents').remove([doc.storage_path]);
    await supabase.from('user_documents').delete().eq('id', doc.id);
    toast('success', 'Document deleted');
    fetchDocs();
  };

  const handleDownload = async (doc: UserDocument) => {
    const { data } = await supabase.storage.from('user-documents').createSignedUrl(doc.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">My Documents</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-neutral-200 rounded-xl" />)}
        </div>
      ) : docs.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents uploaded"
          description="Upload documents from your visa guide pages to organize your application."
        />
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardBody className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{doc.file_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusVariant[doc.status]}>{doc.status}</Badge>
                    <span className="text-xs text-neutral-400">{doc.document_category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDownload(doc)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
