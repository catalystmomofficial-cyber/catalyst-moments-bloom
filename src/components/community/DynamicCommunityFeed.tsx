import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Trophy, Star, Flame, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { groupDiscussions, moderationPrompts, activityMessages, type CommunityPost } from './GroupDiscussions';

// Import member avatars
import mom1 from '@/assets/member-avatars/mom-1.jpg';
import mom2 from '@/assets/member-avatars/mom-2.jpg';
import mom3 from '@/assets/member-avatars/mom-3.jpg';
import mom4 from '@/assets/member-avatars/mom-4.jpg';
import mom5 from '@/assets/member-avatars/mom-5.jpg';
import mom6 from '@/assets/member-avatars/mom-6.jpg';

const memberAvatars = [mom1, mom2, mom3, mom4, mom5, mom6];

interface DynamicCommunityFeedProps {
  groupSlug?: string;
  isTTC?: boolean;
}

export const DynamicCommunityFeed = ({ groupSlug, isTTC = false }: DynamicCommunityFeedProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [currentModerationPrompt, setCurrentModerationPrompt] = useState<string>('');

  // Get group-specific posts or fallback to general content
  const getGroupPosts = (): CommunityPost[] => {
    if (groupSlug && groupDiscussions[groupSlug]) {
      return groupDiscussions[groupSlug];
    }
    
    // Fallback to legacy isTTC logic
    return isTTC ? [
      {
        id: '1',
        avatar: 'ER',
        name: 'Emma Rodriguez',
        badge: 'TTC Journey',
        time: '1 hour ago',
        content: 'Month 8 TTC and feeling hopeful! Started the fertility yoga sequence this week and it\'s been amazing for managing stress. The breathing exercises really help during the two-week wait. Anyone else find mindfulness helpful during their TTC journey?',
        likes: 18,
        comments: 12,
        tags: ['TTC', 'Fertility Yoga', 'Mindfulness'],
        achievement: 'Consistency Champion'
      }
    ] : [
      {
        id: '1',
        avatar: 'J',
        name: 'Jessica Miller',
        badge: 'Newborn Mom',
        time: '2 hours ago',
        content: 'Just completed my first postpartum workout! It was only 10 minutes but I feel so accomplished. Any other moms finding it hard to get back into fitness with a newborn?',
        likes: 24,
        comments: 8,
        tags: ['Postpartum', 'Fitness'],
        achievement: 'First Step Champion'
      }
    ];
  };

  // Get group-specific activity messages
  const getActivityMessages = (): string[] => {
    if (groupSlug && activityMessages[groupSlug]) {
      return activityMessages[groupSlug];
    }
    
    // Fallback to general activity messages
    return [
      '🎉 Maria just completed her 7-day workout challenge!',
      '💪 New member Alex joined the Postpartum Recovery group',
      '❤️ 15 moms loved Sarah\'s sleep training tip',
      '🔥 Jessica is on a 5-day workout streak!',
      '⭐ Kim earned the "Nutrition Guru" badge',
      '👥 8 new moms joined the community today'
    ];
  };

  // Simulate dynamic likes and engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(currentPosts => 
        currentPosts.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3),
          comments: post.comments + Math.floor(Math.random() * 2)
        }))
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate recent activity rotation
  useEffect(() => {
    const groupActivityMessages = getActivityMessages();
    const interval = setInterval(() => {
      const randomActivity = groupActivityMessages[Math.floor(Math.random() * groupActivityMessages.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
    }, 8000); // New activity every 8 seconds

    // Initialize with some activities
    setRecentActivity([
      groupActivityMessages[0],
      groupActivityMessages[1],
      groupActivityMessages[2]
    ]);

    return () => clearInterval(interval);
  }, [groupSlug]);

  // Initialize posts and moderation prompt
  useEffect(() => {
    setPosts(getGroupPosts());
    setCurrentModerationPrompt(moderationPrompts[Math.floor(Math.random() * moderationPrompts.length)]);
  }, [groupSlug, isTTC]);

  // Rotate moderation prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModerationPrompt(moderationPrompts[Math.floor(Math.random() * moderationPrompts.length)]);
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Auto-Moderation Prompt */}
      {currentModerationPrompt && (
        <Card className="border-accent/30 bg-gradient-to-r from-accent/10 to-secondary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Community Guidelines</p>
                <p className="text-sm text-muted-foreground">{currentModerationPrompt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Activity Feed */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="font-semibold text-sm">Live Community Activity</h3>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`text-sm transition-all duration-500 ${index === 0 ? 'font-medium text-primary animate-fade-in' : 'text-muted-foreground'}`}>
                {activity}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Posts */}
      {posts.map((post) => (
        <CommunityPost key={post.id} post={post} />
      ))}
    </div>
  );
};

const CommunityPost = ({ post }: { post: CommunityPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const { subscribed, setShowCheckoutModal } = useAuth();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    // Comment functionality would go here
  };

  const handleShare = () => {
    // Share functionality would go here
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${post.isNew ? 'ring-1 ring-primary/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar className="relative">
            <AvatarImage 
              src={memberAvatars[Math.floor(Math.random() * memberAvatars.length)]} 
              alt={post.name}
            />
            <AvatarFallback>{post.avatar}</AvatarFallback>
            {post.achievement && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-2 h-2 text-white" />
              </div>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <p className="font-semibold">{post.name}</p>
              <Badge variant="secondary" className="text-xs">{post.badge}</Badge>
              {post.isNew && <Badge variant="default" className="text-xs bg-primary">NEW</Badge>}
              {post.achievement && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                  <Star className="w-3 h-3 mr-1" />
                  {post.achievement}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-4">{post.content}</p>
          {post.image && (
            <img 
              src={post.image} 
              alt="Post content" 
              className="rounded-lg w-full max-h-80 object-cover mb-4" 
            />
          )}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{localLikes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};