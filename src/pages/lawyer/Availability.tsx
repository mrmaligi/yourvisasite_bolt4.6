import { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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

  useEffect(() => {
    if (!profile) return;
    supabase
      .schema('lawyer')
      .from('profiles')
      .select('id')
      .eq('profile_id', profile.id)
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
    const { data } = await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .select('*')
      .eq('lawyer_id', lid)
      .order('start_time');
    setSlots(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!lawyerId || !startTime || !endTime) return;
    setSaving(true);
    const { error } = await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .insert({ lawyer_id: lawyerId, start_time: startTime, end_time: endTime });
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
    await supabase.schema('lawyer').from('consultation_slots').delete().eq('id', id);
    toast('success', 'Slot removed');
    fetchSlots(lawyerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Availability</h1>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Start Time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <Input label="End Time" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleAdd}>Save Slot</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-neutral-200 rounded-xl" />)}
        </div>
      ) : slots.length === 0 ? (
        <EmptyState icon={Calendar} title="No availability slots" description="Add time slots when you are available for consultations." />
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <Card key={slot.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}
                  </p>
                  <Badge variant={slot.is_booked ? 'danger' : 'success'} className="mt-1">
                    {slot.is_booked ? 'Booked' : 'Available'}
                  </Badge>
                </div>
                {!slot.is_booked && (
                  <button onClick={() => handleDelete(slot.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
