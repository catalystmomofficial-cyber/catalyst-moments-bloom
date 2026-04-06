import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TTCCommunitySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          TTC Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <h4 className="font-medium mb-1">No posts yet</h4>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Be the first to share your TTC journey. Connect with others for support, tips, and encouragement.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/community?filter=ttc">Start a Conversation</Link>
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
