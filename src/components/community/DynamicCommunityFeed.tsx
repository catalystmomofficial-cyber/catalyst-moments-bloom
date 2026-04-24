import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityPosts, type PostComment } from '@/hooks/useCommunityPosts';
import { formatDistanceToNow } from 'date-fns';

import mom1 from '@/assets/member-avatars/mom-1.jpg';
import mom2 from '@/assets/member-avatars/mom-2.jpg';
import mom3 from '@/assets/member-avatars/mom-3.jpg';
import mom4 from '@/assets/member-avatars/mom-4.jpg';
import mom5 from '@/assets/member-avatars/mom-5.jpg';
import mom6 from '@/assets/member-avatars/mom-6.jpg';

const memberAvatars = [mom1, mom2, mom3, mom4, mom5, mom6];

// Deterministic avatar fallback based on user_id string
function getFallbackAvatar(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return memberAvatars[Math.abs(hash) % memberAvatars.length];
}

function getAvatar(userId: string, avatarUrl?: string | null): string {
  return avatarUrl || getFallbackAvatar(userId);
}

function getInitials(name: string | null): string {
  if (!name) return 'CM';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface DynamicCommunityFeedProps {
  groupSlug?: string;
  isTTC?: boolean;
}

export const DynamicCommunityFeed = ({ groupSlug = 'general', isTTC = false }: DynamicCommunityFeedProps) => {
  const { user, profile, subscribed, setShowCheckoutModal } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Parse groupSlug-subCategory format from GroupDetail
  const parts = groupSlug.split('-');
  const actualGroup = parts.length > 1 ? parts.slice(0, -1).join('-') : groupSlug;
  const subCat = parts.length > 1 ? parts[parts.length - 1] : 'general';

  const { posts, isLoading, createPost, toggleLike, fetchComments, addComment } = useCommunityPosts(actualGroup, subCat);

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) return;
    setIsPosting(true);
    await createPost(newPostContent);
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatar(user.id, profile?.avatar_url)} />
                <AvatarFallback>{getInitials(profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Share something with the community..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleCreatePost} disabled={isPosting || !newPostContent.trim()}>
                    {isPosting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="text-lg font-medium mb-1">No posts yet</p>
            <p className="text-sm">Be the first to share something with the community!</p>
          </CardContent>
        </Card>
      )}

      {posts.map((post) => (
        <LivePost
          key={post.id}
          post={post}
          onToggleLike={toggleLike}
          onFetchComments={fetchComments}
          onAddComment={addComment}
        />
      ))}
    </div>
  );
};

interface LivePostProps {
  post: import('@/hooks/useCommunityPosts').CommunityPostData;
  onToggleLike: (postId: string, liked: boolean) => Promise<void>;
  onFetchComments: (postId: string) => Promise<PostComment[]>;
  onAddComment: (postId: string, content: string) => Promise<void>;
}

const LivePost = ({ post, onToggleLike, onFetchComments, onAddComment }: LivePostProps) => {
  const { user, subscribed, setShowCheckoutModal } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const avatarSrc = useMemo(() => getAvatar(post.user_id, post.avatar_url), [post.user_id, post.avatar_url]);
  const initials = useMemo(() => getInitials(post.display_name), [post.display_name]);

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      const fetched = await onFetchComments(post.id);
      setComments(fetched);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await onAddComment(post.id, commentText);
    setCommentText('');
    // Refresh comments
    const fetched = await onFetchComments(post.id);
    setComments(fetched);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Catalyst Mom Community', text: post.content.slice(0, 100) });
    }
  };

  const timeAgo = useMemo(() => {
    try { return formatDistanceToNow(new Date(post.created_at), { addSuffix: true }); }
    catch { return ''; }
  }, [post.created_at]);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={post.display_name || 'Member'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.display_name || 'Community Member'}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>

        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleLike(post.id, post.is_liked)}
            className={`flex items-center space-x-1 ${post.is_liked ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
            <span className="text-xs">{post.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToggleComments} className="flex items-center space-x-1 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center space-x-1 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {loadingComments && <Loader2 className="h-4 w-4 animate-spin mx-auto" />}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={getAvatar(c.user_id, c.avatar_url)} />
                  <AvatarFallback className="text-xs">{getInitials(c.display_name)}</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs font-medium">{c.display_name || 'Member'}</p>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            ))}
            {user && (
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="text-sm"
                />
                <Button size="sm" variant="ghost" onClick={handleAddComment} disabled={!commentText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
