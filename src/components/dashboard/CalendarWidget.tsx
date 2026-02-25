import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type?: 'consultation' | 'deadline' | 'other';
}

interface CalendarWidgetProps {
  events: CalendarEvent[];
  className?: string;
}

export function CalendarWidget({ events, className = '' }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-7 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-medium text-neutral-400 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const now = new Date();
            const isToday =
              day === now.getDate() &&
              currentDate.getMonth() === now.getMonth() &&
              currentDate.getFullYear() === now.getFullYear();

            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative cursor-pointer transition-colors
                  ${isToday ? 'bg-primary-50 text-primary-600 font-bold dark:bg-primary-900/20 dark:text-primary-400' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}
                `}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                )}

                {/* Tooltip for events */}
                {hoveredDay === day && dayEvents.length > 0 && (
                  <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 text-left">
                    {dayEvents.map((e, idx) => (
                      <div key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 mb-1 last:mb-0 truncate flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {e.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
