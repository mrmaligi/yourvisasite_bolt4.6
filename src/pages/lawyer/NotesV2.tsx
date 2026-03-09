import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Trash2, Save, FileText } from 'lucide-react';
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
  { id: '1', title: 'Consultation with Sarah', content: 'Discussed partner visa requirements. Client has all documents ready.', clientName: 'Sarah Johnson', updatedAt: '2024-03-20' },
  { id: '2', title: 'Document Review', content: 'Missing form 80 for Michael. Need to follow up.', clientName: 'Michael Chen', updatedAt: '2024-03-19' },
  { id: '3', title: 'General Strategy', content: 'Focus on skilled migration leads this quarter.', updatedAt: '2024-03-15' },
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
        {/* Header - SQUARE */}
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
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Notes List - SQUARE */}
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                      selectedNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-slate-400 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{note.title}</p>
                        {note.clientName && (
                          <Badge variant="secondary" className="mt-1 text-xs">{note.clientName}</Badge>
                        )}
                        <p className="text-xs text-slate-500 mt-1">{note.updatedAt}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Editor - SQUARE */}
            <div className="lg:col-span-2 bg-white border border-slate-200">
              {selectedNote ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => handleUpdateNote('title', e.target.value)}
                      className="text-xl font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                    />
                    <Button variant="danger" size="sm" onClick={() => handleDelete(selectedNote.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-slate-600 mb-1">Client (optional)</label>
                    <input
                      type="text"
                      value={selectedNote.clientName || ''}
                      onChange={(e) => handleUpdateNote('clientName', e.target.value)}
                      placeholder="Add client name..."
                      className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => handleUpdateNote('content', e.target.value)}
                    placeholder="Write your note here..."
                    rows={12}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 outline-none resize-none"
                  />

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-500">Last updated: {selectedNote.updatedAt}</span>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-slate-500">Select a note to view or create a new one</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
