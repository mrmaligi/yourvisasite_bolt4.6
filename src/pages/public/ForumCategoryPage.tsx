import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ForumTopicList } from '../../components/forum/ForumTopicList';
import { ForumNewTopic } from '../../components/forum/ForumNewTopic';
import { Card, CardBody } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { supabase } from '../../lib/supabase';
import type { ForumCategory } from '../../types/database';

export function ForumCategoryPage() {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [activeTab, setActiveTab] = useState('topics');

  useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('slug', categorySlug)
        .single();

      setCategory(data);
    };

    fetchCategory();
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardBody className="h-32">
              <div className="h-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/forum"
          className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Forum
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {category.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {category.description}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="topics" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="new">New Topic</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="topics">
            <ForumTopicList />
          </TabsContent>

          <TabsContent value="new">
            <ForumNewTopic />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
