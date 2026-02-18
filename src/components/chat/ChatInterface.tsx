import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/Button';

interface ChatInterfaceProps {
  bookingId: string;
}

export function ChatInterface({ bookingId }: ChatInterfaceProps) {
  const { messages, loading, error, sendMessage, markAsRead } = useChat(bookingId);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading) {
       scrollToBottom();
    }
  }, [messages, loading]);

  // Mark as read when messages load or update
  useEffect(() => {
    if (messages.length > 0) {
        markAsRead();
    }
  }, [messages.length, markAsRead]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Optimistically clear input
    const text = inputText;
    setInputText('');

    setIsSending(true);
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setInputText(text); // Restore on error
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-neutral-50 rounded-lg border border-neutral-200">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
        Failed to load messages. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden shadow-inner">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400">
             <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
             <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-neutral-200">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            disabled={isSending}
          />
          <Button type="submit" disabled={!inputText.trim() || isSending} size="sm" className="px-3">
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
