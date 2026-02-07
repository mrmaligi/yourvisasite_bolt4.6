import { useEffect, useState } from 'react';
import {
  FolderOpen,

  Download,
  HelpCircle,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';
import type { UserDocument } from '../../types/database';

interface DocumentCategory {
  name: string;
  description: string;
  icon: string;
  examples: string[];
}

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    name: 'Identity Documents',
    description: 'Passport, birth certificate, national ID cards',
    icon: 'user',
    examples: ['Valid passport (all pages)', 'Birth certificate', 'National ID card (front and back)'],
  },
  {
    name: 'Financial Documents',
    description: 'Bank statements, tax returns, proof of funds',
    icon: 'dollar-sign',
    examples: ['Bank statements (last 3 months)', 'Tax returns (last 2 years)', 'Proof of funds or savings'],
  },
  {
    name: 'Professional Documents',
    description: 'Degrees, certificates, employment letters',
    icon: 'briefcase',
    examples: ['University degrees', 'Professional certificates', 'Employment reference letters', 'Resume/CV'],
  },
  {
    name: 'Family Documents',
    description: 'Marriage certificate, birth certificates',
    icon: 'users',
    examples: ['Marriage certificate', 'Children birth certificates', 'Family relationship evidence'],
  },
  {
    name: 'Medical Documents',
    description: 'Health examinations, vaccination records',
    icon: 'heart',
    examples: ['Health examination results', 'Vaccination records', 'Medical history'],
  },
  {
    name: 'Police Clearance',
    description: 'Character certificates, background checks',
    icon: 'shield',
    examples: ['Police clearance certificate', 'Character reference letters', 'Criminal record check'],
  },
];

const statusConfig = {
  pending: { variant: 'warning' as const, icon: Clock, label: 'Pending Review' },
  verified: { variant: 'success' as const, icon: CheckCircle, label: 'Verified' },
  rejected: { variant: 'danger' as const, icon: AlertCircle, label: 'Action Required' },
};

export function MyDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [helpCategory, setHelpCategory] = useState<DocumentCategory | null>(null);

  const fetchDocs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false});
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, [user]);

  const handleUpload = async () => {
    if (!user || !uploadFile || !uploadCategory) return;
    setUploading(true);

    try {
      const path = `${user.id}/${uploadCategory}/${Date.now()}_${uploadFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(path, uploadFile);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('user_documents').insert({
        user_id: user.id,
        visa_id: null,
        document_category: uploadCategory,
        file_name: uploadFile.name,
        storage_path: path,
        status: 'pending',
      });

      if (insertError) throw insertError;

      toast('success', 'Document uploaded successfully');
      setUploadCategory(null);
      setUploadFile(null);
      fetchDocs();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast('error', message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: UserDocument) => {
    const { data } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(doc.storage_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const getDocsByCategory = (category: string) =>
    docs.filter((d) => d.document_category === category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Document Vault</h1>
        <Badge variant="info">{docs.length} documents</Badge>
      </div>

      <p className="text-neutral-600">
        Organize your immigration documents by category. Upload them here to keep everything secure and accessible.
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_CATEGORIES.map((category) => {
            const categoryDocs = getDocsByCategory(category.name);
            const verified = categoryDocs.filter((d) => d.status === 'verified').length;
            const pending = categoryDocs.filter((d) => d.status === 'pending').length;
            const rejected = categoryDocs.filter((d) => d.status === 'rejected').length;

            return (
              <Card
                key={category.name}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-neutral-900 text-sm">
                      {category.name}
                    </h3>
                    <button
                      onClick={() => setHelpCategory(category)}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{category.description}</p>
                </CardHeader>
                <CardContent className="pt-3 border-t border-neutral-100">
                  <div className="space-y-2">
                    {categoryDocs.length === 0 ? (
                      <div className="text-center py-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                          <FolderOpen className="w-5 h-5 text-neutral-400" />
                        </div>
                        <p className="text-xs text-neutral-400">No documents</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {categoryDocs.slice(0, 2).map((doc) => {
                          const statusInfo = statusConfig[doc.status];
                          const StatusIcon = statusInfo.icon;
                          return (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors group"
                            >
                              <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${
                                doc.status === 'verified' ? 'text-green-600' :
                                doc.status === 'rejected' ? 'text-red-600' :
                                'text-amber-600'
                              }`} />
                              <p className="text-xs text-neutral-700 truncate flex-1">
                                {doc.file_name}
                              </p>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white"
                              >
                                <Download className="w-3 h-3 text-neutral-500" />
                              </button>
                            </div>
                          );
                        })}
                        {categoryDocs.length > 2 && (
                          <p className="text-xs text-neutral-400 text-center pt-1">
                            +{categoryDocs.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      {verified > 0 && <Badge variant="success" className="text-xs py-0.5">{verified} verified</Badge>}
                      {pending > 0 && <Badge variant="warning" className="text-xs py-0.5">{pending} pending</Badge>}
                      {rejected > 0 && <Badge variant="destructive" className="text-xs py-0.5">{rejected} rejected</Badge>}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setUploadCategory(category.name)}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!uploadCategory}
        onClose={() => {
          setUploadCategory(null);
          setUploadFile(null);
        }}
        title={`Upload ${uploadCategory}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setUploadCategory(null)}>
              Cancel
            </Button>
            <Button
              loading={uploading}
              disabled={!uploadFile}
              onClick={handleUpload}
            >
              Upload Document
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Select a file to upload for {uploadCategory}
          </p>
          <FileUpload onFileSelect={setUploadFile} />
          {uploadFile && (
            <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <FileText className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-700">{uploadFile.name}</span>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={!!helpCategory}
        onClose={() => setHelpCategory(null)}
        title={helpCategory?.name || ''}
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">{helpCategory?.description}</p>
          <div>
            <p className="text-sm font-medium text-neutral-900 mb-2">Examples of acceptable documents:</p>
            <ul className="space-y-1.5">
              {helpCategory?.examples.map((example, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
