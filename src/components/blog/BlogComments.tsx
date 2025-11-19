import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Trash2, MessageCircle, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  likes_count: number;
  user_has_liked: boolean;
  replies?: Comment[];
}

interface BlogCommentsProps {
  blogId: string;
}

export const BlogComments = ({ blogId }: BlogCommentsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [blogId, user]);

  const loadComments = async () => {
    try {
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch user details for comments
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      
      // Get profiles for user names
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      // Fetch likes count and user likes
      const { data: likesData } = await supabase
        .from('blog_comment_likes')
        .select('comment_id, user_id');

      const likesMap = new Map<string, { count: number; userLiked: boolean }>();
      likesData?.forEach(like => {
        const current = likesMap.get(like.comment_id) || { count: 0, userLiked: false };
        current.count++;
        if (user && like.user_id === user.id) {
          current.userLiked = true;
        }
        likesMap.set(like.comment_id, current);
      });

      // Organize comments with user info and likes
      const enrichedComments = commentsData?.map(comment => {
        const profile = profilesMap.get(comment.user_id);
        const likes = likesMap.get(comment.id) || { count: 0, userLiked: false };
        return {
          ...comment,
          user_name: profile?.display_name || 'User',
          likes_count: likes.count,
          user_has_liked: likes.userLiked,
        };
      }) || [];

      // Organize into parent comments and replies
      const parentComments = enrichedComments.filter(c => !c.parent_id);
      const repliesMap = new Map<string, Comment[]>();
      
      enrichedComments.filter(c => c.parent_id).forEach(reply => {
        const existing = repliesMap.get(reply.parent_id!) || [];
        repliesMap.set(reply.parent_id!, [...existing, reply]);
      });

      const commentsWithReplies = parentComments.map(comment => ({
        ...comment,
        replies: repliesMap.get(comment.id) || [],
      }));

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blog_comments').insert({
        blog_id: blogId,
        user_id: user.id,
        content: newComment,
        is_approved: true,
      });

      if (error) throw error;

      toast.success('Comment posted!');
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blog_comments').insert({
        blog_id: blogId,
        user_id: user.id,
        content: replyContent,
        parent_id: parentId,
        is_approved: true,
      });

      if (error) throw error;

      toast.success('Reply posted!');
      setReplyContent('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string, currentlyLiked: boolean) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to like comments');
      return;
    }

    try {
      if (currentlyLiked) {
        const { error } = await supabase
          .from('blog_comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      loadComments();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast.success('Comment deleted');
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleModerate = async (commentId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: approve })
        .eq('id', commentId);

      if (error) throw error;

      toast.success(approve ? 'Comment approved' : 'Comment hidden');
      loadComments();
    } catch (error) {
      console.error('Error moderating comment:', error);
      toast.error('Failed to moderate comment');
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : 'mt-6'} space-y-3`}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {comment.user_name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.user_name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {!comment.is_approved && isAdmin && (
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                    Pending Approval
                  </span>
                )}
              </div>
              {(user?.id === comment.user_id || isAdmin) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => handleLike(comment.id, comment.user_has_liked)}
            >
              <Heart className={`h-4 w-4 ${comment.user_has_liked ? 'fill-primary text-primary' : ''}`} />
              {comment.likes_count > 0 && <span className="text-xs">{comment.likes_count}</span>}
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleModerate(comment.id, !comment.is_approved)}
              >
                {comment.is_approved ? 'Hide' : 'Approve'}
              </Button>
            )}
          </div>
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px]"
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={loading}
                  size="sm"
                >
                  Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
      
      {isAuthenticated ? (
        <div className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px] mb-3"
          />
          <Button onClick={handleSubmitComment} disabled={loading}>
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 mb-8 text-center">
          <p className="text-muted-foreground">Please log in to leave a comment</p>
        </div>
      )}

      <div className="divide-y divide-border">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
};
