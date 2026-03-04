import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import type { ConsultationSlot } from '../../types/database';

export function Availability() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [saving, setSaving] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

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
        } else {
          setLoading(false);
        }
      });
  }, [profile]);

  const fetchSlots = async (lid: string) => {
    const { data, error } = await supabase
      .from('consultation_slots')
      .select('*')
      .eq('lawyer_id', lid)
      .order('start_time');
    
    if (error) {
      console.error('Error fetching slots:', error);
      toast('error', 'Failed to load availability');
    } else {
      setSlots(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showAdd && selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(17, 0, 0, 0);

      const format = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setStartTime(format(start));
      setEndTime(format(end));
    }
  }, [showAdd, selectedDate]);

  const handleAdd = async () => {
    if (!lawyerId || !startTime || !endTime) return;

    if (new Date(startTime) >= new Date(endTime)) {
      toast('error', 'End time must be after start time');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('consultation_slots')
      .insert({
        lawyer_id: lawyerId,
        start_time: startTime,
        end_time: endTime,
        is_booked: false
      });
    
    setSaving(false);
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'Slot added');
      setShowAdd(false);
      setStartTime('');
      setEndTime('');
      fetchSlots(lawyerId);
    }
  };

  const handleDelete = async (id: string) => {
    if (!lawyerId) return;
    
    const { error } = await supabase
      .from('consultation_slots')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast('error', error.message);
    } else {
      toast('success', 'Slot deleted');
      fetchSlots(lawyerId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Availability</h1>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-xs font-medium text-neutral-500 py-2">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  const hasSlots = slots.some(s => isSameDay(new Date(s.start_time), date));

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all
                        ${isSelected ? 'bg-primary-600 text-white shadow-md' : 'hover:bg-neutral-50 text-neutral-900'}
                        ${isToday && !isSelected ? 'bg-primary-50 text-primary-700 font-semibold ring-1 ring-inset ring-primary-200' : ''}
                      `}
                    >
                      <span className="text-sm">{i + 1}</span>
                      {hasSlots && (
                        <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Side Panel for Slots */}
        <div className="lg:col-span-1 space-y-4">
          {showAdd && (
            <Card>
              <CardBody className="space-y-4">
                <h3 className="font-semibold text-neutral-900">Add Availability</h3>
                <div className="space-y-3">
                  <Input label="Start" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  <Input label="End" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button size="sm" loading={saving} onClick={handleAdd}>Save</Button>
                </div>
              </CardBody>
            </Card>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900">
              {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'All Slots'}
            </h3>

            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-neutral-200 rounded-xl" />)}
              </div>
            ) : slots.length === 0 ? (
              <EmptyState icon={CalendarIcon} title="No slots" description="Add availability slots." />
            ) : (
              <div className="space-y-3">
                {slots
                  .filter(slot => !selectedDate || isSameDay(new Date(slot.start_time), selectedDate))
                  .map((slot) => (
                  <Card key={slot.id}>
                    <CardBody className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">
                          {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Badge variant={slot.is_booked ? 'danger' : 'success'} className="mt-1 text-xs">
                          {slot.is_booked ? 'Booked' : 'Available'}
                        </Badge>
                      </div>
                      {!slot.is_booked && (
                        <button onClick={() => handleDelete(slot.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </CardBody>
                  </Card>
                ))}
                {slots.filter(slot => !selectedDate || isSameDay(new Date(slot.start_time), selectedDate)).length === 0 && (
                  <div className="text-center py-8 text-neutral-500 text-sm bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                    No slots for this date
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
