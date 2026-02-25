import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  User,
  MoreVertical,
  CheckCircle,
  Clock,
  Search,
  Phone,
  Video,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAgent: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MOCK_CHATS: ChatSession[] = [
  {
    id: 'C-101',
    userId: 'U-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'active',
    lastMessage: 'Thanks for the info!',
    lastMessageTime: '2024-03-15T10:30:00Z',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'U-1', text: 'Hi, I need help with my visa application.', timestamp: '2024-03-15T10:25:00Z', isAgent: false },
      { id: 'm2', senderId: 'A-1', text: 'Hello John, sure! What seems to be the issue?', timestamp: '2024-03-15T10:26:00Z', isAgent: true },
      { id: 'm3', senderId: 'U-1', text: 'I cannot find the document upload section.', timestamp: '2024-03-15T10:27:00Z', isAgent: false },
      { id: 'm4', senderId: 'A-1', text: 'It is under the "My Documents" tab in your dashboard.', timestamp: '2024-03-15T10:28:00Z', isAgent: true },
      { id: 'm5', senderId: 'U-1', text: 'Thanks for the info!', timestamp: '2024-03-15T10:30:00Z', isAgent: false },
    ]
  },
  {
    id: 'C-102',
    userId: 'U-2',
    userName: 'Sarah Smith',
    userEmail: 'sarah@example.com',
    status: 'waiting',
    lastMessage: 'Is anyone there?',
    lastMessageTime: '2024-03-15T10:35:00Z',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'U-2', text: 'Hello?', timestamp: '2024-03-15T10:32:00Z', isAgent: false },
      { id: 'm2', senderId: 'U-2', text: 'Is anyone there?', timestamp: '2024-03-15T10:35:00Z', isAgent: false },
    ]
  },
  {
    id: 'C-103',
    userId: 'U-3',
    userName: 'Mike Brown',
    userEmail: 'mike@example.com',
    status: 'closed',
    lastMessage: 'Goodbye.',
    lastMessageTime: '2024-03-14T15:00:00Z',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'U-3', text: 'My issue is resolved.', timestamp: '2024-03-14T14:55:00Z', isAgent: false },
      { id: 'm2', senderId: 'A-1', text: 'Great to hear! Have a nice day.', timestamp: '2024-03-14T14:58:00Z', isAgent: true },
      { id: 'm3', senderId: 'U-3', text: 'Goodbye.', timestamp: '2024-03-14T15:00:00Z', isAgent: false },
    ]
  }
];

export function LiveChat() {
  const { toast } = useToast();
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'A-1', // Agent ID
      text: inputText,
      timestamp: new Date().toISOString(),
      isAgent: true
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: inputText,
          lastMessageTime: newMessage.timestamp,
          status: 'active' // Ensure chat is active if agent replies
        } as ChatSession;
      }
      return chat;
    });

    setChats(updatedChats);
    setInputText('');
  };

  const handleCloseChat = () => {
    if (!activeChatId) return;

    const updatedChats = chats.map(chat =>
      chat.id === activeChatId ? { ...chat, status: 'closed' } as ChatSession : chat
    );

    setChats(updatedChats);
    toast('success', 'Chat session closed');
  };

  const filteredChats = chats.filter(chat =>
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Live Chat</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Real-time support dashboard</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Chat List Sidebar */}
        <Card className="w-1/3 flex flex-col min-w-[300px]">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-4 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                  activeChatId === chat.id ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold text-sm ${activeChatId === chat.id ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-900 dark:text-white'}`}>
                    {chat.userName}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate mb-2">{chat.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={
                    chat.status === 'active' ? 'success' :
                    chat.status === 'waiting' ? 'warning' : 'secondary'
                  } className="text-[10px] px-1.5 py-0.5 h-5">
                    {chat.status}
                  </Badge>
                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Chat Window */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-neutral-900 dark:text-white">{activeChat.userName}</h2>
                    <p className="text-xs text-neutral-500">{activeChat.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeChat.status !== 'closed' && (
                    <Button variant="secondary" size="sm" onClick={handleCloseChat} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-1" /> End Chat
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900/50">
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAgent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.isAgent
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.isAgent ? 'text-primary-100' : 'text-neutral-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {activeChat.status === 'closed' && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                      This chat session has ended.
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 shrink-0">
                <form
                  onSubmit={handleSendMessage}
                  className={`flex gap-2 ${activeChat.status === 'closed' ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={activeChat.status === 'closed' ? "Chat is closed" : "Type a message..."}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                  <Button type="submit" disabled={!inputText.trim() || activeChat.status === 'closed'}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 p-8 text-center">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Select a Conversation</h3>
              <p className="max-w-xs">Choose a chat from the sidebar to start messaging with a user.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
