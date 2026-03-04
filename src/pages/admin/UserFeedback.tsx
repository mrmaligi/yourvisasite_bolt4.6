import { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

interface FeedbackItem {
  id: string;
  user_id: string;
  user_name: string;
  user_role: 'user' | 'lawyer';
  rating: number;
  category: 'platform' | 'service' | 'content' | 'lawyer';
  comment: string;
  status: 'new' | 'reviewed' | 'addressed';
  created_at: string;
}

export function UserFeedback() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    newCount: 0,
    addressedCount: 0,
  });
  const [ratingData, setRatingData] = useState<any[]>([]);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const avgRating =
        total > 0
          ? (data?.reduce((sum, f) => sum + f.rating, 0) || 0) / total
          : 0;
      const newCount = data?.filter((f) => f.status === 'new').length || 0;
      const addressedCount =
        data?.filter((f) => f.status === 'addressed').length || 0;

      setStats({
        averageRating: Math.round(avgRating * 10) / 10,
        totalFeedback: total,
        newCount,
        addressedCount,
      });

      // Rating distribution
      const ratings: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data?.forEach((f) => {
        ratings[f.rating] = (ratings[f.rating] || 0) + 1;
      });
      setRatingData(
        Object.entries(ratings).map(([rating, count]) => ({
          rating: `${rating} ★`,
          count,
        }))
      );
    } catch (error) {
      toast('error', 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (id: string, status: FeedbackItem['status']) => {
    try {
      const { error } = await supabase
        .from('user_feedback')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      toast('success', 'Status updated');
      fetchFeedback();
    } catch (error) {
      toast('error', 'Failed to update status');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const columns: Column<FeedbackItem>[] = [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-medium">{row.user_name || 'Anonymous'}</p>
          <Badge variant={row.user_role === 'lawyer' ? 'secondary' : 'default'}>
            {row.user_role}
          </Badge>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => renderStars(row.rating),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <Badge variant="secondary">{row.category}</Badge>,
    },
    {
      key: 'comment',
      header: 'Comment',
      render: (row) => (
        <p className="max-w-xs truncate">{row.comment}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const colors = {
          new: 'bg-blue-100 text-blue-700',
          reviewed: 'bg-yellow-100 text-yellow-700',
          addressed: 'bg-green-100 text-green-700',
        };
        return <Badge className={colors[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {row.status === 'new' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateStatus(row.id, 'reviewed')}
            >
              <Clock className="w-4 h-4" />
            </Button>
          )}
          {row.status !== 'addressed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateStatus(row.id, 'addressed')}
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Feedback</h1>
        <p className="text-neutral-500 mt-1">Manage user ratings and reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
                <p className="text-sm text-neutral-500">Avg Rating</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalFeedback}</p>
                <p className="text-sm text-neutral-500">Total Feedback</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.newCount}</p>
                <p className="text-sm text-neutral-500">New</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.addressedCount}</p>
                <p className="text-sm text-neutral-500">Addressed</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feedback Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-semibold">Recent Feedback</h2>
          </CardHeader>
          <CardBody>
            <DataTable<FeedbackItem>
              columns={columns}
              data={feedback}
              loading={loading}
              emptyMessage="No feedback yet"
            />
          </CardBody>
        </Card>

        {/* Rating Chart */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Rating Distribution</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
