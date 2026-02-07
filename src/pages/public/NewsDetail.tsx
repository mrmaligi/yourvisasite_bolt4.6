import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageSquare, Send, Scale, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import type { NewsArticle, NewsComment } from '../../types/database';

interface CommentWithAuthor extends NewsComment {
  author_name: string | null;
  author_role: string | null;
}

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      const { data: articleRow } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      setArticle(articleRow);

      if (articleRow) {
        await fetchComments(articleRow.id);
      }

      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  const fetchComments = async (articleId: string) => {
    const { data: commentRows } = await supabase
      .from('news_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (!commentRows || commentRows.length === 0) {
      setComments([]);
      return;
    }

    const authorIds = [...new Set(commentRows.map((c) => c.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('id', authorIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    const enriched: CommentWithAuthor[] = commentRows.map((c) => {
      const author = profileMap.get(c.author_id);
      return {
        ...c,
        author_name: author?.full_name || null,
        author_role: author?.role || null,
      };
    });

    setComments(enriched);
  };

  const handlePostComment = async () => {
    if (!user || !article || !commentBody.trim()) return;
    setSubmittingComment(true);

    const { error } = await supabase.from('news_comments').insert({
      article_id: article.id,
      author_id: user.id,
      body: commentBody.trim(),
    });

    if (error) {
      toast('error', 'Failed to post comment');
    } else {
      toast('success', 'Comment posted');
      setCommentBody('');
      await fetchComments(article.id);
    }

    setSubmittingComment(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Article not found</h2>
        <Link to="/" className="text-primary-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const canComment = role === 'lawyer' || role === 'admin';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline mb-8">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-neutral-400 mb-8">
          <Calendar className="w-4 h-4" />
          {article.published_at && new Date(article.published_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
          })}
        </div>

        {article.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={article.image_url}
              alt=""
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>
        )}

        <div className="prose prose-neutral max-w-none">
          {article.body.split('\n').map((paragraph, i) => (
            paragraph.trim() ? (
              <p key={i} className="text-neutral-700 leading-relaxed mb-4">{paragraph}</p>
            ) : null
          ))}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          Professional Commentary
          <span className="text-sm font-normal text-neutral-400">({comments.length})</span>
        </h2>

        {canComment && (
          <Card className="mb-8">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {role === 'admin' ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : (
                    <Scale className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Share your professional insight on this article..."
                    className="input-field min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      loading={submittingComment}
                      disabled={!commentBody.trim()}
                      onClick={handlePostComment}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">{canComment ? 'Be the first to share your insight.' : 'Verified lawyers and admins can comment on articles.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  comment.author_role === 'admin'
                    ? 'bg-gradient-to-br from-red-400 to-red-600'
                    : comment.author_role === 'lawyer'
                    ? 'bg-gradient-to-br from-teal-400 to-teal-600'
                    : 'bg-neutral-200'
                }`}>
                  {comment.author_role === 'admin' ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : comment.author_role === 'lawyer' ? (
                    <Scale className="w-4 h-4 text-white" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-neutral-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-neutral-900">
                      {comment.author_name || 'Anonymous'}
                    </span>
                    {comment.author_role === 'lawyer' && (
                      <Badge variant="success">Lawyer</Badge>
                    )}
                    {comment.author_role === 'admin' && (
                      <Badge variant="destructive">Admin</Badge>
                    )}
                    <span className="text-xs text-neutral-400">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
