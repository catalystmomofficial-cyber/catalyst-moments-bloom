import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CommunityPostData {
  id: string;
  user_id: string;
  group_slug: string;
  sub_category: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  display_name: string | null;
  is_liked: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  display_name: string | null;
}

export function useCommunityPosts(groupSlug: string = 'general', subCategory: string = 'general') {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!user) { setPosts([]); setIsLoading(false); return; }

    const { data: postsData, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('group_slug', groupSlug)
      .eq('sub_category', subCategory)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) { console.error('Error fetching posts:', error); setIsLoading(false); return; }

    if (!postsData || postsData.length === 0) { setPosts([]); setIsLoading(false); return; }

    // Fetch display names for post authors
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

    // Fetch which posts current user liked
    const { data: likes } = await supabase
      .from('community_post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postsData.map(p => p.id));

    const likedSet = new Set(likes?.map(l => l.post_id) || []);

    const enriched: CommunityPostData[] = postsData.map(p => ({
      id: p.id,
      user_id: p.user_id,
      group_slug: p.group_slug,
      sub_category: p.sub_category,
      content: p.content,
      likes_count: p.likes_count,
      comments_count: p.comments_count,
      created_at: p.created_at,
      display_name: profileMap.get(p.user_id) || 'Community Member',
      is_liked: likedSet.has(p.id),
    }));

    setPosts(enriched);
    setIsLoading(false);
  }, [user, groupSlug, subCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`community-posts-${groupSlug}-${subCategory}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'community_posts',
        filter: `group_slug=eq.${groupSlug}`,
      }, () => { fetchPosts(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, groupSlug, subCategory, fetchPosts]);

  const createPost = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;
    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      group_slug: groupSlug,
      sub_category: subCategory,
      content: content.trim(),
    });
    if (error) console.error('Error creating post:', error);
  }, [user, groupSlug, subCategory]);

  const toggleLike = useCallback(async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      is_liked: !currentlyLiked,
      likes_count: currentlyLiked ? p.likes_count - 1 : p.likes_count + 1,
    } : p));

    if (currentlyLiked) {
      await supabase.from('community_post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      await supabase.from('community_posts').update({ likes_count: Math.max(0, (posts.find(p => p.id === postId)?.likes_count ?? 1) - 1) }).eq('id', postId);
    } else {
      await supabase.from('community_post_likes').insert({ post_id: postId, user_id: user.id });
      await supabase.from('community_posts').update({ likes_count: (posts.find(p => p.id === postId)?.likes_count ?? 0) + 1 }).eq('id', postId);
    }
  }, [user, posts]);

  const fetchComments = useCallback(async (postId: string): Promise<PostComment[]> => {
    const { data, error } = await supabase
      .from('community_post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

    return data.map(c => ({
      ...c,
      display_name: profileMap.get(c.user_id) || 'Community Member',
    }));
  }, []);

  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user || !content.trim()) return;
    const { error } = await supabase.from('community_post_comments').insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    });
    if (!error) {
      // Update comments count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase.from('community_posts').update({ comments_count: post.comments_count + 1 }).eq('id', postId);
      }
    }
  }, [user, posts]);

  return { posts, isLoading, createPost, toggleLike, fetchComments, addComment, refetch: fetchPosts };
}
