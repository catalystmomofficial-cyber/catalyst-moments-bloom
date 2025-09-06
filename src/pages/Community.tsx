import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Share2, Users, ThumbsUp, Calendar, Search, Camera, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicCommunityFeed } from '@/components/community/DynamicCommunityFeed';
import { ProgressTracker } from '@/components/gamification/ProgressTracker';
import SubscriptionPrompt from '@/components/subscription/SubscriptionPrompt';
import { Link, useLocation } from 'react-router-dom';
import { getGroupsForStage } from '@/components/community/groups';
import communityCover from '@/assets/community-cover.jpg';
import EnhancedGroupsList from '@/components/community/EnhancedGroupsList';
import EnhancedEventsList from '@/components/community/EnhancedEventsList';

const Community = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { user, profile, subscribed } = useAuth();
  
  const isTTC = profile?.motherhood_stage === 'ttc';
  const stageGroups = getGroupsForStage(profile?.motherhood_stage);
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'feed';
  
  return (
    <PageLayout>
      {/* Hero Section with Cover Image */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={communityCover} 
            alt="CatalystMom Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to Our
              <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
              Connect with amazing mothers on similar journeys. Share experiences, get support, and grow together.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <Users className="h-5 w-5 mr-2" />
                Join Discussions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Camera className="h-5 w-5 mr-2" />
                Share Your Story
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover-scale">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-2">2,847</div>
              <p className="text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card className="text-center hover-scale">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-2">12,435</div>
              <p className="text-muted-foreground">Conversations</p>
            </CardContent>
          </Card>
          <Card className="text-center hover-scale">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-2">48,921</div>
              <p className="text-muted-foreground">Hearts Given</p>
            </CardContent>
          </Card>
          <Card className="text-center hover-scale">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold gradient-text mb-2">1,256</div>
              <p className="text-muted-foreground">Success Stories</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 gradient-text">Community Hub</h2>
            <p className="text-muted-foreground mb-4 md:mb-0">
              Connect and share with other moms on similar journeys
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search community..." 
                className="pl-9"
              />
            </div>
            <Button>
              <Users className="h-4 w-4 mr-2" /> Join Groups
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={initialTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3 space-y-6">
                {subscribed ? (
                  <Card>
                    <CardHeader className="p-4 flex flex-row items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>CM</AvatarFallback>
                      </Avatar>
                      <Input placeholder="Share something with other moms..." />
                      <Button size="sm">Post</Button>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card className="text-center p-8">
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Join our community to share and connect with other moms</p>
                      <Button onClick={() => setShowSubscriptionPrompt(true)}>
                        Unlock Community Access
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                <SubscriptionPrompt 
                  isOpen={showSubscriptionPrompt} 
                  onClose={() => setShowSubscriptionPrompt(false)} 
                />
                
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {(isTTC ? 
                    ['all', 'ttc', 'fertility', 'nutrition', 'stress-relief', 'cycle-tracking'] :
                    ['all', 'postpartum', 'toddlers', 'sleep', 'fitness', 'nutrition']
                  ).map((filter) => (
                    <Button 
                      key={filter} 
                      variant={activeFilter === filter ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className="capitalize"
                    >
                      {filter === 'ttc' ? 'TTC' : filter.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
                
                <DynamicCommunityFeed isTTC={isTTC} />
              </div>
              
              <div className="md:w-1/3 space-y-6">
                <ProgressTracker userStage={profile?.motherhood_stage} />
                <Card>
                  <CardHeader className="pb-2">
                    <EnhancedGroupsList />
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <EnhancedEventsList />
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold">Trending Topics</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-primary hover:underline cursor-pointer">#PostpartumRecovery</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">#MomSelfCare</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">#ToddlerMeals</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">#FitMom</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">#SleepTraining</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="groups">
            {subscribed ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {stageGroups.map((g) => (
                  <Card key={g.slug} className="overflow-hidden transition hover:shadow-md hover-scale">
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={g.coverImage}
                        alt={`${g.name} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503264116251-35a269479413'; }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold leading-tight">{g.name}</h3>
                        <Badge variant="secondary" className="text-xs capitalize">{g.badge || g.journey}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{g.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" /> {g.memberCount.toLocaleString()} members
                        </span>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/community/groups/${g.slug}`}>View Group</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-semibold mb-2">Access Premium Groups</h3>
                    <p className="text-muted-foreground mb-4">
                      Join our exclusive community groups to connect with other moms on similar journeys
                    </p>
                    <Button onClick={() => setShowSubscriptionPrompt(true)}>
                      Unlock Groups
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events">
            <EnhancedEventsList />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

interface CommunityPostProps {
  avatar: string;
  name: string;
  badge: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  tags: string[];
}

const CommunityPost = ({ avatar, name, badge, time, content, image, likes, comments, tags }: CommunityPostProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar>
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <p className="font-semibold">{name}</p>
              <Badge variant="secondary" className="text-xs">{badge}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-4">{content}</p>
          {image && (
            <img 
              src={image} 
              alt="Post content" 
              className="rounded-lg w-full max-h-80 object-cover mb-4" 
            />
          )}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span 
                key={tag}
                className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ThumbsUp className="h-4 w-4 mr-2" /> {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-2" /> {comments}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Community;