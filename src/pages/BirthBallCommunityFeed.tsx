import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Send, Filter, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  author: string;
  avatar: string;
  trimester: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  tags: string[];
  liked?: boolean;
}

const BirthBallCommunityFeed = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: "Sarah T.",
      avatar: "ST",
      trimester: "2nd Tri",
      content: "Hip circles have been a lifesaver for my lower back pain! Been doing them daily for 2 weeks and the difference is amazing. 🎉",
      timeAgo: "3 hours ago",
      likes: 24,
      comments: 7,
      tags: ["Hip Circles", "Back Pain Relief"]
    },
    {
      id: '2',
      author: "Maya K.",
      avatar: "MK",
      trimester: "3rd Tri", 
      content: "Just completed my 30-day birth ball challenge! Started in my second trimester and now at 36 weeks, I feel so much more prepared for labor.",
      timeAgo: "Yesterday",
      likes: 42,
      comments: 12,
      tags: ["30-Day Challenge", "Labor Prep"]
    },
    {
      id: '3',
      author: "Jessica R.",
      avatar: "JR",
      trimester: "1st Tri",
      content: "New to birth ball exercises - the seated posture work has helped so much with my nausea. Who knew?! 💚",
      timeAgo: "2 days ago",
      likes: 18,
      comments: 5,
      tags: ["First Trimester", "Seated Posture"]
    },
    {
      id: '4',
      author: "Emma L.",
      avatar: "EL",
      trimester: "3rd Tri",
      content: "Figure eights are my favorite! They really help with opening the pelvis. My midwife is so impressed with my progress.",
      timeAgo: "3 days ago",
      likes: 31,
      comments: 9,
      tags: ["Figure Eights", "Pelvic Opening"]
    },
    {
      id: '5',
      author: "Rachel M.",
      avatar: "RM",
      trimester: "2nd Tri",
      content: "Started doing pelvic tilts this week and wow, what a difference! My lower back feels so much better already.",
      timeAgo: "4 days ago",
      likes: 15,
      comments: 4,
      tags: ["Pelvic Tilts", "Back Relief"]
    }
  ]);
  const [newPost, setNewPost] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('birth-ball-community')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'birth_ball_exercise_logs'
        },
        () => {
          // Simulate new activity when someone logs an exercise
          toast.success('New community activity!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked 
          }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const userTrimester = profile?.motherhood_stage === 'pregnant' ? '2nd Tri' : '1st Tri';
    const userInitials = profile?.display_name?.split(' ').map(n => n[0]).join('') || 'U';
    
    const post: Post = {
      id: Date.now().toString(),
      author: profile?.display_name || 'Anonymous',
      avatar: userInitials,
      trimester: userTrimester,
      content: newPost,
      timeAgo: 'Just now',
      likes: 0,
      comments: 0,
      tags: ['Birth Ball']
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Post shared with the community!');
  };

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  
  const filteredPosts = posts
    .filter(post => !filterTag || post.tags.includes(filterTag))
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return 0; // Keep recent order
    });

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/birth-ball-guide" className="text-muted-foreground hover:text-foreground">
              ← Back to Birth Ball Guide
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Birth Ball Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Share your journey, get support, and connect with other moms practicing birth ball exercises
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Share Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="How's your birth ball practice going today?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Share tips, ask questions, or celebrate milestones
                  </p>
                  <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                >
                  Recent
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('popular')}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Popular
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterTag(null)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {filterTag || 'All Posts'}
              </Button>
            </div>

            {/* Posts Feed */}
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">{post.trimester}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                    </div>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? 'fill-primary text-primary' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filterTag === tag 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-primary">856</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">1,234</p>
                  <p className="text-sm text-muted-foreground">Posts This Month</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">4.8★</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/birth-ball-guide/trimester-1" className="block px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  1st Trimester Exercises
                </Link>
                <Link to="/birth-ball-guide/trimester-2" className="block px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  2nd Trimester Exercises
                </Link>
                <Link to="/birth-ball-guide/trimester-3" className="block px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  3rd Trimester Exercises
                </Link>
                <Link to="/birth-ball-guide/safety" className="block px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                  Safety Guidelines
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BirthBallCommunityFeed;
