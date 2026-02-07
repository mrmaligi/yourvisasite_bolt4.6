import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderOpen, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardBody } from '../../components/ui/Card';
import type { NewsArticle } from '../../types/database';

export function UserDashboard() {
  const { profile } = useAuth();
  const [counts, setCounts] = useState({ purchases: 0, documents: 0, bookings: 0, submissions: 0 });
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      supabase.from('user_visa_purchases').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('user_documents').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      supabase.from('tracker_entries').select('id', { count: 'exact', head: true }).eq('submitted_by', profile.id),
    ]).then(([purchases, docs, bookings, submissions]) => {
      setCounts({
        purchases: purchases.count || 0,
        documents: docs.count || 0,
        bookings: bookings.count || 0,
        submissions: submissions.count || 0,
      });
    });

    supabase
      .from('news_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setNews(data || []));
  }, [profile]);

  const statCards = [
    { label: 'Visas Unlocked', value: counts.purchases, icon: FileText, to: '/dashboard/visas' },
    { label: 'Documents', value: counts.documents, icon: FolderOpen, to: '/dashboard/documents' },
    { label: 'Consultations', value: counts.bookings, icon: Calendar, to: '/dashboard/consultations' },
    { label: 'Tracker Submissions', value: counts.submissions, icon: TrendingUp, to: '/tracker' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="text-neutral-500 mt-1">Here is an overview of your immigration journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card hover>
              <CardBody className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {news.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Latest Immigration News</h2>
          <div className="space-y-3">
            {news.map((article) => (
              <Card key={article.id} hover className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">{article.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {article.published_at && new Date(article.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
