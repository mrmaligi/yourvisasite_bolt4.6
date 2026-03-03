import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';

export function QuickCallBanner() {
  const [availableCount, setAvailableCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          
          .from('consultation_slots')
          .select('lawyer_id')
          .eq('is_booked', false)
          .gte('start_time', now);

        if (error) throw error;

        if (data) {
          const uniqueLawyers = new Set(data.map(slot => slot.lawyer_id));
          setAvailableCount(uniqueLawyers.size);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailableCount(0);
      }
    }

    fetchAvailability();
  }, []);

  if (!availableCount || availableCount === 0) return null;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-sm font-medium">
              <span className="font-bold">{availableCount} immigration lawyers</span> are available for a quick call right now.
            </p>
          </div>
          <Link to="/lawyers?filter=available">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent w-full sm:w-auto justify-center">
              <Phone className="w-4 h-4 mr-2" />
              Quick Call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
