import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

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

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.clientName?.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

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
                <p className="text-slate-600">Keep track of client interactions and tasks</p>
              </div>
              <Button variant="primary" onClick={handleNewNote}>
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200"
                  />
                </div>
              </div>
              
              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full text-left p-4 transition-colors ${
                      selectedNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-medium text-slate-900 truncate">{note.title}</p>
                    {note.clientName && <Badge variant="secondary" size="sm" className="mt-1">{note.clientName}</Badge>}
                    <p className="text-xs text-slate-400 mt-1">{note.updatedAt}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200">
              {selectedNote ? (
                <>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, title: e.target.value } : n))}
                      className="text-lg font-semibold bg-transparent border-none outline-none flex-1"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(selectedNote.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <textarea
                      value={selectedNote.content}
                      onChange={(e) => setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content: e.target.value } : n))}
                      className="w-full h-96 p-4 border border-slate-200 resize-none"
                      placeholder="Start typing..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 text-slate-400">
                  <p>Select a note to view</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
