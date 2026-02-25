import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useChat, useUnreadCount } from '../useChat';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';

// Mock dependencies
vi.mock('../../lib/supabase');
vi.mock('../useAuth');

describe('useChat', () => {
  const mockUser = { id: 'user-123' };
  const mockRole = 'user';
  const bookingId = 'booking-123';

  // Mocks
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(), // Need to return 'this' in beforeEach
  };

  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockIn = vi.fn();
  const mockNeq = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup useAuth mock
    (useAuth as Mock).mockReturnValue({
      user: mockUser,
      role: mockRole,
    });

    // Fix: subscribe must return the channel object for chaining/reference
    mockChannel.subscribe.mockReturnValue(mockChannel);

    // Setup Supabase chain mocks
    (supabase.from as Mock).mockImplementation(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
    }));

    (supabase.channel as Mock).mockReturnValue(mockChannel);
    (supabase.removeChannel as Mock).mockImplementation(vi.fn());

    // Default select chain
    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    // Default eq chain (handles multiple .eq calls)
    mockEq.mockReturnValue({
        order: mockOrder,
        eq: mockEq,
        neq: mockNeq,
    });

    // Default neq chain (for unread count)
    mockNeq.mockResolvedValue({ count: 5, error: null });

    // Default order chain (for fetchMessages)
    mockOrder.mockResolvedValue({ data: [], error: null });

    // Default insert chain
    mockInsert.mockResolvedValue({ error: null });

    // Default update chain
    mockUpdate.mockReturnValue({
        in: mockIn,
    });

    // Default in chain
    mockIn.mockResolvedValue({ error: null });
  });

  it('fetches initial messages on mount', async () => {
    const mockMessages = [
      { id: '1', message_text: 'Hello', created_at: '2023-01-01', sender_id: 'other', is_read: false },
    ];

    mockOrder.mockResolvedValueOnce({ data: mockMessages, error: null });

    const { result } = renderHook(() => useChat(bookingId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(supabase.from).toHaveBeenCalledWith('messages');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('booking_id', bookingId);
  });

  it('handles error during fetch', async () => {
    const error = new Error('Fetch failed');
    mockOrder.mockResolvedValueOnce({ data: null, error });

    const { result } = renderHook(() => useChat(bookingId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
  });

  it('subscribes to real-time changes', async () => {
    const { unmount } = renderHook(() => useChat(bookingId));

    expect(supabase.channel).toHaveBeenCalledWith(`booking-chat-${bookingId}`);
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${bookingId}`,
      }),
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();

    unmount();
    expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('sends a message', async () => {
    const { result } = renderHook(() => useChat(bookingId));

    await act(async () => {
      await result.current.sendMessage('Hello world');
    });

    expect(mockInsert).toHaveBeenCalledWith({
      booking_id: bookingId,
      sender_id: mockUser.id,
      sender_role: mockRole,
      message_text: 'Hello world',
    });
  });

  it('handles error during send message', async () => {
    const error = new Error('Send failed');
    mockInsert.mockResolvedValueOnce({ error });

    const { result } = renderHook(() => useChat(bookingId));

    await expect(result.current.sendMessage('Hello world')).rejects.toThrow(error);

    await waitFor(() => {
        expect(result.current.error).toEqual(error);
    });
  });

  it('marks messages as read', async () => {
    const mockMessages = [
      { id: '1', message_text: 'Hello', sender_id: 'other-user', is_read: false },
      { id: '2', message_text: 'My msg', sender_id: mockUser.id, is_read: false }, // Should ignore own message
      { id: '3', message_text: 'Old msg', sender_id: 'other-user', is_read: true }, // Should ignore read message
    ];

    mockOrder.mockResolvedValueOnce({ data: mockMessages, error: null });

    const { result } = renderHook(() => useChat(bookingId));

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3);
    });

    await act(async () => {
      await result.current.markAsRead();
    });

    expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
    expect(mockIn).toHaveBeenCalledWith('id', ['1']); // Only message 1 should be marked

    // Verify optimistic update
    expect(result.current.messages[0].is_read).toBe(true);
  });
});

describe('useUnreadCount', () => {
    const mockUser = { id: 'user-123' };
    const bookingId = 'booking-123';

    // Mocks
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    };

    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockNeq = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();

      // Setup useAuth mock
      (useAuth as Mock).mockReturnValue({
        user: mockUser,
      });

      // Fix: subscribe must return the channel object
      mockChannel.subscribe.mockReturnValue(mockChannel);

      // Setup Supabase chain mocks
      (supabase.from as Mock).mockImplementation(() => ({
        select: mockSelect,
      }));

      (supabase.channel as Mock).mockReturnValue(mockChannel);
      (supabase.removeChannel as Mock).mockImplementation(vi.fn());

      // Default select chain
      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      // Default eq chain
      mockEq.mockReturnValue({
          eq: mockEq,
          neq: mockNeq,
      });

      // Default neq chain
      mockNeq.mockResolvedValue({ count: 5, error: null });
    });

    it('fetches initial unread count', async () => {
        const { result } = renderHook(() => useUnreadCount(bookingId));

        await waitFor(() => {
            expect(result.current).toBe(5);
        });

        expect(supabase.from).toHaveBeenCalledWith('messages');
        expect(mockSelect).toHaveBeenCalledWith('id', { count: 'exact', head: true });
        expect(mockEq).toHaveBeenCalledWith('booking_id', bookingId);
        expect(mockEq).toHaveBeenCalledWith('is_read', false);
        expect(mockNeq).toHaveBeenCalledWith('sender_id', mockUser.id);
    });

    it('subscribes to updates', async () => {
        const { unmount } = renderHook(() => useUnreadCount(bookingId));

        expect(supabase.channel).toHaveBeenCalledWith(`booking-unread-${bookingId}`);
        expect(mockChannel.subscribe).toHaveBeenCalled();

        unmount();
        expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });
});
