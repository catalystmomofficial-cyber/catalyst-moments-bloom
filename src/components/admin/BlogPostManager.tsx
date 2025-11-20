import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPostPreview } from './BlogPostPreview';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  author: string;
  excerpt: string;
  featured_image_url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string;
  total_count: number;
}

export const BlogPostManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_all_blogs', {
        search_query: searchQuery || null,
        page_number: currentPage,
        page_size: pageSize,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setPosts(data);
        setTotalCount(data[0].total_count);
      } else {
        setPosts([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleUpdate = async () => {
    if (!editingPost) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.rpc('admin_update_blog', {
        blog_id: editingPost.id,
        blog_title: editingPost.title,
        blog_content: editingPost.content,
        blog_slug: editingPost.slug,
        blog_status: editingPost.status,
        blog_author: editingPost.author,
        blog_excerpt: editingPost.excerpt,
        blog_featured_image_url: editingPost.featured_image_url || '',
        blog_tags: editingPost.tags || [],
      });

      if (error) throw error;

      toast.success('Blog post updated successfully');
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPostId) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.rpc('admin_delete_blog', {
        blog_id: deletingPostId,
      });

      if (error) throw error;

      toast.success('Blog post deleted successfully');
      setDeletingPostId(null);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const EditorForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={editingPost?.title || ''}
          onChange={(e) =>
            setEditingPost(editingPost ? { ...editingPost, title: e.target.value } : null)
          }
        />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          value={editingPost?.slug || ''}
          onChange={(e) =>
            setEditingPost(editingPost ? { ...editingPost, slug: e.target.value } : null)
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <Select
            value={editingPost?.status}
            onValueChange={(value) =>
              setEditingPost(editingPost ? { ...editingPost, status: value } : null)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Author</Label>
          <Input
            value={editingPost?.author || ''}
            onChange={(e) =>
              setEditingPost(editingPost ? { ...editingPost, author: e.target.value } : null)
            }
          />
        </div>
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea
          value={editingPost?.excerpt || ''}
          onChange={(e) =>
            setEditingPost(editingPost ? { ...editingPost, excerpt: e.target.value } : null)
          }
          rows={3}
        />
      </div>
      <div>
        <Label>Content</Label>
        <RichTextEditor
          content={editingPost?.content || ''}
          onChange={(newContent) =>
            setEditingPost(editingPost ? { ...editingPost, content: newContent } : null)
          }
          placeholder="Write your blog post content here..."
        />
      </div>
      <div>
        <Label>Featured Image URL</Label>
        <Input
          value={editingPost?.featured_image_url || ''}
          onChange={(e) =>
            setEditingPost(editingPost ? { ...editingPost, featured_image_url: e.target.value } : null)
          }
        />
      </div>
      <div>
        <Label>Tags (comma-separated)</Label>
        <Input
          value={editingPost?.tags?.join(', ') || ''}
          onChange={(e) =>
            setEditingPost(
              editingPost
                ? {
                    ...editingPost,
                    tags: e.target.value.split(',').map((t) => t.trim()),
                  }
                : null
            )
          }
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Blog Posts</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No blog posts found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {post.tags?.slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/blog-preview?id=${post.id}`)}
                          title="Preview & Publish"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingPostId(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalCount)} of {totalCount} posts
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Edit Dialog with Live Preview */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Edit Blog Post with Live Preview</DialogTitle>
            <DialogDescription>
              Edit on the left and see changes in real-time on the right
            </DialogDescription>
          </DialogHeader>

          {editingPost && (
            <Tabs defaultValue="split" className="flex-1 flex flex-col h-[calc(95vh-12rem)]">
              <TabsList className="mx-6 grid w-auto grid-cols-3">
                <TabsTrigger value="split">Split View</TabsTrigger>
                <TabsTrigger value="edit">Edit Only</TabsTrigger>
                <TabsTrigger value="preview">Preview Only</TabsTrigger>
              </TabsList>

              <TabsContent value="split" className="flex-1 mt-0 p-6 pt-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-6 h-full">
                  <div className="overflow-y-auto pr-4">
                    <EditorForm />
                  </div>
                  <div className="overflow-y-auto pl-4 border-l">
                    <div className="sticky top-0 bg-background pb-4 mb-4 z-10">
                      <h3 className="text-sm font-medium text-muted-foreground">Live Preview</h3>
                    </div>
                    <BlogPostPreview
                      title={editingPost.title}
                      content={editingPost.content}
                      excerpt={editingPost.excerpt}
                      author={editingPost.author}
                      featuredImageUrl={editingPost.featured_image_url}
                      tags={editingPost.tags}
                      publishedAt={editingPost.published_at}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="flex-1 mt-0 p-6 pt-4 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                  <EditorForm />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 mt-0 p-6 pt-4 overflow-y-auto">
                <BlogPostPreview
                  title={editingPost.title}
                  content={editingPost.content}
                  excerpt={editingPost.excerpt}
                  author={editingPost.author}
                  featuredImageUrl={editingPost.featured_image_url}
                  tags={editingPost.tags}
                  publishedAt={editingPost.published_at}
                />
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="p-6 pt-0 border-t">
            <Button
              variant="outline"
              onClick={() => setEditingPost(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingPostId}
        onOpenChange={() => setDeletingPostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
