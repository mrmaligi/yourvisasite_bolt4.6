import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchSchedule = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', user: 'Jane Doe', shifts: [{ day: 1, type: 'office' }, { day: 2, type: 'court' }, { day: 3, type: 'office' }] },
    { id: '2', user: 'John Smith', shifts: [{ day: 1, type: 'remote' }, { day: 2, type: 'office' }, { day: 3, type: 'leave' }] },
  ];
};

export const TeamSchedule = () => {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ['lawyer-team-schedule'],
    queryFn: fetchSchedule,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Team Schedule</h1>
          <p className="text-neutral-500 mt-1">Coordinate availability and shifts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="font-medium px-2">Nov 20-26</span>
          <Button variant="secondary" size="sm"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-4 pt-2 font-medium text-neutral-500 pl-4 w-48">Member</th>
                {days.map((day) => (
                  <th key={day} className="pb-4 pt-2 font-medium text-neutral-500 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {schedule?.map((row) => (
                <tr key={row.id}>
                  <td className="py-4 pl-4 font-medium text-neutral-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-neutral-500" />
                    </div>
                    {row.user}
                  </td>
                  {days.map((_, i) => {
                    const shift = row.shifts.find(s => s.day === i + 1);
                    return (
                      <td key={i} className="py-4 p-2">
                        {shift && (
                          <div className={`
                            rounded px-2 py-1 text-xs text-center font-medium
                            ${shift.type === 'office' ? 'bg-blue-100 text-blue-700' :
                              shift.type === 'court' ? 'bg-purple-100 text-purple-700' :
                              shift.type === 'remote' ? 'bg-green-100 text-green-700' :
                              'bg-neutral-100 text-neutral-500'}
                          `}>
                            {shift.type.charAt(0).toUpperCase() + shift.type.slice(1)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </motion.div>
  );
};
