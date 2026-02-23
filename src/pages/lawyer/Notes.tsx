import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, Save, Loader2 } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea, Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface Note {
  id: string;
  title: string;
  content: string;
  client_id?: string; // UUID
  created_at: string;
  updated_at: string;
  client?: {
    full_name: string;
  };
}

export function Notes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
        // Mock data for testing if no user (or mock user)
        // logic handled inside fetchNotes usually, or we rely on interception
        if (typeof window !== 'undefined' && window.location.search.includes('mock_auth=lawyer')) {
             fetchNotes();
        }
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      // If mock auth, we rely on the interceptor returning data for this query
      const { data, error } = await supabase
        .from('lawyer_notes')
        .select('*, client:profiles(full_name)')
        .eq('lawyer_id', user?.id || 'mock-lawyer')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      if (data && data.length > 0 && !selectedNoteId) {
        setSelectedNoteId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (field: keyof Note, value: string) => {
      if (!selectedNoteId) return;
      setNotes(notes.map(n => n.id === selectedNoteId ? { ...n, [field]: value } : n));
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    try {
        setSaving(true);
        const { error } = await supabase
            .from('lawyer_notes')
            .upsert({
                id: selectedNote.id,
                title: selectedNote.title,
                content: selectedNote.content,
                lawyer_id: user?.id || 'mock-lawyer',
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        toast({ title: 'Saved', description: 'Note saved successfully.' });
        fetchNotes(); // Refresh to update sorting/timestamp
    } catch (error) {
        console.error('Error saving note:', error);
        toast({ title: 'Error', description: 'Failed to save note.', variant: 'destructive' });
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this note?')) return;
      try {
          const { error } = await supabase.from('lawyer_notes').delete().eq('id', id);
          if (error) throw error;

          setNotes(notes.filter(n => n.id !== id));
          if (selectedNoteId === id) setSelectedNoteId(null);
          toast({ title: 'Deleted', description: 'Note deleted.' });
      } catch (error) {
          toast({ title: 'Error', description: 'Failed to delete note.', variant: 'destructive' });
      }
  };

  const handleNewNote = async () => {
      // Create a placeholder note in UI or DB?
      // Better to create in DB to get ID
      try {
          const newNote = {
              lawyer_id: user?.id || 'mock-lawyer',
              title: 'Untitled Note',
              content: '',
          };
          const { data, error } = await supabase.from('lawyer_notes').insert([newNote]).select().single();
          if (error) throw error;

          setNotes([data, ...notes]);
          setSelectedNoteId(data.id);
      } catch (error) {
          toast({ title: 'Error', description: 'Failed to create note.', variant: 'destructive' });
      }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.client?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LawyerDashboardLayout>
      <Helmet>
        <title>Notes | VisaBuild</title>
      </Helmet>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar List */}
        <div className="w-1/3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notes</h1>
                <Button size="sm" onClick={handleNewNote}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                    placeholder="Search notes..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">No notes found.</div>
                ) : (
                    filteredNotes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setSelectedNoteId(note.id)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${
                                selectedNoteId === note.id
                                ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800'
                                : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                        >
                            <h3 className={`font-semibold ${selectedNoteId === note.id ? 'text-primary-900 dark:text-primary-100' : 'text-neutral-900 dark:text-white'}`}>
                                {note.title}
                            </h3>
                            {note.client?.full_name && (
                                <p className="text-xs text-neutral-500 mt-1">{note.client.full_name}</p>
                            )}
                            <p className="text-xs text-neutral-400 mt-2">
                                {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
            {selectedNote ? (
                <Card className="h-full flex flex-col">
                    <CardBody className="flex-1 flex flex-col p-6 gap-4">
                        <div className="flex items-center justify-between">
                             <Input
                                value={selectedNote.title}
                                onChange={(e) => handleUpdateNote('title', e.target.value)}
                                className="text-xl font-bold border-none px-0 focus:ring-0 bg-transparent shadow-none"
                                placeholder="Note Title"
                             />
                             <div className="flex gap-2">
                                <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(selectedNote.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="secondary" onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save
                                </Button>
                             </div>
                        </div>
                        <Textarea
                            value={selectedNote.content}
                            onChange={(e) => handleUpdateNote('content', e.target.value)}
                            className="flex-1 resize-none border-none focus:ring-0 p-0 text-neutral-600 dark:text-neutral-300 text-base leading-relaxed bg-transparent shadow-none"
                            placeholder="Start typing..."
                        />
                    </CardBody>
                </Card>
            ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-400">
                    <p>Select a note or create a new one</p>
                </div>
            )}
        </div>
      </div>
    </LawyerDashboardLayout>
  );
}
