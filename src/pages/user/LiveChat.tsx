import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, User, Bot, Paperclip } from 'lucide-react';
import { UserDashboardLayout } from '@/components/layout/UserDashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'agent', timestamp: new Date(Date.now() - 60000) }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. An agent will be with you shortly.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <UserDashboardLayout>
      <Helmet>
        <title>Live Chat | VisaBuild</title>
      </Helmet>

      <div className="h-[calc(100vh-8rem)] max-h-[800px] flex flex-col">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Live Support</h1>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <Bot className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  )}
                </div>

                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-tl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-primary-200' : 'text-neutral-400'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="px-2">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!inputText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
