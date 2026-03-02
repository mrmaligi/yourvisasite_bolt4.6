import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderOpen,
  Trash2,
  Download,
  HelpCircle,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  DollarSign,
  Briefcase,
  Users,
  Heart,
  Shield,
  GraduationCap,
  FilePlus,
  Home,
  MapPin,
  Mail,
  Plane,
  Flag,
  Building,
  Languages,
  Wallet,
  Award,
  CreditCard,
  Activity,
  Filter,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BUCKETS, uploadFile, validateFile } from '../../lib/storage';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';
import { useDocuments } from '../../hooks/useDocuments';
import type { UserDocument } from '../../types/database';

// Map icon strings from DB to Lucide components
const ICON_MAP: Record<string, any> = {
  'id-card': CreditCard,
  'shield-check': Shield,
  'heart-pulse': Activity,
  'languages': Languages,
  'wallet': Wallet,
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'certificate': Award,
  'heart': Heart,
  'home': Home,
  'user-check': Users,
  'map-pin': MapPin,
  'file-text': FileText,
  'users': Users,
  'mail': Mail,
  'plane': Plane,
  'flag': Flag,
  'building': Building,
  'file-plus': FilePlus,
  // Fallbacks
  'user': User,
  'dollar-sign': DollarSign,
  'shield': Shield,
};

const statusConfig = {
  pending: { variant: 'warning' as const, icon: Clock, label: 'Pending Review' },
  verified: { variant: 'success' as const, icon: CheckCircle, label: 'Verified' },
  rejected: { variant: 'danger' as const, icon: AlertCircle, label: 'Action Required' },
};

