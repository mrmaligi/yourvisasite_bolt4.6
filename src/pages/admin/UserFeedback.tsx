import { useState } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Download,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userRole: 'user' | 'lawyer';
  rating: number;
  category: 'platform' | 'service' | 'content';
  comment: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'addressed';
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'F-1',
    userId: 'U-101',
    userName: 'Alice Johnson',
    userRole: 'user',
    rating: 5,
    category: 'platform',
    comment: 'The visa comparison tool is fantastic! Saved me so much time.',
    createdAt: '2024-03-15T10:00:00Z',
    status: 'new'
  },
  {
    id: 'F-2',
    userId: 'L-202',
    userName: 'Robert Smith',
    userRole: 'lawyer',
    rating: 4,
    category: 'service',
    comment: 'Client onboarding process is smooth, but would like more customization options for intake forms.',
    createdAt: '2024-03-14T15:30:00Z',
    status: 'reviewed'
  },
  {
    id: 'F-3',
    userId: 'U-103',
    userName: 'Emily Davis',
    userRole: 'user',
    rating: 2,
    category: 'content',
    comment: 'Found some outdated information on the Skilled Worker visa page.',
    createdAt: '2024-03-13T09:15:00Z',
    status: 'addressed'
  },
  {
    id: 'F-4',
    userId: 'U-104',
    userName: 'Michael Brown',
    userRole: 'user',
    rating: 5,
    category: 'platform',
    comment: 'Love the dark mode!',
    createdAt: '2024-03-12T11:20:00Z',
    status: 'reviewed'
  },
  {
    id: 'F-5',
    userId: 'L-205',
    userName: 'Sarah Wilson',
    userRole: 'lawyer',
    rating: 3,
    category: 'service',
    comment: 'Notifications are sometimes delayed by a few minutes.',
    createdAt: '2024-03-11T14:45:00Z',
    status: 'new'
  },
  {
    id: 'F-6',
    userId: 'U-106',
    userName: 'James Lee',
    userRole: 'user',
    rating: 4,
    category: 'content',
    comment: 'Very helpful guides, thank you.',
    createdAt: '2024-03-10T08:30:00Z',
    status: 'reviewed'
  }
];

const RATING_DATA = [
  { name: '5 Stars', count: 120, color: '#22c55e' },
  { name: '4 Stars', count: 85, color: '#84cc16' },
  { name: '3 Stars', count: 32, color: '#eab308' },
  { name: '2 Stars', count: 12, color: '#f97316' },
  { name: '1 Star', count: 5, color: '#ef4444' },
];

export function UserFeedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredList = feedbackList.filter(item =>
    filterRating === 'all' || item.rating === filterRating
  );

  const averageRating = (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Feedback</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Insights from users and lawyers</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rating Overview Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Rating Distribution
            </h2>
          </CardHeader>
          <CardBody>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RATING_DATA} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" />
                  <XAxis type="number" stroke="#A3A3A3" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#A3A3A3" fontSize={12} width={60} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                    {RATING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Summary Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none">
            <CardBody className="flex flex-col items-center justify-center py-10">
              <div className="text-5xl font-bold mb-2">{averageRating}</div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= Math.round(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                  />
                ))}
              </div>
              <p className="text-white/80 font-medium">Average Rating</p>
              <p className="text-white/60 text-sm mt-1">Based on {feedbackList.length} reviews</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
               <h3 className="font-semibold text-neutral-900 dark:text-white">Filter by Rating</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <button
                onClick={() => setFilterRating('all')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${filterRating === 'all' ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
              >
                <span>All Ratings</span>
                <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full text-xs">
                  {feedbackList.length}
                </span>
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${filterRating === rating ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{rating} Stars</span>
                    <div className="flex">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full text-xs">
                    {feedbackList.filter(i => i.rating === rating).length}
                  </span>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Detailed Feedback List */}
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mt-8 mb-4">Recent Feedback</h2>
      <div className="grid gap-4">
        {filteredList.map((item) => (
          <Card key={item.id} className="hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[100px]">
                   <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                     <span className="font-bold text-neutral-900 dark:text-white">{item.rating}.0</span>
                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                   </div>
                   <span className="text-xs text-neutral-500 capitalize">{item.category}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{item.userName}</h3>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5 px-1.5">
                        {item.userRole}
                      </Badge>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    "{item.comment}"
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <Button size="sm" variant="ghost" className="text-xs h-8 px-2 text-neutral-500">
                      <ThumbsUp className="w-3 h-3 mr-1.5" /> Helpful
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-8 px-2 text-neutral-500">
                      <MessageSquare className="w-3 h-3 mr-1.5" /> Reply
                    </Button>
                    <div className="flex-1" />
                    <Badge variant={
                      item.status === 'new' ? 'primary' :
                      item.status === 'addressed' ? 'success' : 'secondary'
                    } className="capitalize">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
