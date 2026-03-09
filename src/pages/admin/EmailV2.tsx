import { Mail, Send, Inbox, Star, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminEmailV2() {
  const emails = [
    { id: 1, from: 'john@example.com', subject: 'Question about visa', preview: 'Hi, I have a question...', time: '10:00 AM', unread: true },
    { id: 2, from: 'jane@example.com', subject: 'Document submission', preview: 'I have uploaded the...', time: '9:30 AM', unread: false },
    { id: 3, from: 'support@visabuild.com', subject: 'Weekly report', preview: 'Here is the weekly...', time: 'Yesterday', unread: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Email</h1>
          <p className="text-slate-400">Manage communications</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 flex h-[600px]">
          <div className="w-64 border-r border-slate-200 p-4">
            <Button variant="primary" className="w-full mb-4">
              <Send className="w-4 h-4 mr-2" />
              Compose
            </Button>
            
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left bg-blue-50 text-blue-700">
                <Inbox className="w-4 h-4" /> Inbox
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50">
                <Star className="w-4 h-4" /> Starred
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50">
                <Send className="w-4 h-4" /> Sent
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50">
                <Trash2 className="w-4 h-4" /> Trash
              </button>
            </nav>
          </div>

          <div className="flex-1">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search emails..." className="w-full pl-9 pr-3 py-2 border border-slate-200" />
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {emails.map((email) => (
                <div key={email.id} className={`p-4 hover:bg-slate-50 cursor-pointer ${email.unread ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-medium ${email.unread ? 'text-slate-900' : 'text-slate-600'}`}>{email.from}</p>
                    <span className="text-sm text-slate-400">{email.time}</span>
                  </div>
                  
                  <p className="font-medium text-slate-900">{email.subject}</p>
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
