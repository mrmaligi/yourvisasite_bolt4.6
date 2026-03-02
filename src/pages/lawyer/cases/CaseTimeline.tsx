import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const fetchTimeline = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Partner Visa', client: 'Alice Smith', start: '2023-11-01', end: '2023-11-15', color: 'bg-blue-500' },
    { id: '2', title: 'Review Documents', client: 'Bob Jones', start: '2023-11-05', end: '2023-11-08', color: 'bg-green-500' },
    { id: '3', title: 'Hearing Prep', client: 'Charlie Brown', start: '2023-11-10', end: '2023-11-12', color: 'bg-red-500' },
  ];
};

export const CaseTimeline = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['lawyer-case-timeline'],
    queryFn: fetchTimeline,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  // Mock days
  const days = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Timeline</h1>
          <p className="text-neutral-500 mt-1">Schedule and deadlines</p>
        </div>
        <div className="flex gap-2">
          <Link to="/lawyer/cases">
            <Button variant="secondary">List View</Button>
          </Link>
          <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button className="p-2 hover:bg-neutral-50 rounded-l-lg"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 text-sm font-medium">November 2023</span>
            <button className="p-2 hover:bg-neutral-50 rounded-r-lg"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                <div className="w-48 p-4 font-medium text-sm border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 sticky left-0 z-10">
                  Case / Task
                </div>
                <div className="flex-1 grid grid-cols-14">
                  {days.map((day) => (
                    <div key={day} className="p-4 text-center border-r border-neutral-100 dark:border-neutral-800 last:border-0">
                      <span className="text-xs font-medium text-neutral-500">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {events?.map((event) => (
                  <div key={event.id} className="flex group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="w-48 p-4 text-sm font-medium border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 sticky left-0 z-10 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/50">
                      <div className="truncate">{event.title}</div>
                      <div className="text-xs text-neutral-500 truncate">{event.client}</div>
                    </div>
                    <div className="flex-1 grid grid-cols-14 relative py-4">
                      {/* Grid lines */}
                      {days.map((day) => (
                        <div key={day} className="border-r border-neutral-100 dark:border-neutral-800 last:border-0 h-full absolute top-0 bottom-0" style={{ left: `${(day-1) * (100/14)}%`, width: `${100/14}%` }} />
                      ))}

                      {/* Bar - Mock positioning */}
                      <div
                        className={`absolute top-2 bottom-2 rounded-md ${event.color} opacity-80 hover:opacity-100 cursor-pointer shadow-sm`}
                        style={{
                          left: `${(parseInt(event.start.split('-')[2]) - 1) * (100/14)}%`,
                          width: `${(parseInt(event.end.split('-')[2]) - parseInt(event.start.split('-')[2]) + 1) * (100/14)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
