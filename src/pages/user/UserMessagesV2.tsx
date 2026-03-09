import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserMessagesV2() {
  const conversations = [
    { id: 1, name: 'Jane Smith', lastMessage: 'Thanks for your help!', time: '10 min ago', unread: 2 },
    { id: 2, name: 'Support Team', lastMessage: 'How can we help you today?', time: '2 hours ago', unread: 0 },
    { id: 3, name: 'Bob Wilson', lastMessage: 'I will review your documents', time: '1 day ago', unread: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-600">Communicate with your team</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Conversations</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-4 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-600">{conv.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{conv.name}</p>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center">{conv.unread}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-slate-400">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-600">J</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Jane Smith</p>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 max-w-[70%]">
                    <p className="text-slate-700">Hi! How can I help you today?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 max-w-[70%]">
                    <p>I have a question about my visa application.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 border border-slate-200" />
                <Button variant="primary">
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
