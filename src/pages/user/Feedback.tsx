import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star } from 'lucide-react';
import { UserDashboardLayout } from '@/components/layout/UserDashboardLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function Feedback() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast('error', 'Please select a rating');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast('success', 'Thank you for your feedback!');
    setSubmitting(false);
    setRating(0);
    setComment('');
  };

  return (
    <UserDashboardLayout>
      <Helmet>
        <title>Give Feedback | VisaBuild</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">We Value Your Feedback</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Help us improve VisaBuild by sharing your experience.
          </p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="text-center">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  What is this about?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['General', 'Bug', 'Feature', 'Content'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat.toLowerCase())}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        category === cat.toLowerCase()
                          ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-300'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Tell us more
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <Button type="submit" className="w-full" loading={submitting}>
                Submit Feedback
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
