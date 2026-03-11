import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Folder,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

interface Document {
  id: string;
  name: string;
  description?: string;
  document_type: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  file_url?: string;
  file_name?: string;
  uploaded_at?: string;
  notes?: string;
  is_custom: boolean;
  is_mandatory?: boolean;
}

interface DocumentFolder {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  documents: Document[];
}

interface UserInfo {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}

export function LawyerDocumentDashboard() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocType, setNewDocType] = useState('identity');
  const [newDocMandatory, setNewDocMandatory] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch user info
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone')
      .eq('id', userId)
      .single();
    
    if (userData) {
      setUserInfo(userData);
    }

    // Fetch document folders
    const { data: foldersData } = await supabase
      .from('document_folders')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });

    // Fetch documents
    const { data: docsData } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // Organize documents by folder
    const organizedFolders = (foldersData || []).map(folder => ({
      ...folder,
      documents: (docsData || []).filter(doc => doc.folder_id === folder.id)
    }));

    setFolders(organizedFolders);
    setLoading(false);
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim() || !userId) return;

    const { error } = await supabase
      .from('document_folders')
      .insert({
        user_id: userId,
        name: newFolderName,
        description: newFolderDesc,
        sort_order: folders.length,
        is_custom: true
      });

    if (error) {
      toast('error', 'Failed to create folder');
    } else {
      toast('success', 'Folder created successfully');
      setShowAddFolder(false);
      setNewFolderName('');
      setNewFolderDesc('');
      fetchData();
    }
  };

  const handleAddDocument = async () => {
    if (!newDocName.trim() || !userId || !selectedFolder) return;

    const { error } = await supabase
      .from('user_documents')
      .insert({
        user_id: userId,
        folder_id: selectedFolder,
        name: newDocName,
        description: newDocDesc,
        document_type: newDocType,
        is_mandatory: newDocMandatory,
        status: 'pending',
        is_custom: true
      });

    if (error) {
      toast('error', 'Failed to add document');
    } else {
      toast('success', 'Document added successfully');
      setShowAddDocument(false);
      setNewDocName('');
      setNewDocDesc('');
      fetchData();
    }
  };

  const handleStatusChange = async (docId: string, newStatus: string) => {
    const { error } = await supabase
      .from('user_documents')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', docId);

    if (!error) {
      toast('success', `Document marked as ${newStatus}`);
      fetchData();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'uploaded': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge variant="success">Verified</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'uploaded': return <Badge variant="warning">Pending Review</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filteredFolders = folders.map(folder => ({
    ...folder,
    documents: folder.documents.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(folder => folder.documents.length > 0 || searchQuery === '');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-neutral-200 rounded-lg" />
          <div className="h-64 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link to="/lawyer/clients" className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Clients
            </Link>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {userInfo?.full_name || 'Client'}'s Documents
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userInfo?.email}
                    </span>
                    {userInfo?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {userInfo.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => setShowAddFolder(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-neutral-900">{folders.reduce((acc, f) => acc + f.documents.length, 0)}</p>
              <p className="text-sm text-neutral-500">Total Documents</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {folders.reduce((acc, f) => acc + f.documents.filter(d => d.status === 'verified').length, 0)}
              </p>
              <p className="text-sm text-neutral-500">Verified</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {folders.reduce((acc, f) => acc + f.documents.filter(d => d.status === 'uploaded').length, 0)}
              </p>
              <p className="text-sm text-neutral-500">Pending Review</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {folders.reduce((acc, f) => acc + f.documents.filter(d => d.status === 'rejected').length, 0)}
              </p>
              <p className="text-sm text-neutral-500">Rejected</p>
            </CardBody>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Document Folders */}
        <div className="space-y-6">
          {filteredFolders.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Folder className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">No folders yet. Create your first folder to organize documents.</p>
                <Button className="mt-4" onClick={() => setShowAddFolder(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Folder
                </Button>
              </CardBody>
            </Card>
          ) : (
            filteredFolders.map((folder) => (
              <Card key={folder.id}>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-neutral-900">{folder.name}</h3>
                      {folder.description && (
                        <p className="text-sm text-neutral-500">{folder.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setShowAddDocument(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </CardHeader>
                <CardBody>
                  {folder.documents.length === 0 ? (
                    <p className="text-sm text-neutral-400 italic">No documents in this folder yet.</p>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {folder.documents.map((doc) => (
                        <div key={doc.id} className="py-4 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getStatusIcon(doc.status)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-neutral-900">{doc.name}</p>
                                {doc.is_mandatory && <Badge variant="danger" className="text-xs">Required</Badge>}
                                {doc.is_custom && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                              </div>
                              {doc.description && (
                                <p className="text-sm text-neutral-500">{doc.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                {getStatusBadge(doc.status)}
                                
                                {doc.file_name && (
                                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(doc.uploaded_at || '').toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {doc.file_url ? (
                              <Button variant="ghost" size="sm" onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}>
                                <span>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </span>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" disabled>
                                <Upload className="w-4 h-4 mr-2" />
                                Not Uploaded
                              </Button>
                            )}
                            
                            <div className="relative group">
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 hidden group-hover:block z-10">
                                <button
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                                  onClick={() => handleStatusChange(doc.id, 'verified')}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  Mark Verified
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                                  onClick={() => handleStatusChange(doc.id, 'rejected')}
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                  Mark Rejected
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                                  onClick={() => handleStatusChange(doc.id, 'pending')}
                                >
                                  <AlertCircle className="w-4 h-4 text-neutral-500" />
                                  Mark Pending
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Folder Modal */}
      <Modal
        isOpen={showAddFolder}
        onClose={() => setShowAddFolder(false)}
        title="Create New Folder"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddFolder(false)}>Cancel</Button>
            <Button onClick={handleAddFolder}>Create Folder</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="e.g., Identity Documents"
          />
          <Textarea
            label="Description (Optional)"
            value={newFolderDesc}
            onChange={(e) => setNewFolderDesc(e.target.value)}
            placeholder="Brief description of what this folder contains"
          />
        </div>
      </Modal>

      {/* Add Document Modal */}
      <Modal
        isOpen={showAddDocument}
        onClose={() => setShowAddDocument(false)}
        title="Add New Document Requirement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddDocument(false)}>Cancel</Button>
            <Button onClick={handleAddDocument}>Add Document</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Document Name"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            placeholder="e.g., Passport Bio Page"
          />
          <Textarea
            label="Description (Optional)"
            value={newDocDesc}
            onChange={(e) => setNewDocDesc(e.target.value)}
            placeholder="Any specific requirements or notes"
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Document Type</label>
            <select
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="identity">Identity</option>
              <option value="financial">Financial</option>
              <option value="travel">Travel</option>
              <option value="health">Health</option>
              <option value="character">Character</option>
              <option value="relationship">Relationship</option>
              <option value="employment">Employment</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newDocMandatory}
              onChange={(e) => setNewDocMandatory(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-neutral-700">This is a mandatory document</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
