import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, FileText, Image, Video, Download, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Select, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import type { Visa } from '../../types/database';

// Match actual database schema
interface PremiumContentItem {
  id: string;
  visa_id: string;
  title: string;
  description: string | null;
  content_type: 'guide' | 'checklist' | 'template' | 'document_examples' | 'example_application' | 'video' | 'file';
  content: string | null;
  file_urls: string[] | null;
  is_published: boolean;
  section_number: number | null;
  section_title: string | null;
  tips: string | null;
  created_at: string;
  updated_at: string;
}

const CONTENT_TYPES = [
  { value: 'guide', label: 'Guide', icon: FileText },
  { value: 'checklist', label: 'Checklist', icon: FileText },
  { value: 'template', label: 'Template', icon: FileText },
  { value: 'document_examples', label: 'Document Examples', icon: Image },
  { value: 'example_application', label: 'Example Application', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'file', label: 'File', icon: Download },
];

export function PremiumContent() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [selectedVisaId, setSelectedVisaId] = useState(searchParams.get('visa_id') || '');
  const [items, setItems] = useState<PremiumContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);

  // Load visas on mount
  useEffect(() => {
    supabase.from('visas').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setVisas(data || []));
  }, []);

  // Update selected visa when ID changes
  useEffect(() => {
    const visa = visas.find(v => v.id === selectedVisaId);
    setSelectedVisa(visa || null);
  }, [selectedVisaId, visas]);

  // Sync URL to state
  useEffect(() => {
    const id = searchParams.get('visa_id') || '';
    if (id !== selectedVisaId) {
      setSelectedVisaId(id);
    }
  }, [searchParams]);

  // Load premium content when visa selected
  useEffect(() => {
    if (!selectedVisaId) { 
      setItems([]); 
      return; 
    }
    
    setLoading(true);
    supabase
      .from('visa_premium_content')
      .select('*')
      .eq('visa_id', selectedVisaId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading premium content:', error);
          toast('error', 'Failed to load premium content');
        } else {
          setItems(data || []);
        }
        setLoading(false);
      });
  }, [selectedVisaId]);

  const addItem = () => {
    const newItem: PremiumContentItem = {
      id: `new-${Date.now()}`,
      visa_id: selectedVisaId,
      title: '',
      description: '',
      content_type: 'guide',
      content: '',
      file_urls: [],
      is_published: false,
      section_number: null,
      section_title: null,
      tips: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItems([newItem, ...items]);
  };

  const updateItem = (id: string, field: keyof PremiumContentItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value, updated_at: new Date().toISOString() } : item
    ));
  };

  const removeItem = async (id: string) => {
    if (id.startsWith('new-')) {
      // Not saved to DB yet, just remove from state
      setItems(items.filter(item => item.id !== id));
    } else {
      // Delete from database
      const { error } = await supabase
        .from('visa_premium_content')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast('error', 'Failed to delete item');
      } else {
        setItems(items.filter(item => item.id !== id));
        toast('success', 'Item deleted');
      }
    }
  };

  const saveItem = async (item: PremiumContentItem) => {
    if (!item.title.trim()) {
      toast('error', 'Title is required');
      return;
    }

    setLoading(true);

    const isNew = item.id.startsWith('new-');
    const dataToSave = {
      visa_id: item.visa_id,
      title: item.title,
      description: item.description,
      content_type: item.content_type,
      content: item.content,
      file_urls: item.file_urls,
      is_published: item.is_published,
      section_number: item.section_number,
      section_title: item.section_title,
      tips: item.tips,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { data, error } = await supabase
        .from('visa_premium_content')
        .insert({ ...dataToSave, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) {
        toast('error', `Failed to create: ${error.message}`);
      } else if (data) {
        setItems(items.map(i => i.id === item.id ? data : i));
        toast('success', 'Item created successfully');
      }
    } else {
      const { error } = await supabase
        .from('visa_premium_content')
        .update(dataToSave)
        .eq('id', item.id);
      
      if (error) {
        toast('error', `Failed to update: ${error.message}`);
      } else {
        toast('success', 'Item updated successfully');
      }
    }

    setLoading(false);
  };

  const togglePublish = async (item: PremiumContentItem) => {
    const newStatus = !item.is_published;
    
    if (item.id.startsWith('new-')) {
      // Just update local state
      updateItem(item.id, 'is_published', newStatus);
    } else {
      // Update in database
      const { error } = await supabase
        .from('visa_premium_content')
        .update({ is_published: newStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      
      if (error) {
        toast('error', 'Failed to update status');
      } else {
        updateItem(item.id, 'is_published', newStatus);
        toast('success', newStatus ? 'Item published' : 'Item unpublished');
      }
    }
  };

  const getContentTypeIcon = (type: string) => {
    const ct = CONTENT_TYPES.find(t => t.value === type);
    return ct?.icon || FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Premium Content</h1>
          <p className="text-neutral-500 mt-1">Manage premium guides and resources for each visa</p>
        </div>
      </div>

      <Select
        label="Select Visa"
        value={selectedVisaId}
        onChange={(e) => {
          const val = (e.target as HTMLSelectElement).value;
          setSelectedVisaId(val);
          setSearchParams(val ? { visa_id: val } : {});
        }}
        options={[{ value: '', label: 'Choose a visa...' }, ...visas.map((v) => ({ value: v.id, label: `Subclass ${v.subclass} - ${v.name}` }))]}
      />

      {selectedVisa && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
          <h3 className="font-semibold text-primary-900">
            Managing Premium Content for: Subclass {selectedVisa.subclass} - {selectedVisa.name}
          </h3>
          <p className="text-sm text-primary-700 mt-1">
            {items.length} premium item{items.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {selectedVisaId && (
        <>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={addItem} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" /> Add Premium Content
            </Button>
          </div>

          <div className="space-y-4">
            {items.length === 0 && !loading && (
              <div className="text-center py-12 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">No premium content yet</h3>
                <p className="text-neutral-500 mt-1">Add your first premium item for this visa</p>
              </div>
            )}

            {items.map((item) => {
              const Icon = getContentTypeIcon(item.content_type);
              const isNew = item.id.startsWith('new-');
              
              return (
                <Card key={item.id} className={isNew ? 'border-primary-300 ring-1 ring-primary-200' : ''}>
                  <CardHeader className="flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <div>
                        <span className="font-medium text-neutral-900">
                          {item.title || 'Untitled Content'}
                        </span>
                        {item.content_type && (
                          <Badge variant="secondary" className="ml-2">
                            {CONTENT_TYPES.find(t => t.value === item.content_type)?.label || item.content_type}
                          </Badge>
                        )}
                        {item.is_published ? (
                          <Badge variant="success" className="ml-2">Published</Badge>
                        ) : (
                          <Badge variant="warning" className="ml-2">Draft</Badge>
                        )}
                        {isNew && <Badge variant="primary" className="ml-2">New</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(item)}
                      >
                        {item.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardHeader>
                  
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Title *"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        placeholder="e.g. Complete Application Guide"
                      />
                      
                      <Select
                        label="Content Type"
                        value={item.content_type}
                        onChange={(e) => updateItem(item.id, 'content_type', e.target.value)}
                        options={CONTENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
                      />
                    </div>

                    <Textarea
                      label="Description"
                      value={item.description || ''}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      rows={2}
                      placeholder="Brief description of this premium content..."
                    />

                    {(item.content_type === 'guide' || item.content_type === 'checklist' || item.content_type === 'template') && (
                      <Textarea
                        label="Content (Markdown)"
                        value={item.content || ''}
                        onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                        rows={6}
                        placeholder="# Heading&#10;&#10;Write your content here using markdown..."
                      />
                    )}

                    <Textarea
                      label="Tips (Optional)"
                      value={item.tips || ''}
                      onChange={(e) => updateItem(item.id, 'tips', e.target.value)}
                      rows={2}
                      placeholder="Helpful tips for users..."
                    />

                    {/* File URLs Display */}
                    {item.file_urls && item.file_urls.length > 0 && (
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Attached Files</label>
                        <div className="space-y-2">
                          {item.file_urls.map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Download className="w-4 h-4 text-neutral-400" />
                              <span className="text-neutral-600 truncate flex-1">{url.split('/').pop()}</span>
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" /> View
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <Button 
                        loading={loading} 
                        onClick={() => saveItem(item)}
                        disabled={!item.title.trim()}
                      >
                        {isNew ? 'Create Item' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
