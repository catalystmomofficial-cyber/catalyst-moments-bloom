import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags?: string[];
}

interface InternalLinkingSuggestionsProps {
  currentPostId: string;
  currentTags?: string[];
  currentContent: string;
}

export const InternalLinkingSuggestions = ({ 
  currentPostId, 
  currentTags = [],
  currentContent 
}: InternalLinkingSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data: blogs } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, tags')
        .eq('status', 'published')
        .neq('id', currentPostId)
        .limit(20);

      if (!blogs) return;

      // Score posts based on tag overlap and content relevance
      const scoredPosts = blogs.map(post => {
        let score = 0;
        
        // Tag overlap scoring
        const commonTags = post.tags?.filter(tag => currentTags.includes(tag)) || [];
        score += commonTags.length * 3;

        // Title keyword matching
        const contentWords = currentContent.toLowerCase().split(/\s+/).slice(0, 100);
        const titleWords = post.title.toLowerCase().split(/\s+/);
        const matchingWords = titleWords.filter(word => 
          word.length > 4 && contentWords.includes(word)
        );
        score += matchingWords.length * 2;

        return { ...post, score };
      });

      // Sort by score and take top 3
      const topSuggestions = scoredPosts
        .filter(post => post.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setSuggestions(topSuggestions);
    };

    if (currentPostId) {
      fetchSuggestions();
    }
  }, [currentPostId, currentTags, currentContent]);

  if (suggestions.length === 0) return null;

  return (
    <Card className="my-8 bg-accent/20 border-accent">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Related Articles You Might Find Helpful</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors group"
          >
            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
            <div>
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
