import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ArrowLeft, Bell, ShieldCheck } from 'lucide-react';
import { DynamicCommunityFeed } from '@/components/community/DynamicCommunityFeed';
import { groups } from '@/components/community/groups';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutModal from '@/components/subscription/CheckoutModal';

const GroupDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, subscribed } = useAuth();
  const group = useMemo(() => groups.find(g => g.slug === slug), [slug]);
  const [isMember, setIsMember] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState('general');

  useEffect(() => {
    if (group) {
      document.title = `${group.name} | Community Group`;
      // Default to first subcategory
      if (group.subCategories.length > 0) {
        setActiveSubCategory(group.subCategories[0].id);
      }
    }
  }, [group]);

  if (!group) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto">
          <div className="py-12 text-center">
            <p className="text-lg font-medium mb-2">Group not found</p>
            <Link to="/community" className="text-primary underline">Back to Community</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isTTCGroup = group.journey === 'ttc';
  const isFreeGroup = !!group.isFree;

  const handleJoin = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to join groups", variant: "destructive" });
      navigate('/login');
      return;
    }

    if (!isFreeGroup && !subscribed) {
      setShowSubscriptionPrompt(true);
      return;
    }

    setIsMember(!isMember);
    toast({
      title: isMember ? 'Left group' : 'Welcome!',
      description: isMember
        ? `You will no longer receive updates from ${group.name}.`
        : `You've joined ${group.name}`,
    });
  };

  const activeSubCategoryData = group.subCategories.find(sc => sc.id === activeSubCategory);

  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        {/* Hero Header */}
        <div className="rounded-xl overflow-hidden border mb-6">
          <div className="relative h-40 sm:h-56 md:h-64">
            <img
              src={group.coverImage}
              alt={`${group.name} cover`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503264116251-35a269479413'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow">
                  <AvatarFallback>{group.badge || group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold leading-tight">{group.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.memberCount.toLocaleString()} members</span>
                    <Badge variant="secondary" className="text-xs capitalize">{group.journey}</Badge>
                    {group.isFree && <Badge variant="outline" className="text-xs border-green-600 text-green-600/80">Free</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild size="sm">
                  <Link to="/community?tab=groups"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
                </Button>
                <Button onClick={handleJoin} size="sm">
                  {isMember ? 'Joined' : 'Join Group'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory Tabs */}
        {group.subCategories.length > 0 && (
          <Tabs value={activeSubCategory} onValueChange={setActiveSubCategory} className="mb-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              {group.subCategories.map(sc => (
                <TabsTrigger key={sc.id} value={sc.id} className="whitespace-nowrap">
                  {sc.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeSubCategoryData && (
              <p className="text-sm text-muted-foreground mt-2 px-1">
                {activeSubCategoryData.description}
              </p>
            )}
          </Tabs>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {activeSubCategoryData?.label || 'Group Feed'}
                </h2>
                <DynamicCommunityFeed groupSlug={`${group.slug}-${activeSubCategory}`} isTTC={isTTCGroup} />
              </CardContent>
            </Card>

            <CheckoutModal
              isOpen={showSubscriptionPrompt}
              onClose={() => setShowSubscriptionPrompt(false)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">About this group</h3>
                <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Bell className="h-4 w-4" />
                  <span>Auto-moderated with friendly prompts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Be kind. Share support. No medical advice.</span>
                </div>
                <Separator className="my-4" />
                <h4 className="text-sm font-medium mb-2">Sub-categories</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.subCategories.map(sc => (
                    <Badge
                      key={sc.id}
                      variant={activeSubCategory === sc.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setActiveSubCategory(sc.id)}
                    >
                      {sc.label}
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleJoin} className="w-full" variant={isMember ? 'secondary' : 'default'}>
                  {isMember ? 'Joined' : 'Join Group'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Members online now</h3>
                <div className="flex -space-x-2 mb-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Avatar key={i} className="h-8 w-8 ring-2 ring-background">
                      <AvatarFallback>{['A', 'S', 'J', 'M', 'K', 'L', 'E'][i]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Active discussions happening — jump in and say hi!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GroupDetail;
