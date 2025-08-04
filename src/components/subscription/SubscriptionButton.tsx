import React from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const SubscriptionButton = ({ variant = "default", size = "default", className }: SubscriptionButtonProps) => {
  const { isAuthenticated, subscribed } = useAuth();

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Error creating checkout:', error);
        toast.error("Failed to create checkout session");
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred");
    }
  };

  if (subscribed) {
    return null;
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleSubscribe}
    >
      Subscribe for $49.99/month
    </Button>
  );
};

export default SubscriptionButton;