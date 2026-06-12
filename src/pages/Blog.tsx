import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { supabaseImgSrc, supabaseImgSrcSet } from '@/lib/imageUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { NewsletterWidget } from '@/components/blog/NewsletterWidget';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import SEO from '@/components/seo/SEO';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  slug: string;
  featured_image_url?: string;
  tags?: string[];
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
        setFilteredBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter(blog => blog.tags?.includes(selectedCategory))
      );
    }
  }, [selectedCategory, blogs]);

  // Track analytics when viewing a blog post
  const trackBlogView = async (blogId: string) => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('blog_analytics').insert({
        blog_id: blogId,
        user_id: user?.id || null,
        session_id: sessionId,
        view_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking blog view:', error);
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Blog - Pregnancy, Wellness & Motherhood Articles"
        description="Expert articles on pregnancy, postpartum, TTC, wellness, and motherhood. Evidence-based content to support your journey."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Our Blog</h1>
          <p className="text-center text-muted-foreground mb-8">
            Expert advice and insights for every stage of motherhood
          </p>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Welcome to the Catalyst Mom wellness blog, where we share evidence-based articles on
            pregnancy, postpartum recovery, TTC (trying to conceive), nutrition, and the mental
            load of motherhood. Every article is grounded in the same{' '}
            <Link to="/research" className="underline hover:text-primary">clinical research standards</Link>{' '}
            that shape our programs, and written with input from our{' '}
            <Link to="/experts" className="underline hover:text-primary">team of specialists</Link>.
            New posts are added regularly to help you navigate every stage of motherhood with
            confidence. If you have questions about how Catalyst Mom works, check out our{' '}
            <Link to="/faq" className="underline hover:text-primary">FAQ page</Link>, or learn more{' '}
            <Link to="/about" className="underline hover:text-primary">about our story</Link>{' '}
            and why we built this community.
          </p>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="mb-8">
            <NewsletterWidget />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {selectedCategory 
                    ? `No ${selectedCategory} posts found. Try selecting a different category.`
                    : 'Our expert-written articles on pregnancy, wellness, and motherhood are coming soon. Stay tuned for evidence-based content to support your journey.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredBlogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    trackBlogView(blog.id);
                    window.location.href = `/blog/${blog.slug || blog.id}`;
                  }}
                >
                  {blog.featured_image_url && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={supabaseImgSrc(blog.featured_image_url, 700)}
                        srcSet={supabaseImgSrcSet(blog.featured_image_url, [400, 700])}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(blog.published_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Blog;