import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Note {
  id: string;
  title: string;
  content: string;
  clientName?: string;
  updatedAt: string;
}

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Consultation with Sarah', content: 'Discussed partner visa requirements...', clientName: 'Sarah Johnson', updatedAt: '2024-03-20' },
  { id: '2', title: 'Document Review', content: 'Missing form 80 for Michael...', clientName: 'Michael Chen', updatedAt: '2024-03-19' },
  { id: '3', title: 'General Strategy', content: 'Focus on skilled migration leads...', updatedAt: '2024-03-15' },
];

export function NotesV2() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(MOCK_NOTES[0].id);
  const [search, setSearch] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (field: keyof Note, value: string) => {
    if (!selectedNoteId) return;
    setNotes(notes.map(n => n.id === selectedNoteId ? { ...n, [field]: value, updatedAt: new Date().toISOString().split('T')[0] } : n));
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
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Notes | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
                <p className="text-slate-600">Manage your case notes and memos</p>
              </div>
              <Button variant="primary" onClick={handleNewNote}>
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{note.title}</p>
                        {note.clientName && (
                          <p className="text-sm text-slate-500">{note.clientName}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{note.updatedAt}</p>
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-slate-200 p-6">
              {selectedNote ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => handleUpdateNote('title', e.target.value)}
                    className="w-full text-xl font-semibold border-0 border-b border-slate-200 pb-2 focus:outline-none focus:border-blue-600"
                  />
                  
                  {selectedNote.clientName && (
                    <p className="text-sm text-slate-500">Client: {selectedNote.clientName}</p>
                  )}
                  
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => handleUpdateNote('content', e.target.value)}
                    placeholder="Start typing..."
                    className="w-full h-96 p-4 border border-slate-200 resize-none"
                  />
                  
                  <p className="text-sm text-slate-400">Last updated: {selectedNote.updatedAt}</p>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-slate-500">
                  Select a note to view or create a new one
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
