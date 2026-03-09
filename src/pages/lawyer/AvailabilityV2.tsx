import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const MOCK_SLOTS: TimeSlot[] = [
  { id: '1', date: '2024-03-25', startTime: '09:00', endTime: '10:00', isBooked: true },
  { id: '2', date: '2024-03-25', startTime: '10:00', endTime: '11:00', isBooked: false },
  { id: '3', date: '2024-03-25', startTime: '14:00', endTime: '15:00', isBooked: false },
  { id: '4', date: '2024-03-26', startTime: '09:00', endTime: '10:00', isBooked: false },
];

export function AvailabilityV2() {
  const [slots] = useState<TimeSlot[]>(MOCK_SLOTS);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showAdd, setShowAdd] = useState(false);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const filteredSlots = selectedDate 
    ? slots.filter(s => s.date === selectedDate.toISOString().split('T')[0])
    : slots;

  const stats = {
    total: slots.length,
    available: slots.filter(s => !s.isBooked).length,
    booked: slots.filter(s => s.isBooked).length,
  };

  return (
    <>
      <Helmet>
        <title>Availability | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
                <p className="text-slate-600">Manage your consultation schedule</p>
              </div>
              <Button variant="primary" onClick={() => setShowAdd(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Slots', value: stats.total, icon: CalendarIcon },
              { label: 'Available', value: stats.available, icon: Clock, color: 'text-green-600' },
              { label: 'Booked', value: stats.booked, icon: Clock, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAdd && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Time Slot</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input type="date" className="px-3 py-2 border border-slate-200" />
                <input type="time" className="px-3 py-2 border border-slate-200" />
                <input type="time" className="px-3 py-2 border border-slate-200" />
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Add Slot</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold text-slate-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className="py-2 text-slate-500">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                  const isSelected = selectedDate?.getDate() === i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`aspect-square flex items-center justify-center text-sm ${
                        isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Time Slots</h2>
              
              <div className="space-y-3">
                {filteredSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{slot.startTime} - {slot.endTime}</span>
                      <Badge variant={slot.isBooked ? 'primary' : 'success'}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </Badge>
                    </div>
                    
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {filteredSlots.length === 0 && (
                  <p className="text-center text-slate-500 py-8">No slots for this date</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
