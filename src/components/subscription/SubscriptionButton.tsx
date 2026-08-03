import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import posthog from '@/lib/posthog';

interface SubscriptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const SubscriptionButton = ({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Subscribe Now"
}: SubscriptionButtonProps) => {
  const { user, setShowCheckoutModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    // Open checkout modal
    setIsLoading(true);
    try {
      posthog.capture('subscription_checkout_opened');
      setShowCheckoutModal(true);
      toast.info("Opening secure checkout...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubscriptionButton;