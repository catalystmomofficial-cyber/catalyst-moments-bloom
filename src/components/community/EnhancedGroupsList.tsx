import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, TrendingUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getGroupsForStage, groups as allGroups, type CommunityGroup } from './groups';
import CheckoutModal from '@/components/subscription/CheckoutModal';

import mom1 from '@/assets/member-avatars/mom-1.jpg';
import mom2 from '@/assets/member-avatars/mom-2.jpg';
import mom3 from '@/assets/member-avatars/mom-3.jpg';
import mom4 from '@/assets/member-avatars/mom-4.jpg';
import mom5 from '@/assets/member-avatars/mom-5.jpg';
import mom6 from '@/assets/member-avatars/mom-6.jpg';

const memberAvatars = [mom1, mom2, mom3, mom4, mom5, mom6];

const colorForGroup = (g: CommunityGroup) => {
  switch (g.journey) {
    case 'ttc': return 'bg-pink-500';
    case 'pregnant': return 'bg-purple-500';
    case 'postpartum': return 'bg-rose-500';
    default: return 'bg-emerald-500';
  }
};

const shortName = (g: CommunityGroup) =>
  g.badge ||
  g.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

interface EnhancedGroupsListProps {
  onManage?: () => void;
  onViewAll?: () => void;
}

const EnhancedGroupsList = ({ onManage, onViewAll }: EnhancedGroupsListProps) => {
  const navigate = useNavigate();
  const { user, profile, subscribed } = useAuth();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = React.useState(false);

  // Always include Mom Life General + stage-relevant groups, deduped
  const stageGroups = getGroupsForStage(profile?.motherhood_stage);
  const general = allGroups.find(g => g.slug === 'mom-life-general');
  const merged: CommunityGroup[] = [];
  for (const g of [...(general ? [general] : []), ...stageGroups]) {
    if (!merged.find(m => m.slug === g.slug)) merged.push(g);
  }
  const userGroups = merged.slice(0, 4);

  const handleOpenGroup = (g: CommunityGroup) => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to view groups', variant: 'destructive' });
      navigate('/login');
      return;
    }
    if (g.isFree) {
      navigate(`/community/groups/${g.slug}`);
      return;
    }
    if (!subscribed) {
      setShowCheckout(true);
      return;
    }
    navigate(`/community/groups/${g.slug}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Users className="h-4 w-4 mr-2" /> Your Groups
        </h3>
        <Button variant="ghost" size="sm" className="text-primary" onClick={onManage}>
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {userGroups.map((g) => {
          const isLocked = !g.isFree && !subscribed;
          return (
            <Card
              key={g.slug}
              className="hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => handleOpenGroup(g)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${colorForGroup(g)} flex items-center justify-center relative shrink-0`}>
                      <span className="text-xs font-medium text-white">{shortName(g)}</span>
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full border border-border flex items-center justify-center">
                          <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">{g.name}</p>
                        {g.isFree && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">Free</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {g.memberCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <TrendingUp className="h-3 w-3" />
                          {g.journey}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex -space-x-1">
                      {memberAvatars.slice(0, 3).map((avatar, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-background">
                          <AvatarImage src={avatar} alt={`Member ${index + 1}`} />
                          <AvatarFallback className="text-xs">M{index + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGroup(g);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onViewAll}>
        View All Groups
      </Button>

      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  );
};

export default EnhancedGroupsList;
