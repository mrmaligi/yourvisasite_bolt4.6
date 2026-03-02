import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Message, UserRole } from '../types/database';
import { useAuth } from './useAuth';

export function useChat(bookingId: string) {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !bookingId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`booking-chat-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT and UPDATE
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, newMessage]);
          } else if (payload.eventType === 'UPDATE') {
              const updatedMessage = payload.new as Message;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
              );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, user]);

  const sendMessage = async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        booking_id: bookingId,
        sender_id: user.id,
        sender_role: role as UserRole,
        message_text: text,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const markAsRead = async () => {
    if (!user) return;

    const unreadIds = messages
        .filter(m => !m.is_read && m.sender_id !== user.id)
        .map(m => m.id);

    if (unreadIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadIds);

      if (error) throw error;

      // Optimistically update local state
      setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, is_read: true } : m));

    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  return { messages, loading, error, sendMessage, markAsRead };
}

export function useUnreadCount(bookingId: string) {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user || !bookingId) return;

        const fetchUnread = async () => {
            const { count, error } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('booking_id', bookingId)
                .eq('is_read', false)
                .neq('sender_id', user.id);

            if (!error && count !== null) {
                setUnreadCount(count);
            }
        };

        fetchUnread();

        const channel = supabase
            .channel(`booking-unread-${bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `booking_id=eq.${bookingId}`,
                },
                () => {
                    // Refresh count on any change
                    fetchUnread();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [bookingId, user]);

    return unreadCount;
}
