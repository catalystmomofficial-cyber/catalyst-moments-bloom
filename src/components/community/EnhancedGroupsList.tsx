import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  shortName: string;
  memberCount: number;
  hasNewPosts: boolean;
  activeNow: number;
  description: string;
  color: string;
  recentMembers: number[];
}

const userGroups: Group[] = [
  {
    id: 'postpartum-support',
    name: 'Postpartum Support',
    shortName: 'PP',
    memberCount: 1245,
    hasNewPosts: true,
    activeNow: 23,
    description: 'Support and guidance for the postpartum journey',
    color: 'bg-pink-500',
    recentMembers: [0, 1, 2, 3],
  },
  {
    id: 'working-moms',
    name: 'Working Moms',
    shortName: 'WM',
    memberCount: 876,
    hasNewPosts: false,
    activeNow: 15,
    description: 'Balancing career and motherhood together',
    color: 'bg-blue-500',
    recentMembers: [1, 3, 4],
  },
  {
    id: 'fitness-together',
    name: 'Fitness Together',
    shortName: 'FT',
    memberCount: 2104,
    hasNewPosts: false,
    activeNow: 31,
    description: 'Fitness motivation and workout buddies',
    color: 'bg-green-500',
    recentMembers: [0, 2, 4, 5],
  },
];

const EnhancedGroupsList = () => {
  const getRandomActiveMembers = (count: number, recentMembers: number[]) => {
    return recentMembers.slice(0, Math.min(count, 4));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Users className="h-4 w-4 mr-2" /> Your Groups
        </h3>
        <Button variant="ghost" size="sm" className="text-primary">
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {userGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-full ${group.color} flex items-center justify-center relative`}>
                    <span className="text-xs font-medium text-white">{group.shortName}</span>
                    {group.hasNewPosts && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{group.name}</p>
                      {group.hasNewPosts && (
                        <Badge variant="secondary" className="text-xs">
                          New posts
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.memberCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {group.activeNow} active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {getRandomActiveMembers(3, group.recentMembers).map((_, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-[10px]">M{index + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/community/groups/${group.id}`}>
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link to="/community?tab=groups">
          View All Groups
        </Link>
      </Button>
    </div>
  );
};

export default EnhancedGroupsList;