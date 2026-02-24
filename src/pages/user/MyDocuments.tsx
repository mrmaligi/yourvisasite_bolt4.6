import { useState } from 'react';
import {
  FileText,
  Trash2,
  Download,
  Upload,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BUCKETS, uploadFile, validateFile } from '../../lib/storage';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';
import { useDocuments } from '../../hooks/useDocuments';
import type { UserDocument } from '../../types/database';

export function MyDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    documents: docs,
    deleteDocument,
    getDocumentUrl,
    loading: docsLoading,
    refresh,
    uploadDocument
  } = useDocuments();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileState, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleModalUpload = async () => {
    if (!user || !uploadFileState) return;

    try {
      if (validateFile(uploadFileState)) {
        setUploading(true);
        setUploadProgress(0);

        // Use the hook's uploadDocument function which handles storage + DB
        // But hook's uploadDocument uses supabase.storage directly.
        // Wait, the hook uses `uploadDocument(file)`.
        // The previous code used `uploadFile` utility + manual DB insert.
        // The hook now encapsulates both (in my update).
        // Let's use the hook function.

        const { error } = await uploadDocument(uploadFileState);

        if (error) throw error;

        toast('success', 'Document uploaded successfully');
        setIsUploadModalOpen(false);
        setUploadFile(null);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast('error', message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (doc: UserDocument) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const { error } = await deleteDocument(doc);
      if (error) {
        toast('error', 'Failed to delete document');
      } else {
        toast('success', 'Document deleted');
      }
    }
  };

  const handleDownload = async (doc: UserDocument) => {
    const url = await getDocumentUrl(doc.file_path);
    if (url) window.open(url, '_blank');
    else toast('error', 'Failed to get download URL');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-neutral-900">Document Vault</h1>
           <p className="text-neutral-600 mt-1">
            Securely store and manage your immigration documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="info">{docs.length} documents</Badge>
           <Button onClick={() => setIsUploadModalOpen(true)}>
             <Upload className="w-4 h-4 mr-2" />
             Upload
           </Button>
        </div>
      </div>

      {docsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <Card>
          <CardBody className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">No documents yet</h3>
            <p className="text-neutral-500 mt-1 max-w-sm">
              Upload your passport, birth certificate, and other documents to keep them safe and ready for your application.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)} className="mt-4">
              Upload Document
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900">Your Documents</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-neutral-100">
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-900 truncate" title={doc.file_name}>
                        {doc.file_name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadFile(null);
        }}
        title="Upload Document"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={uploading}
              disabled={!uploadFileState}
              onClick={handleModalUpload}
            >
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
                File
            </label>
            <FileUpload
                onFileSelect={setUploadFile}
                uploading={uploading}
                progress={uploadProgress}
            />
          </div>

          {uploadFileState && (
            <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <FileText className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-700 truncate">{uploadFileState.name}</span>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
}
