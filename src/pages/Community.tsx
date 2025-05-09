
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Share2, Users, ThumbsUp, Calendar, Search } from 'lucide-react';

const Community = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community</h1>
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
        
        <Tabs defaultValue="feed" className="mb-8">
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3 space-y-6">
                <Card>
                  <CardHeader className="p-4 flex flex-row items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <Input placeholder="Share something with other moms..." />
                    <Button size="sm">Post</Button>
                  </CardHeader>
                </Card>
                
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {['all', 'postpartum', 'toddlers', 'sleep', 'fitness', 'nutrition'].map((filter) => (
                    <Button 
                      key={filter} 
                      variant={activeFilter === filter ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
                
                <CommunityPost 
                  avatar="J"
                  name="Jessica Miller"
                  badge="Newborn Mom"
                  time="2 hours ago"
                  content="Just completed my first postpartum workout! It was only 10 minutes but I feel so accomplished. Any other moms finding it hard to get back into fitness with a newborn?"
                  likes={24}
                  comments={8}
                  tags={["Postpartum", "Fitness"]}
                />
                <CommunityPost 
                  avatar="S"
                  name="Sarah Thompson"
                  badge="Toddler Mom"
                  time="Yesterday"
                  content="My toddler finally slept through the night after we tried the gentle sleep training method from the Wellness section! I've had my first full night's sleep in months. Has anyone else had success with this?"
                  likes={42}
                  comments={16}
                  tags={["Sleep", "Toddler"]}
                />
                <CommunityPost 
                  avatar="M"
                  name="Michelle Kennedy"
                  badge="Pregnancy"
                  time="2 days ago"
                  content="I've been doing the prenatal yoga sequence every morning and it's made such a difference with my back pain. Sharing a quick pic from today's session. Anyone else loving the prenatal workouts?"
                  image="https://images.unsplash.com/photo-1518495973542-4542c06a5843"
                  likes={38}
                  comments={7}
                  tags={["Pregnancy", "Yoga"]}
                />
              </div>
              
              <div className="md:w-1/3 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold flex items-center">
                      <Users className="h-4 w-4 mr-2" /> Your Groups
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-xs">PP</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Postpartum Support</p>
                          <p className="text-xs text-muted-foreground">1,245 members</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">New posts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-secondary/60 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-xs">WM</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Working Moms</p>
                          <p className="text-xs text-muted-foreground">876 members</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-accent/80 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-xs">FT</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fitness Together</p>
                          <p className="text-xs text-muted-foreground">2,104 members</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Groups
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Upcoming Events
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Virtual Meditation Session</p>
                      <p className="text-xs text-muted-foreground mb-1">Tomorrow, 8:00 PM</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">+</div>
                          <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">+</div>
                        </div>
                        <span className="text-xs text-muted-foreground">18 attending</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium">Q&A with Sleep Specialist</p>
                      <p className="text-xs text-muted-foreground mb-1">Friday, 1:00 PM</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">+</div>
                          <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">+</div>
                          <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-xs">+</div>
                        </div>
                        <span className="text-xs text-muted-foreground">34 attending</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Events
                    </Button>
                  </CardFooter>
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
            <div className="text-center py-10 border rounded-lg bg-muted/30">
              <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Discover Mom Groups</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect with moms at similar stages or with similar interests. Share advice, support, and friendship.
              </p>
              <Button>Explore Groups</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="text-center py-10 border rounded-lg bg-muted/30">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Community Events</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join virtual and local events where you can learn, connect, and grow with other moms.
              </p>
              <Button>Browse Events</Button>
            </div>
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
