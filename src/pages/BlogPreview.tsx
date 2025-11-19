import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Eye, FileEdit, Trash2, Save, X, Calendar, Clock } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogSEOAnalyzer } from '@/components/admin/BlogSEOAnalyzer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  featured_image_url: string | null;
  slug: string;
  status: string;
  published_at: string | null;
  scheduled_publish_at: string | null;
  created_at: string;
}

export default function BlogPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blogId = searchParams.get('id');
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [showScheduler, setShowScheduler] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (blogId) {
      fetchBlogPost();
    }
  }, [blogId]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) throw error;
      setBlog(data);
      setEditedBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality
  const autoSaveDraft = useCallback(async () => {
    if (!editedBlog || !isEditing) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: editedBlog.title,
          content: editedBlog.content,
          excerpt: editedBlog.excerpt,
          tags: editedBlog.tags
        })
        .eq('id', editedBlog.id);

      if (error) throw error;

      setLastSaved(new Date());
      setBlog(editedBlog);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [editedBlog, isEditing]);

  // Set up auto-save timer when editing
  useEffect(() => {
    if (isEditing && editedBlog) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new timer for 30 seconds
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveDraft();
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [editedBlog, isEditing, autoSaveDraft]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleSaveEdits = async () => {
    if (!editedBlog) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: editedBlog.title,
          content: editedBlog.content,
          excerpt: editedBlog.excerpt,
          tags: editedBlog.tags
        })
        .eq('id', editedBlog.id);

      if (error) throw error;

      setBlog(editedBlog);
      setIsEditing(false);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!blog) return;
    
    setPublishing(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', blog.id);

      if (error) throw error;

      toast.success('Blog post published successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast.error('Failed to publish blog post');
    } finally {
      setPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!blog || !scheduleDate) return;
    
    setPublishing(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          scheduled_publish_at: scheduleDate.toISOString()
        })
        .eq('id', blog.id);

      if (error) throw error;

      toast.success(`Blog scheduled for ${format(scheduleDate, 'PPP p')}`);
      setShowScheduler(false);
      fetchBlogPost(); // Refresh to show scheduled status
    } catch (error) {
      console.error('Error scheduling blog:', error);
      toast.error('Failed to schedule blog post');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!blog || !confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);

      if (error) throw error;

      toast.success('Blog post deleted');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!blog) {
    return (
      <PageLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
            {isEditing && lastSaved && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Auto-saved {format(lastSaved, 'p')}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveEdits} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditedBlog(blog);
                }}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {blog.status === 'draft' && (
                  <>
                    <Button onClick={handlePublish} disabled={publishing}>
                      <Eye className="mr-2 h-4 w-4" />
                      {publishing ? 'Publishing...' : 'Publish Now'}
                    </Button>
                    <Popover open={showScheduler} onOpenChange={setShowScheduler}>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                        {scheduleDate && (
                          <div className="p-3 border-t">
                            <Button onClick={handleSchedule} className="w-full">
                              Schedule for {format(scheduleDate, 'PPP')}
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </>
                )}
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedBlog?.title || ''}
                    onChange={(e) => setEditedBlog(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="text-3xl font-bold mb-2"
                  />
                ) : (
                  <CardTitle className="text-3xl mb-2">{blog.title}</CardTitle>
                )}
                {isEditing ? (
                  <Input
                    value={editedBlog?.excerpt || ''}
                    onChange={(e) => setEditedBlog(prev => prev ? {...prev, excerpt: e.target.value} : null)}
                    className="text-base"
                    placeholder="Blog excerpt"
                  />
                ) : (
                  <CardDescription className="text-base">
                    {blog.excerpt}
                  </CardDescription>
                )}
              </div>
              <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                {blog.status}
              </Badge>
            </div>
            
            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>Slug: {blog.slug}</span>
              {blog.published_at && (
                <>
                  <span>•</span>
                  <span>Published: {new Date(blog.published_at).toLocaleDateString()}</span>
                </>
              )}
              {blog.scheduled_publish_at && (
                <>
                  <span>•</span>
                  <span className="text-yellow-600 font-semibold">
                    Scheduled: {format(new Date(blog.scheduled_publish_at), 'PPP p')}
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {isEditing ? (
              <div className="pt-4">
                <Input
                  value={editedBlog?.tags?.join(', ') || ''}
                  onChange={(e) => setEditedBlog(prev => prev ? {...prev, tags: e.target.value.split(',').map(t => t.trim())} : null)}
                  placeholder="Tags (comma-separated)"
                />
              </div>
            ) : (
              blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Featured Image */}
            {blog.featured_image_url && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={blog.featured_image_url} 
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* HTML Content Rendering */}
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <RichTextEditor
                    content={editedBlog?.content || ''}
                    onChange={(newContent) => setEditedBlog(prev => prev ? {...prev, content: newContent} : null)}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-muted-foreground prose-li:mb-2
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </CardContent>
        </Card>

        {/* SEO Analyzer */}
        {!isEditing && (
          <BlogSEOAnalyzer
            title={blog.title}
            content={blog.content}
            excerpt={blog.excerpt}
            keywords={blog.tags || []}
          />
        )}
      </div>
    </PageLayout>
  );
}
