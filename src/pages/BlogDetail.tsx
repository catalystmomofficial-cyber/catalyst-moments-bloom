import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { NewsletterWidget } from '@/components/blog/NewsletterWidget';
import SEO from '@/components/seo/SEO';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  featured_image_url?: string;
  tags?: string[];
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();

        if (error) throw error;
        setBlog(data);

        // Track view
        const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
        sessionStorage.setItem('session_id', sessionId);
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('blog_analytics').insert({
          blog_id: data.id,
          user_id: user?.id || null,
          session_id: sessionId,
          view_date: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  // Track time spent
  useEffect(() => {
    if (!blog) return;

    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      // Update time spent on unmount
      if (timeSpent > 0) {
        const sessionId = sessionStorage.getItem('session_id');
        supabase.from('blog_analytics')
          .update({ time_spent_seconds: timeSpent })
          .eq('session_id', sessionId)
          .eq('blog_id', blog.id);
      }
    };
  }, [blog, timeSpent]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!blog) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title={blog.title}
        description={blog.excerpt || blog.content.substring(0, 160)}
        image={blog.featured_image_url}
      />
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {blog.featured_image_url && (
            <div className="w-full h-96 overflow-hidden rounded-lg mb-8">
              <img 
                src={blog.featured_image_url} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
          </Card>

          <NewsletterWidget />

          <RelatedPosts 
            currentPostId={blog.id} 
            currentTags={blog.tags || []} 
          />
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogDetail;
