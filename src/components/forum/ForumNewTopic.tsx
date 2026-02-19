import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function ForumNewTopic() {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create a topic');
      return;
    }

    setLoading(true);
    try {
      // Get category ID
      const { data: category } = await supabase
        .from('forum_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) throw new Error('Category not found');

      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 60);

      // Add random suffix to ensure uniqueness
      const uniqueSlug = `${slug}-${Date.now().toString(36).substring(0, 6)}`;

      const { data: topic, error } = await supabase
        .from('forum_topics')
        .insert({
          category_id: category.id,
          author_id: user.id,
          title: formData.title,
          slug: uniqueSlug,
          content: formData.content,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Topic created successfully!');
      navigate(`/forum/${categorySlug}/${uniqueSlug}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody className="p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Create New Topic
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="What's your question or discussion topic?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Content"
            placeholder="Provide more details... (Markdown supported)"
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center gap-2"
            >
              {loading ? 'Creating...' : (
                <>
                  <Send className="w-4 h-4" />
                  Post Topic
                </>
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
