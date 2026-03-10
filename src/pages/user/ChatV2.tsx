import { MessageSquare, Send, Paperclip, Smile } from 'lucide-react';
import { useState } from 'react';

export function ChatV2() {
  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, sender: 'them', text: 'Hi! How can I help you with your visa application today?', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'I have a question about the partner visa requirements.', time: '10:02 AM' },
    { id: 3, sender: 'them', text: 'Sure! What specific requirement are you curious about?', time: '10:03 AM' },
    { id: 4, sender: 'me', text: 'Do I need to be married to apply for a partner visa?', time: '10:05 AM' },
    { id: 5, sender: 'them', text: 'No, you don\'t need to be married. You can apply as a de facto partner if you\'ve been living together for 12 months or more.', time: '10:06 AM' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-4 px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
            <span className="font-bold text-blue-600">J</span>
          </div>
          
          <div>
            <p className="text-white font-medium">Jane Smith</p>
            <p className="text-slate-400 text-sm">Migration Lawyer • Online</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 h-[500px] overflow-y-auto p-4 space-y-4 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 ${
                msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
  );
}
