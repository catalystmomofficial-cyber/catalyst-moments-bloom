import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published_at: string;
  tags?: string[];
  featured_image_url?: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentTags?: string[];
}

export const RelatedPosts = ({ currentPostId, currentTags = [] }: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch all published posts except current
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, excerpt, slug, published_at, tags, featured_image_url')
          .eq('status', 'published')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Score posts based on tag similarity
        const scoredPosts = (data || []).map(post => {
          const postTags = post.tags || [];
          const commonTags = postTags.filter(tag => currentTags.includes(tag));
          return {
            ...post,
            score: commonTags.length
          };
        });

        // Sort by score and take top 3
        const topRelated = scoredPosts
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        setRelatedPosts(topRelated);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentTags]);

  if (loading || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Card 
            key={post.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.location.href = `/blog/${post.slug || post.id}`}
          >
            {post.featured_image_url && (
              <div className="w-full h-40 overflow-hidden">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
