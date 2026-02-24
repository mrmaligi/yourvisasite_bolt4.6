import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea, Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';

interface Note {
  id: string;
  title: string;
  content: string;
  clientName?: string;
  updatedAt: string;
}

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Consultation with Sarah', content: 'Discussed partner visa requirements...', clientName: 'Sarah Johnson', updatedAt: '2024-03-20T10:00:00' },
  { id: '2', title: 'Document Review', content: 'Missing form 80 for Michael...', clientName: 'Michael Chen', updatedAt: '2024-03-19T14:30:00' },
  { id: '3', title: 'General Strategy', content: 'Focus on skilled migration leads...', updatedAt: '2024-03-15T09:00:00' },
];

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(MOCK_NOTES[0].id);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (field: keyof Note, value: string) => {
      if (!selectedNoteId) return;
      setNotes(notes.map(n => n.id === selectedNoteId ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n));
  };

  const handleDelete = (id: string) => {
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const handleNewNote = () => {
      const newNote: Note = {
          id: Date.now().toString(),
          title: 'Untitled Note',
          content: '',
          updatedAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.clientName?.toLowerCase().includes(search.toLowerCase()));

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
                            {note.clientName && (
                                <p className="text-xs text-neutral-500 mt-1">{note.clientName}</p>
                            )}
                            <p className="text-xs text-neutral-400 mt-2">
                                {new Date(note.updatedAt).toLocaleDateString()}
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
                                <Button variant="secondary">
                                    <Save className="w-4 h-4 mr-2" />
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
