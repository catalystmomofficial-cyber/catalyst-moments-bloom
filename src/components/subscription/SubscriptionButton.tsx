import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  plan?: 'monthly' | 'yearly';
}

const SubscriptionButton = ({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Subscribe Now",
  plan = "monthly"
}: SubscriptionButtonProps) => {
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription process');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSubscribe}
    >
      {children}
    </Button>
  );
};

export default SubscriptionButton;