export function MyDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const {
    documents: docs,
    categories,
    deleteDocument,
    getDocumentUrl,
    loading: docsLoading,
    refresh
  } = useDocuments();

  const [modalCategoryKey, setModalCategoryKey] = useState<string | null>(null);
  const [uploadFileState, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [inlineUploadCategory, setInlineUploadCategory] = useState<string | null>(null);
  const [expandedHelp, setExpandedHelp] = useState<Record<string, boolean>>({});
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const categoryKey = searchParams.get('category');
    if (categoryKey && categories.length > 0) {
      const el = document.getElementById(`category-${categoryKey}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedHelp(prev => ({ ...prev, [categoryKey]: true }));
          setHighlightedCategory(categoryKey);
          // Remove highlight after 2 seconds
          setTimeout(() => setHighlightedCategory(null), 2000);
        }, 500); // Delay slightly to ensure render
      }
    }
  }, [searchParams, categories]);

  const getCategoryId = async (key: string) => {
    const cat = categories.find(c => c.key === key);
    if (cat) return cat.id;
    // Fetch if needed
    const { data } = await supabase.from('document_categories').select('id').eq('key', key).single();
    return data?.id;
  }

  const handleModalUpload = async () => {
    if (!user || !uploadFileState || !modalCategoryKey) return;

    try {
      if (validateFile(uploadFileState)) {
        setUploading(true);
        setUploadProgress(0);

        const path = `${user.id}/${Date.now()}_${uploadFileState.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const catId = await getCategoryId(modalCategoryKey);

        if (!catId) throw new Error('Invalid category');

        await uploadFile({
          bucket: BUCKETS.DOCUMENTS,
          path,
          file: uploadFileState,
          onProgress: setUploadProgress,
        });

        const { error: insertError } = await supabase
          .from('user_documents')
          .insert([
            {
              user_id: user.id,
              document_category_id: catId,
              file_name: uploadFileState.name,
              file_path: path,
              status: 'pending',
            },
          ]);

        if (insertError) throw insertError;

        await refresh();
        toast('success', 'Document uploaded successfully');
        setModalCategoryKey(null);
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

  const handleInlineUpload = async (file: File, categoryKey: string) => {
    if (!user) return;

    try {
      if (validateFile(file)) {
        setInlineUploadCategory(categoryKey);
        setUploading(true);
        setUploadProgress(0);

        const path = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const catId = await getCategoryId(categoryKey);

        if (!catId) throw new Error('Invalid category');

        await uploadFile({
          bucket: BUCKETS.DOCUMENTS,
          path,
          file,
          onProgress: setUploadProgress,
        });

        const { error: insertError } = await supabase
          .from('user_documents')
          .insert([
            {
              user_id: user.id,
              document_category_id: catId,
              file_name: file.name,
              file_path: path,
              status: 'pending',
            },
          ]);

        if (insertError) throw insertError;

        await refresh();
        toast('success', 'Document uploaded successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast('error', message);
    } finally {
      setUploading(false);
      setInlineUploadCategory(null);
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

  const getDocsByCategory = (categoryKey: string) => {
      const cat = categories.find(c => c.key === categoryKey);
      if (!cat) return [];
      return docs.filter((d) => d.document_category_id === cat.id);
  }

  // Filtered categories to display
  // If filterCategory is set, only show that category. Otherwise show all.
  const displayedCategories = filterCategory
    ? categories.filter(c => c.key === filterCategory)
    : categories;

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
           <Button onClick={() => setModalCategoryKey(categories[0]?.key || '')}>
             <Upload className="w-4 h-4 mr-2" />
             Upload
           </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <select
          className="text-sm bg-neutral-50 border-neutral-200 rounded-lg px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
          value={filterCategory || ''}
          onChange={(e) => setFilterCategory(e.target.value || null)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.key} value={c.key}>{c.name}</option>
          ))}
        </select>

        <select
          className="text-sm bg-neutral-50 border-neutral-200 rounded-lg px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>

        {(filterCategory || filterStatus) && (
          <button
            onClick={() => { setFilterCategory(null); setFilterStatus(null); }}
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 ml-auto"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {docsLoading && categories.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCategories.map((category) => {
            let categoryDocs = getDocsByCategory(category.key);

            // Apply status filter locally if needed
            if (filterStatus) {
              categoryDocs = categoryDocs.filter(d => d.status === filterStatus);
            }

            const verified = categoryDocs.filter((d) => d.status === 'verified').length;
            const pending = categoryDocs.filter((d) => d.status === 'pending').length;
            const rejected = categoryDocs.filter((d) => d.status === 'rejected').length;

            const IconComponent = ICON_MAP[category.icon] || FolderOpen;

            return (
              <Card
                key={category.key}
                className={`hover:shadow-md transition-shadow group h-full flex flex-col ${highlightedCategory === category.key ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
              >
                <CardHeader className="pb-3 flex-none">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-neutral-100 rounded-lg text-neutral-500">
                            <IconComponent className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-neutral-900 text-sm">
                        {category.name}
                        </h3>
                    </div>
                    <button
                      onClick={() => setExpandedHelp(prev => ({ ...prev, [category.key]: !prev[category.key] }))}
                      className={`p-1 rounded hover:bg-neutral-100 transition-colors ${expandedHelp[category.key] ? 'text-primary-600 bg-primary-50' : 'text-neutral-400 hover:text-neutral-600'}`}
                      title="View details and examples"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {expandedHelp[category.key] ? (
                    <div className="mt-3 p-3 bg-neutral-50 rounded-lg text-sm border border-neutral-100 animate-in fade-in slide-in-from-top-1">
                      <p className="text-neutral-700 mb-2 text-xs">{category.explanation || category.description}</p>
                      {category.examples && category.examples.length > 0 && (
                        <div className="mb-2">
                          <p className="font-semibold text-neutral-900 text-[10px] uppercase tracking-wider mb-1">Examples</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-neutral-600 text-xs">
                            {category.examples.map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {category.tips && (
                        <div className="mt-2 pt-2 border-t border-neutral-200">
                          <p className="text-[10px] text-neutral-500 italic">💡 {category.tips}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2 min-h-[2.5em]">{category.description}</p>
                  )}
                </CardHeader>
                <CardBody className="pt-3 border-t border-neutral-100 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    {categoryDocs.length === 0 ? (
                      <div className="text-center py-3 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xs text-neutral-400">No documents</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {categoryDocs.slice(0, 3).map((doc) => {
                          const statusInfo = statusConfig[doc.status];
                          const StatusIcon = statusInfo.icon;
                          return (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors group/doc"
                            >
                              <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${
                                doc.status === 'verified' ? 'text-green-600' :
                                doc.status === 'rejected' ? 'text-red-600' :
                                'text-amber-600'
                              }`} />
                              <p className="text-xs text-neutral-700 truncate flex-1" title={doc.file_name}>
                                {doc.file_name}
                              </p>
                              <div className="flex opacity-0 group-hover/doc:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-1 rounded hover:bg-white text-neutral-500 hover:text-primary-600"
                                    title="Download"
                                >
                                    <Download className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc)}
                                    className="p-1 rounded hover:bg-white text-neutral-500 hover:text-red-600"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {categoryDocs.length > 3 && (
                          <p className="text-xs text-neutral-400 text-center pt-1">
                            +{categoryDocs.length - 3} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-50">
                    <div className="flex items-center gap-2 mb-2 min-h-[20px]">
                      {verified > 0 && <Badge variant="success" className="text-[10px] py-0">{verified} verified</Badge>}
                      {pending > 0 && <Badge variant="warning" className="text-[10px] py-0">{pending} pending</Badge>}
                      {rejected > 0 && <Badge variant="danger" className="text-[10px] py-0">{rejected} rejected</Badge>}
                    </div>

                    <FileUpload
                      key={`${category.key}-${docs.length}`} // Force reset after upload or doc change
                      compact
                      onFileSelect={(file) => handleInlineUpload(file, category.key)}
                      uploading={uploading && inlineUploadCategory === category.key}
                      progress={uploading && inlineUploadCategory === category.key ? uploadProgress : 0}
                      className="mt-2"
                    />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!modalCategoryKey}
        onClose={() => {
          setModalCategoryKey(null);
          setUploadFile(null);
        }}
        title="Upload Document"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalCategoryKey(null)}>
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
                  Document Category
              </label>
              <select
                className="w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={modalCategoryKey || ''}
                onChange={(e) => setModalCategoryKey(e.target.value)}
              >
                  {categories.map(c => (
                      <option key={c.key} value={c.key}>{c.name}</option>
                  ))}
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
                File
            </label>
            <FileUpload
                key={modalCategoryKey || 'new'}
                onFileSelect={setUploadFile}
                uploading={uploading && !!modalCategoryKey}
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
