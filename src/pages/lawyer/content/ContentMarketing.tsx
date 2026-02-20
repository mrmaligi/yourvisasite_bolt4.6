import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';

const fetchArticles = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '1', title: '5 Tips for Partner Visa Applicants', status: 'published', views: 150, date: '2023-11-15' },
    { id: '2', title: 'Changes to Skilled Migration 2024', status: 'draft', views: 0, date: '2023-11-28' },
  ];
};

export const ContentMarketing = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['lawyer-articles'],
    queryFn: fetchArticles,
  });

  const statusVariant = {
    published: 'success',
    draft: 'default',
    archived: 'warning',
  } as const;

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Content Marketing</h1>
          <p className="text-neutral-500 mt-1">Write articles to demonstrate expertise</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Write Article
        </Button>
      </div>

      <div className="space-y-4">
        {articles?.map((article) => (
          <Card key={article.id}>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  <FileText className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusVariant[article.status as keyof typeof statusVariant] as any}>
                      {article.status}
                    </Badge>
                    <span className="text-xs text-neutral-500">• {new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {article.status === 'published' && (
                  <div className="text-right text-sm">
                    <p className="font-bold">{article.views}</p>
                    <p className="text-neutral-500 text-xs">Views</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
