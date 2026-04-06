import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, MessageCircle, Lock, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DynamicCommunityFeed } from '@/components/community/DynamicCommunityFeed';
import CheckoutModal from '@/components/subscription/CheckoutModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getGroupsForStage } from '@/components/community/groups';
import EnhancedGroupsList from '@/components/community/EnhancedGroupsList';
import EnhancedEventsList from '@/components/community/EnhancedEventsList';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const Community = () => {
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const { user, profile, subscribed } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isTTC = profile?.motherhood_stage === 'ttc';
  const stageGroups = getGroupsForStage(profile?.motherhood_stage);
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'groups';

  const handleGroupClick = (group: ReturnType<typeof getGroupsForStage>[number]) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to view groups", variant: "destructive" });
      navigate('/login');
      return;
    }
    if (group.isFree) {
      navigate(`/community/groups/${group.slug}`);
      return;
    }
    if (!subscribed) {
      setShowSubscriptionPrompt(true);
      return;
    }
    navigate(`/community/groups/${group.slug}`);
  };
  
  return (
    <PageLayout>
      {/* WhatsApp-style header */}
      <div className="bg-primary text-primary-foreground px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Community</h1>
          <p className="text-sm opacity-80">Connect with moms on similar journeys</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <Tabs defaultValue={initialTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="mt-2">
            <DynamicCommunityFeed isTTC={isTTC} />
          </TabsContent>

          <TabsContent value="groups" className="mt-2">
            <div className="space-y-2">
              {stageGroups.map((g) => {
                const isLocked = !g.isFree && !subscribed;
                return (
                  <div
                    key={g.slug}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer active:bg-muted transition-colors"
                    onClick={() => handleGroupClick(g)}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={g.coverImage}
                        alt={g.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{g.name}</h3>
                        {g.isFree && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{g.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-0.5" />
                        {g.memberCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-2">
            <EnhancedEventsList />
          </TabsContent>
        </Tabs>
      </div>

      <CheckoutModal isOpen={showSubscriptionPrompt} onClose={() => setShowSubscriptionPrompt(false)} />
    </PageLayout>
  );
};

export default Community;
