import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AvailabilityV2() {
  const { profile } = useAuth();
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('lawyer_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLawyerId(data.id);
          fetchSlots(data.id);
        }
      });
  }, [profile]);

  const fetchSlots = async (id: string) => {
    const { data } = await supabase
      .from('consultation_slots')
      .select('*')
      .eq('lawyer_id', id)
      .order('start_time', { ascending: true });
    
    setSlots(data || []);
    setLoading(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <>
      <Helmet>
        <title>Availability | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
                <p className="text-slate-600">Manage your consultation schedule</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar - SQUARE */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 border border-slate-200 hover:bg-slate-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-2 border border-slate-200 hover:bg-slate-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">{day}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                  <button
                    key={i}
                    className="aspect-square border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                  >
                    <span className="text-slate-700">{(i % 31) + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slots List - SQUARE */}
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Available Slots</h3>
              </div>
              
              <div className="divide-y divide-slate-200">
                {loading ? (
                  <div className="p-4 text-center text-slate-500">Loading...</div>
                ) : slots.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">No slots added yet</div>
                ) : (
                  slots.map((slot) => (
                    <div key={slot.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(slot.start_time).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={slot.is_booked ? 'danger' : 'success'}>
                        {slot.is_booked ? 'Booked' : 'Available'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
