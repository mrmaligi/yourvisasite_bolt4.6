import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Megaphone, TrendingUp, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchAds = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: 'Sponsored Listing - Sydney', status: 'active', impressions: 5000, clicks: 120, cost: 500 },
    { id: '2', title: 'Featured Lawyer - Partner Visas', status: 'ended', impressions: 12000, clicks: 350, cost: 1200 },
  ];
};

export const Advertising = () => {
  const { data: ads, isLoading } = useQuery({
    queryKey: ['lawyer-ads'],
    queryFn: fetchAds,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Advertising</h1>
          <p className="text-neutral-500 mt-1">Promote your profile to get more clients</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Ad
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {ads?.map((ad) => (
          <Card key={ad.id}>
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <Megaphone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{ad.title}</h3>
                    <Badge variant={ad.status === 'active' ? 'success' : 'default'} className="mt-1">
                      {ad.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-neutral-100 dark:border-neutral-700 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{ad.impressions.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">Impressions</p>
                </div>
                <div className="text-center border-l border-r border-neutral-100 dark:border-neutral-800">
                  <p className="text-lg font-bold">{ad.clicks}</p>
                  <p className="text-xs text-neutral-500">Clicks</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">${ad.cost}</p>
                  <p className="text-xs text-neutral-500">Spend</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">Analytics</Button>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
