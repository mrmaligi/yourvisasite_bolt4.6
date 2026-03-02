import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Send, User, MessageSquare, Phone, MoreVertical } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchConversations = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      client: 'Alice Smith',
      lastMessage: 'Thanks for the update!',
      time: '10:30 AM',
      unread: 2,
    },
    {
      id: '2',
      client: 'Bob Jones',
      lastMessage: 'When is the next hearing?',
      time: 'Yesterday',
      unread: 0,
    },
  ];
};

export const ClientCommunication = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['lawyer-communications'],
    queryFn: fetchConversations,
  });

  const handleSendMessage = () => {
    setMessage('');
    // Simulate send
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-12rem)] flex gap-6"
    >
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations?.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveChat(conv.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeChat === conv.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 border'
                  : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-neutral-900 dark:text-white">{conv.client}</span>
                <span className="text-xs text-neutral-400">{conv.time}</span>
              </div>
              <p className="text-sm text-neutral-500 truncate">{conv.lastMessage}</p>
              {conv.unread > 0 && (
                <div className="mt-2 flex justify-end">
                  <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {conv.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                  AS
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Alice Smith</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50/30 dark:bg-neutral-900/30">
              <div className="flex justify-start">
                <div className="bg-white dark:bg-neutral-700 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%]">
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">Hi, I have a question about my documents.</p>
                  <span className="text-[10px] text-neutral-400 block mt-1">10:28 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[70%]">
                  <p className="text-sm">Sure, happy to help. What's on your mind?</p>
                  <span className="text-[10px] text-primary-200 block mt-1">10:29 AM</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!message} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">Select a conversation</h3>
            <p className="text-sm">Choose a client from the list to start messaging.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
