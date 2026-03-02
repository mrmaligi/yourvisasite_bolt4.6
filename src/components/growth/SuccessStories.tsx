import { useState, useEffect } from 'react';
import { Star, Clock, Award, User } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { supabase } from '../../lib/supabase';
import type { Visa } from '../../types/database';

interface SuccessStory {
  id: string;
  title: string;
  story: string;
  timeline_days?: number;
  challenges?: string;
  tips?: string;
  is_anonymous: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  visa?: Visa;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface SuccessStoriesListProps {
  visaId?: string;
  featured?: boolean;
  limit?: number;
}

export function SuccessStoriesList({ visaId, featured = false, limit }: SuccessStoriesListProps) {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [visaId, featured]);

  const fetchStories = async () => {
    try {
      let query = supabase
        .from('success_stories')
        .select(`
          *,
          visa:visas(id, name, subclass),
          user:profiles(full_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (visaId) {
        query = query.eq('visa_id', visaId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardBody>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4" />
              <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          No success stories yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
          Be the first to share your visa journey and help others!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <SuccessStoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              {story.is_anonymous ? (
                <User className="w-5 h-5 text-primary-600" />
              ) : (
                <span className="text-sm font-semibold text-primary-600">
                  {story.user?.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">
                {story.is_anonymous ? 'Anonymous' : story.user?.full_name}
              </p>
              {story.visa && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {story.visa.subclass} - {story.visa.name}
                </p>
              )}
            </div>
          </div>
          {story.is_featured && (
            <Badge variant="primary">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardBody className="flex-1 flex flex-col">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
          {story.title}
        </h3>
        
        <p className={`text-neutral-600 dark:text-neutral-300 text-sm ${expanded ? '' : 'line-clamp-3'}`}>
          {story.story}
        </p>
        
        {story.story.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 text-sm mt-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {story.timeline_days && (
          <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>Processed in {story.timeline_days} days</span>
          </div>
        )}

        {story.tips && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              💡 Tip from {story.is_anonymous ? 'applicant' : story.user?.full_name?.split(' ')[0]}:
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {story.tips}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Submit Success Story Form
import { Input, Textarea, Select } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';

export function SubmitSuccessStory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    visa_id: '',
    title: '',
    story: '',
    timeline_days: '',
    challenges: '',
    tips: '',
    is_anonymous: false,
  });

  useEffect(() => {
    fetchUserVisas();
  }, []);

  const fetchUserVisas = async () => {
    const { data } = await supabase
      .from('user_visas')
      .select('visa:visas(id, name, subclass)')
      .eq('user_id', user?.id)
      .eq('status', 'active');

    if (data) {
      setVisas(data.map((uv: any) => uv.visa));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('success_stories')
        .insert({
          user_id: user?.id,
          ...formData,
          timeline_days: formData.timeline_days ? parseInt(formData.timeline_days) : null,
          is_published: false, // Admin approval required
        });

      if (error) throw error;

      toast('success', 'Story submitted! It will be reviewed and published soon.');
      setFormData({
        visa_id: '',
        title: '',
        story: '',
        timeline_days: '',
        challenges: '',
        tips: '',
        is_anonymous: false,
      });
    } catch (error) {
      console.error('Error submitting story:', error);
      toast('error', 'Failed to submit story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Share Your Success Story
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300">
          Your story can inspire and help others on their visa journey.
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Which visa did you get?"
            value={formData.visa_id}
            onChange={(e) => setFormData({ ...formData, visa_id: e.target.value })}
            options={[
              { value: '', label: 'Select a visa' },
              ...visas.map((v) => ({ value: v.id, label: `${v.subclass} - ${v.name}` })),
            ]}
            required
          />

          <Input
            label="Title"
            placeholder="e.g., 'How I got my 482 visa in 3 weeks'"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Your Story"
            placeholder="Share your visa journey, what worked for you, any challenges you faced..."
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            rows={6}
            required
          />

          <Input
            label="How long did the process take? (days)"
            type="number"
            value={formData.timeline_days}
            onChange={(e) => setFormData({ ...formData, timeline_days: e.target.value })}
          />

          <Textarea
            label="What challenges did you face?"
            placeholder="Optional: Share any obstacles and how you overcame them"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            rows={3}
          />

          <Textarea
            label="Tips for others"
            placeholder="Optional: What advice would you give to someone applying for this visa?"
            value={formData.tips}
            onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
            rows={3}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Post anonymously
            </span>
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Story'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}