import { Inbox, Send, Trash2, Star, Archive, Search } from 'lucide-react';
import { useState } from 'react';

export function LawyerInboxV2() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  
  const emails = [
    { id: 1, from: 'John Doe', subject: 'Question about documents', preview: 'Hi, I have a question about...', time: '10:30 AM', unread: true },
    { id: 2, from: 'Jane Smith', subject: 'Appointment confirmation', preview: 'Your appointment is confirmed...', time: '9:15 AM', unread: false },
    { id: 3, from: 'Support', subject: 'System update', preview: 'We have updated our system...', time: 'Yesterday', unread: false },
  ];

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 3 },
    { id: 'starred', name: 'Starred', icon: Star, count: 0 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-4 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-white">Inbox</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="bg-white border border-slate-200 flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200 p-4">
            <button className="w-full py-3 bg-blue-600 text-white mb-4">Compose</button>
            
            <nav className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left ${
                    selectedFolder === folder.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <folder.icon className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </div>
                  {folder.count > 0 && <span className="text-sm">{folder.count}</span>}
                </button>
              ))}
            </nav>
          </div>

          {/* Email List */}
          <div className="flex-1">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search emails..." className="w-full pl-10 pr-3 py-2 border border-slate-200" />
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {emails.map((email) => (
                <div key={email.id} className={`p-4 hover:bg-slate-50 cursor-pointer ${email.unread ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className={`${email.unread ? 'font-semibold' : 'font-medium'} text-slate-900`}>{email.from}</p>
                    <span className="text-sm text-slate-400">{email.time}</span>
                  </div>
                  
                  <p className={`font-medium ${email.unread ? 'text-slate-900' : 'text-slate-600'}`}>{email.subject}</p>
                  <p className="text-sm text-slate-500 truncate">{email.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
