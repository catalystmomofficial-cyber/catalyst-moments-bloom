import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BirthBallCommunitySection = () => {
  const birthBallPosts = [
    {
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
      author: "Jessica R.",
      avatar: "JR",
      trimester: "1st Tri",
      content: "New to birth ball exercises - the seated posture work has helped so much with my nausea. Who knew?! 💚",
      timeAgo: "2 days ago",
      likes: 18,
      comments: 5,
      tags: ["First Trimester", "Seated Posture"]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Birth Ball Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {birthBallPosts.map((post, index) => (
          <div key={index} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{post.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{post.author}</span>
                  <Badge variant="secondary" className="text-xs">{post.trimester}</Badge>
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
          <h4 className="font-medium mb-2">Join the Birth Ball Community</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Share your progress, get tips, and connect with other moms practicing birth ball exercises
          </p>
          <Button variant="outline" size="sm">
            Join Community
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/community/birth-ball">View All Posts</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
