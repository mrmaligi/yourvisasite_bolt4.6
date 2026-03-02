import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, FileText, Download, Calendar } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchReports = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', name: 'Monthly Revenue Report', type: 'Financial', generated: 'Nov 1, 2023' },
    { id: '2', name: 'Client Acquisition Analysis', type: 'Marketing', generated: 'Oct 31, 2023' },
    { id: '3', name: 'Case Efficiency Metrics', type: 'Performance', generated: 'Weekly' },
  ];
};

export const CustomReports = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['lawyer-reports'],
    queryFn: fetchReports,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports</h1>
          <p className="text-neutral-500 mt-1">Generate insights and exports</p>
        </div>
        <Button>
          <BarChart className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports?.map((report) => (
          <Card key={report.id} className="hover:border-primary-300 transition-colors cursor-pointer">
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{report.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{report.type} Report</p>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-xs text-neutral-400">
                <Calendar className="w-3 h-3" />
                Last generated: {report.generated}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
