import { MessageSquare, Send, Search, Paperclip } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LawyerMessagesV2() {
  const conversations = [
    { id: 1, name: 'John Doe', lastMessage: 'Thank you for your help!', time: '10 min ago', unread: 2 },
    { id: 2, name: 'Jane Smith', lastMessage: 'When is the next meeting?', time: '1 hour ago', unread: 0 },
    { id: 3, name: 'Bob Wilson', lastMessage: 'Documents uploaded', time: '2 hours ago', unread: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-slate-400">Communicate with your clients</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 flex h-[600px]">
          <div className="w-80 border-r border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 border border-slate-200 text-sm" />
              </div>
            </div>
            
            <div className="divide-y divide-slate-200">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-4 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900">{conv.name}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center">{conv.unread}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-slate-400">{conv.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <p className="font-semibold text-slate-900">John Doe</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 max-w-[70%]">
                    <p className="text-slate-700">Hi, I have a question about my application.</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 max-w-[70%]">
                    <p>Sure, what would you like to know?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 border border-slate-200" />
                <Button variant="primary" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
