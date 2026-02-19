import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import type { ForumCategory, ForumTopic } from '../../types/database';

interface CategoryWithStats extends ForumCategory {
  topic_count: number;
  last_topic?: ForumTopic;
}

export function ForumCategoryList() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Get categories
      const { data: cats } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (!cats) return;

      // Get stats for each category
      const categoriesWithStats = await Promise.all(
        cats.map(async (cat) => {
          const { count } = await supabase
            .from('forum_topics')
            .select('id', { count: 'exact' })
            .eq('category_id', cat.id);

          const { data: lastTopic } = await supabase
            .from('forum_topics')
            .select('title, slug, last_reply_at, author:profiles(full_name)')
            .eq('category_id', cat.id)
            .order('last_reply_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...cat,
            topic_count: count || 0,
            last_topic: lastTopic || undefined,
          };
        })
      );

      setCategories(categoriesWithStats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      MessageSquare,
      Users,
      Briefcase: MessageSquare,
      GraduationCap: MessageSquare,
      Plane: MessageSquare,
      Home: MessageSquare,
      FileText: MessageSquare,
      Clock,
      Trophy: TrendingUp,
    };
    return icons[iconName] || MessageSquare;
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardBody className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = getIcon(category.icon || 'MessageSquare');
        return (
          <Link
            key={category.id}
            to={`/forum/${category.slug}`}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:border-primary-300 dark:group-hover:border-primary-700">
              <CardBody className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors flex items-center gap-2">
                    {category.name}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {category.topic_count} topics
                    </span>
                    {category.last_topic && (
                      <span className="flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3" />
                        {new Date(category.last_topic.last_reply_at || category.last_topic.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
