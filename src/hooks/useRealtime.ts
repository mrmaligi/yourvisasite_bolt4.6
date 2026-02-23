import { useEffect, useState, useRef } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';

interface UseRealtimeOptions<T> {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  filter?: string; // e.g., "column=eq.value"
  enabled?: boolean;
  fetchRow?: (id: string) => Promise<T | null>; // Function to fetch full row data (e.g. with joins)
}

export function useRealtime<T extends { id: string }>(
  tableName: string,
  initialData: T[] = [],
  options: UseRealtimeOptions<T> = {}
) {
  const [data, setData] = useState<T[]>(initialData);
  const { toast } = useToast();

  const {
    event = '*',
    schema = 'public',
    filter,
    enabled = true,
    fetchRow
  } = options;

  // Use refs for callback and filter to avoid re-subscribing on every render if they are not stable
  const fetchRowRef = useRef(fetchRow);

  useEffect(() => {
    fetchRowRef.current = fetchRow;
  }, [fetchRow]);

  // Update local state when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `public:${tableName}:${filter || 'all'}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table: tableName,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          handleRealtimeEvent(payload);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          // Subscription active
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Realtime error for ${tableName}:`, err);
          toast('error', `Failed to connect to real-time updates for ${tableName}`);
        } else if (status === 'TIMED_OUT') {
           console.error(`Realtime timeout for ${tableName}`);
           toast('error', `Real-time updates connection timed out for ${tableName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, event, schema, filter, enabled]); // re-subscribe if key params change

  const handleRealtimeEvent = async (payload: RealtimePostgresChangesPayload<any>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'DELETE') {
      setData((currentData) => currentData.filter((item) => item.id !== oldRecord.id));
      return;
    }

    // For INSERT and UPDATE, we might need to fetch the full row if a fetcher is provided
    let recordToUpsert: T | null = newRecord as T;
    const fetcher = fetchRowRef.current;

    if (fetcher && newRecord?.id) {
      try {
        const fetched = await fetcher(newRecord.id);
        if (fetched) {
          recordToUpsert = fetched;
        }
      } catch (error) {
        console.error('Error fetching updated row:', error);
      }
    }

    if (!recordToUpsert) return;

    setData((currentData) => {
      if (eventType === 'INSERT') {
        // Check if already exists to avoid duplicates
        if (currentData.some((item) => item.id === recordToUpsert!.id)) {
          return currentData;
        }
        return [recordToUpsert!, ...currentData];
      }

      if (eventType === 'UPDATE') {
        return currentData.map((item) =>
          item.id === recordToUpsert!.id ? { ...item, ...recordToUpsert! } : item
        );
      }

      return currentData;
    });
  };

  return data;
}
