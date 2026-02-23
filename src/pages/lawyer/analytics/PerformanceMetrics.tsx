import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Clock, Star, ThumbsUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchPerformance = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    kpis: [
      { label: 'Client Satisfaction', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
      { label: 'Avg Resolution Time', value: '3 weeks', icon: Clock, color: 'text-blue-500' },
      { label: 'Conversion Rate', value: '65%', icon: Target, color: 'text-red-500' },
      { label: 'Referral Rate', value: '30%', icon: ThumbsUp, color: 'text-green-500' },
    ],
    skills: [
      { subject: 'Communication', A: 120, fullMark: 150 },
      { subject: 'Responsiveness', A: 98, fullMark: 150 },
      { subject: 'Expertise', A: 140, fullMark: 150 },
      { subject: 'Empathy', A: 90, fullMark: 150 },
      { subject: 'Value', A: 110, fullMark: 150 },
      { subject: 'Timeliness', A: 100, fullMark: 150 },
    ],
  };
};

export const PerformanceMetrics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lawyer-analytics-performance'],
    queryFn: fetchPerformance,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Performance Metrics</h1>
          <p className="text-neutral-500 mt-1">Track your professional KPIs</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {data?.kpis.map((stat, i) => (
          <Card key={i}>
            <CardBody className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <h2 className="text-lg font-semibold">Skill Radar (Based on Reviews)</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.skills}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="h-[400px]">
          <CardHeader>
            <h2 className="text-lg font-semibold">Goals</h2>
          </CardHeader>
          <CardBody className="space-y-4">
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="font-medium">Monthly Revenue Target ($20k)</span>
                 <span>75%</span>
               </div>
               <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-3/4" />
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="font-medium">Client Acquisition (10 new)</span>
                 <span>50%</span>
               </div>
               <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-1/2" />
               </div>
             </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};
