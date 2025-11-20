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
import { BlogComments } from '@/components/blog/BlogComments';
import DOMPurify from 'dompurify';
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
          .eq('slug', slug)
          .maybeSingle();

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.content.substring(0, 160),
    "image": blog.featured_image_url || `${window.location.origin}/og-image.png`,
    "datePublished": blog.published_at,
    "dateModified": blog.published_at,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Catalyst Mom",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/catalyst-mom-logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${slug}`
    },
    "keywords": blog.tags?.join(", "),
    "wordCount": blog.content.split(' ').length,
    "articleBody": blog.content.replace(/<[^>]*>/g, '').substring(0, 500)
  };

  return (
    <PageLayout>
      <SEO 
        title={`${blog.title} | Catalyst Mom Blog`}
        description={blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={blog.featured_image_url}
        canonical={`${window.location.origin}/blog/${slug}`}
        structuredData={structuredData}
      />
      <article className="container mx-auto px-4 py-8" itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content={blog.published_at} />
        <meta itemProp="dateModified" content={blog.published_at} />
        <div className="max-w-4xl mx-auto">
          {blog.featured_image_url && (
            <figure className="w-full h-96 overflow-hidden rounded-lg mb-8">
              <img 
                src={blog.featured_image_url} 
                alt={`Featured image for ${blog.title} - Catalyst Mom Blog`}
                itemProp="image"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </figure>
          )}

          <div className="mb-6">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4" itemProp="headline">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                <User className="h-4 w-4" aria-hidden="true" />
                <span itemProp="name">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <time itemProp="datePublished" dateTime={blog.published_at}>
                  {format(new Date(blog.published_at), 'MMMM d, yyyy')}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-muted-foreground prose-li:mb-2
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-img:rounded-lg prose-img:shadow-md"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
              />
            </CardContent>
          </Card>

          <BlogComments blogId={blog.id} />

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
