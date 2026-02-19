import { useState } from 'react';
import { Heart, MessageCircle, CheckCircle, User } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ForumReply } from '../../types/database';

interface ReplyWithAuthor extends Omit<ForumReply, 'author'> {
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  user_vote?: boolean;
}

interface ForumReplyProps {
  reply: ReplyWithAuthor;
  isOp: boolean;
  onReply: (parentId: string) => void;
  onMarkSolution: (replyId: string) => void;
  depth?: number;
}

export function ForumReplyComponent({
  reply,
  isOp,
  onReply,
  onMarkSolution,
  depth = 0,
}: ForumReplyProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [upvotes, setUpvotes] = useState(reply.upvotes);
  const [hasVoted, setHasVoted] = useState(!!reply.user_vote);

  const handleUpvote = async () => {
    if (!user) {
      toast('error', 'Please sign in to vote');
      return;
    }

    try {
      if (hasVoted) {
        // Remove vote
        await supabase
          .from('forum_reply_votes')
          .delete()
          .eq('reply_id', reply.id)
          .eq('user_id', user.id);
        setUpvotes((prev) => prev - 1);
        setHasVoted(false);
      } else {
        // Add vote
        await supabase
          .from('forum_reply_votes')
          .insert({ reply_id: reply.id, user_id: user.id });
        setUpvotes((prev) => prev + 1);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast('error', 'Failed to vote');
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-neutral-200 dark:border-neutral-700 pl-4' : ''}`}>
      <Card className={reply.is_solution ? 'border-green-500 dark:border-green-600' : ''}>
        <CardBody className="p-4">
          {/* Solution Badge */}
          {reply.is_solution && (
            <Badge variant="success" className="mb-3">
              <CheckCircle className="w-3 h-3 mr-1" />
              Solution
            </Badge>
          )}

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
              {reply.author?.avatar_url ? (
                <img
                  src={reply.author.avatar_url}
                  alt={reply.author.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-neutral-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-neutral-900 dark:text-white">
                  {reply.author?.full_name || 'Unknown'}
                </span>
                <span className="text-sm text-neutral-500">
                  {new Date(reply.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="prose dark:prose-invert prose-sm max-w-none text-neutral-700 dark:text-neutral-300">
                {reply.content}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    hasVoted
                      ? 'text-red-500'
                      : 'text-neutral-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                  {upvotes}
                </button>

                <button
                  onClick={() => onReply(reply.id)}
                  className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>

                {isOp && !reply.is_solution && (
                  <button
                    onClick={() => onMarkSolution(reply.id)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Solution
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
