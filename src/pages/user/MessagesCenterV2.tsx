import { MessageSquare, Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export function UserMessagesV2() {
  const [selectedChat, setSelectedChat] = useState(1);
  
  const chats = [
    { id: 1, name: 'Jane Smith (Lawyer)', lastMessage: 'I will review your documents today', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Support Team', lastMessage: 'How can we help you?', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'John Doe', lastMessage: 'Thanks for the update', time: 'Mar 18', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'them', text: 'Hi! I received your documents.', time: '10:25 AM' },
    { id: 2, sender: 'me', text: 'Great! Let me know if you need anything else.', time: '10:28 AM' },
    { id: 3, sender: 'them', text: 'I will review your documents today and get back to you with any questions.', time: '10:30 AM' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-4 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="bg-white border border-slate-200 flex h-[600px]">
          {/* Chat List */}
          <div className="w-80 border-r border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <input type="text" placeholder="Search messages..." className="w-full px-3 py-2 border border-slate-200" />
            </div>
            
            <div className="divide-y divide-slate-200">
              {chats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 cursor-pointer ${selectedChat === chat.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900">{chat.name}</span>
                    <span className="text-xs text-slate-400">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 truncate">{chat.lastMessage}</span>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">J</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Jane Smith (Lawyer)</p>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 ${
                    msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-3 py-2 border border-slate-200"
                />
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-600 text-white">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
