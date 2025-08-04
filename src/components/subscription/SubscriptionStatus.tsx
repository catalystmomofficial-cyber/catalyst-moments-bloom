import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sparkles, Calendar, CreditCard } from "lucide-react";

const SubscriptionStatus = () => {
  const { subscribed, subscriptionTier, subscriptionEnd, checkSubscription } = useAuth();

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        toast.error("Failed to open subscription management");
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred");
    }
  };

  const handleRefreshStatus = async () => {
    await checkSubscription();
    toast.success("Subscription status refreshed");
  };

  if (!subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Premium Subscription
          </CardTitle>
          <CardDescription>
            Get access to premium content and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You don't have an active subscription. Subscribe to unlock all premium features.
          </p>
          <Button onClick={handleRefreshStatus} variant="outline" size="sm">
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  const endDate = subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString() : 'N/A';

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Premium Subscription
          <Badge variant="secondary" className="ml-auto">
            {subscriptionTier || 'Premium'}
          </Badge>
        </CardTitle>
        <CardDescription>
          You have an active premium subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Renewal Date: {endDate}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleManageSubscription}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Manage Subscription
          </Button>
          <Button 
            onClick={handleRefreshStatus} 
            variant="ghost" 
            size="sm"
          >
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;