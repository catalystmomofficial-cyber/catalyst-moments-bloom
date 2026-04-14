import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Search, Camera, Star, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicCommunityFeed } from '@/components/community/DynamicCommunityFeed';
import { ProgressTracker } from '@/components/gamification/ProgressTracker';
import CheckoutModal from '@/components/subscription/CheckoutModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { getGroupsForStage } from '@/components/community/groups';
import communityCover from '@/assets/community-cover.jpg';
import EnhancedGroupsList from '@/components/community/EnhancedGroupsList';
import EnhancedEventsList from '@/components/community/EnhancedEventsList';
import { useToast } from '@/components/ui/use-toast';

const Community = () => {
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { user, profile, subscribed } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const stageGroups = getGroupsForStage(profile?.motherhood_stage);
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'feed';
  
  const handleInteractionClick = (action: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!subscribed) {
      setShowSubscriptionPrompt(true);
      return;
    }
  };

  const handleGroupClick = (group: ReturnType<typeof getGroupsForStage>[number]) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to view groups", variant: "destructive" });
      navigate('/login');
      return;
    }

    // Free groups are accessible to any logged-in user
    if (group.isFree) {
      navigate(`/community/groups/${group.slug}`);
      return;
    }

    // Non-free groups require subscription
    if (!subscribed) {
      setShowSubscriptionPrompt(true);
      return;
    }

    navigate(`/community/groups/${group.slug}`);
  };
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={communityCover} alt="CatalystMom Community" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to Our
              <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Community</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
              Connect with amazing mothers on similar journeys. Share experiences, get support, and grow together.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" onClick={() => handleInteractionClick('join')}>
                <Users className="h-5 w-5 mr-2" /> Join Discussions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" onClick={() => handleInteractionClick('share')}>
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, value: '2,847', label: 'Community Members' },
            { icon: MessageCircle, value: '12,435', label: 'Conversations' },
            { icon: Heart, value: '48,921', label: 'Hearts Given' },
            { icon: Star, value: '1,256', label: 'Success Stories' },
          ].map(({ icon: Icon, value, label }) => (
            <Card key={label} className="text-center hover-scale">
              <CardContent className="pt-6">
                <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold gradient-text mb-2">{value}</div>
                <p className="text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 gradient-text">Community Hub</h2>
            <p className="text-muted-foreground mb-4 md:mb-0">Connect and share with other moms on similar journeys</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search community..." className="pl-9" />
            </div>
            <Button onClick={() => handleInteractionClick('join-group')}>
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
                <CheckoutModal isOpen={showSubscriptionPrompt} onClose={() => setShowSubscriptionPrompt(false)} />
                
                <DynamicCommunityFeed groupSlug="mom-life-general-general" />
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
                  <CardHeader className="pb-2"><h3 className="font-semibold">Trending Topics</h3></CardHeader>
                  <CardContent className="space-y-2">
                    {['#PostpartumRecovery', '#MomSelfCare', '#ToddlerMeals', '#FitMom', '#SleepTraining'].map(tag => (
                      <p key={tag} className="text-sm text-primary hover:underline cursor-pointer">{tag}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="groups">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {stageGroups.map((g) => {
                const isLocked = !g.isFree && !subscribed;
                return (
                  <Card key={g.slug} className={`overflow-hidden transition hover:shadow-md hover-scale ${isLocked ? 'opacity-90' : ''}`}>
                    <div className="h-32 w-full overflow-hidden relative">
                      <img
                        src={g.coverImage}
                        alt={`${g.name} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503264116251-35a269479413'; }}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Lock className="h-8 w-8 text-white/80" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold leading-tight">{g.name}</h3>
                        <div className="flex items-center gap-1">
                          {g.isFree && <Badge variant="outline" className="text-xs text-green-600 border-green-600">Free</Badge>}
                          <Badge variant="secondary" className="text-xs capitalize">{g.badge || g.journey}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{g.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" /> {g.memberCount.toLocaleString()} members
                        </span>
                        <Button
                          size="sm"
                          variant={isLocked ? "default" : "outline"}
                          onClick={() => handleGroupClick(g)}
                        >
                          {isLocked ? (
                            <><Lock className="h-3 w-3 mr-1" /> Subscribe</>
                          ) : (
                            'View Group'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <EnhancedEventsList />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Community;
