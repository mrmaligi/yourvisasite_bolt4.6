import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to subscribe to real-time changes on specified tables.
 * When a change occurs in any of the tables, the callback is triggered.
 *
 * @param tables Array of table names to listen to
 * @param callback Function to call when a change is detected
 */
export function useRealtimeSubscription(tables: string[], callback: () => void) {
  useEffect(() => {
    // Create a unique channel for this subscription
    const channelName = `realtime-${tables.join('-')}-${Math.random()}`;

    const channel = supabase.channel(channelName);

    // Subscribe to each table
    tables.forEach(table => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        () => {
          console.log(`Change detected in ${table}, refreshing data...`);
          callback();
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [JSON.stringify(tables), callback]); // use JSON.stringify to compare arrays by value
}
