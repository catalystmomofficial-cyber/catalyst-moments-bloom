import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Heart, MessageCircle, Plus, Clock, Baby, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  trimester: number;
  week: number;
  title: string;
  content: string;
  category: 'general' | 'symptoms' | 'nutrition' | 'exercise' | 'mental' | 'high-risk';
  likes: number;
  replies: number;
  timeAgo: string;
  isSupported?: boolean;
}

export const PregnancyCommunity = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Sarah M.',
      avatar: '👩🏻‍🦰',
      trimester: 2,
      week: 22,
      title: 'Second trimester energy is real!',
      content: 'I finally feel human again! The nausea is gone and I actually want to exercise. Anyone else feeling amazing in the second trimester?',
      category: 'general',
      likes: 12,
      replies: 8,
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      author: 'Emma K.',
      avatar: '👩🏽',
      trimester: 3,
      week: 34,
      title: 'Hip pain remedies that actually work?',
      content: 'My hips are killing me, especially at night. I\'ve tried pregnancy pillows but still struggling. What has helped you mamas?',
      category: 'symptoms',
      likes: 6,
      replies: 15,
      timeAgo: '4 hours ago'
    },
    {
      id: '3',
      author: 'Lisa T.',
      avatar: '👩🏻',
      trimester: 1,
      week: 8,
      title: 'Nausea-friendly protein ideas?',
      content: 'Everything makes me nauseous but I know I need protein. What are your go-to foods that actually stay down?',
      category: 'nutrition',
      likes: 9,
      replies: 23,
      timeAgo: '6 hours ago'
    },
    {
      id: '4',
      author: 'Maria G.',
      avatar: '👩🏻‍🦱',
      trimester: 2,
      week: 28,
      title: 'GD meal planning support',
      content: 'Just diagnosed with gestational diabetes. Feeling overwhelmed about meal planning. Anyone else managing GD have tips?',
      category: 'high-risk',
      likes: 4,
      replies: 7,
      timeAgo: '1 day ago'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as CommunityPost['category']
  });
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const handleAddPost = () => {
    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '👩🏻',
      trimester: 2,
      week: 21,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      likes: 0,
      replies: 0,
      timeAgo: 'Just now'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'general' });
    setIsNewPostOpen(false);

    toast({
      title: "Post shared",
      description: "Your post has been shared with the community",
    });
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isSupported: true }
        : post
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'symptoms': return 'bg-orange-100 text-orange-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      case 'mental': return 'bg-pink-100 text-pink-800';
      case 'high-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'high-risk': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const filterPostsByTrimester = (trimester: number) => {
    return posts.filter(post => post.trimester === trimester);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Pregnancy Community
          </div>
          <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Share with the Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
                  <Input
                    placeholder="Share your experience, ask a question..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Details</label>
                  <Textarea
                    placeholder="Share more details, ask for advice, or offer support..."
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select 
                    className="w-full p-2 border rounded text-sm"
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value as CommunityPost['category'] }))}
                  >
                    <option value="general">General</option>
                    <option value="symptoms">Symptoms & Discomfort</option>
                    <option value="nutrition">Nutrition & Food</option>
                    <option value="exercise">Exercise & Movement</option>
                    <option value="mental">Mental Health</option>
                    <option value="high-risk">High-Risk Support</option>
                  </select>
                </div>

                <Button onClick={handleAddPost} className="w-full">
                  Share Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Connect with other expecting moms at your stage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="first">1st Tri</TabsTrigger>
            <TabsTrigger value="second">2nd Tri</TabsTrigger>
            <TabsTrigger value="third">3rd Tri</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 max-h-[400px] overflow-y-auto">
            {posts.map((post) => (
              <div key={post.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="text-xl">{post.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{post.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.trimester === 1 ? '1st' : post.trimester === 2 ? '2nd' : '3rd'} Tri • Week {post.week}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                        {getCategoryIcon(post.category)}
                        {post.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-2">{post.title}</h4>
                    <p className="text-xs text-gray-700 mb-3 leading-relaxed">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likePost(post.id)}
                          className={`h-8 px-2 text-xs ${post.isSupported ? 'text-pink-600' : 'text-gray-500'}`}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${post.isSupported ? 'fill-current' : ''}`} />
                          {post.likes} {post.isSupported ? 'Supported' : 'Support'}
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-gray-500">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.replies} Replies
                        </Button>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.timeAgo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="first" className="space-y-3 max-h-[400px] overflow-y-auto">
            {filterPostsByTrimester(1).map((post) => (
              <div key={post.id} className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <div className="text-xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{post.author}</span>
                      <Badge variant="outline" className="text-xs">Week {post.week}</Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-700 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{post.likes} supports</span>
                      <span className="text-xs text-gray-500">{post.replies} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="second" className="space-y-3 max-h-[400px] overflow-y-auto">
            {filterPostsByTrimester(2).map((post) => (
              <div key={post.id} className="p-3 border rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  <div className="text-xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{post.author}</span>
                      <Badge variant="outline" className="text-xs">Week {post.week}</Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-700 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{post.likes} supports</span>
                      <span className="text-xs text-gray-500">{post.replies} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="third" className="space-y-3 max-h-[400px] overflow-y-auto">
            {filterPostsByTrimester(3).map((post) => (
              <div key={post.id} className="p-3 border rounded-lg bg-purple-50">
                <div className="flex items-start gap-3">
                  <div className="text-xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{post.author}</span>
                      <Badge variant="outline" className="text-xs">Week {post.week}</Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-700 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{post.likes} supports</span>
                      <span className="text-xs text-gray-500">{post.replies} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
          <p className="text-xs text-pink-700 leading-relaxed">
            💗 <strong>Community Guidelines:</strong> Be kind, supportive, and respectful. 
            Remember that medical advice should come from healthcare providers. We're here to support each other! 
          </p>
        </div>
      </CardContent>
    </Card>
  );
};