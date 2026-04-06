import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TTCCommunitySection = () => {
  const ttcPosts = [
    {
      author: "Emma R.",
      avatar: "ER",
      content: "Month 8 TTC and feeling hopeful! The fertility yoga has been such a game-changer for my stress levels.",
      timeAgo: "2 hours ago",
      likes: 12,
      comments: 4,
      tags: ["TTC Journey", "Stress Relief"]
    },
    {
      author: "Lisa M.",
      avatar: "LM", 
      content: "Just wanted to share that tracking my cycle with the app helped me understand my body so much better. Sending love to all you beautiful souls! 💕",
      timeAgo: "Yesterday",
      likes: 28,
      comments: 8,
      tags: ["Cycle Tracking", "Support"]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          TTC Community Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ttcPosts.map((post, index) => (
          <div key={index} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{post.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{post.author}</span>
                  <Badge variant="secondary" className="text-xs">TTC Member</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
              </div>
            </div>
            
            <p className="text-sm">{post.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <h4 className="font-medium mb-2">Join the TTC Community</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Connect with others on similar journeys for support, tips, and encouragement
          </p>
          <Button variant="outline" size="sm">
            Join TTC Group
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/community?filter=ttc">View TTC Community</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};