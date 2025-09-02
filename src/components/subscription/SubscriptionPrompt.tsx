import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionPromptProps {
  title?: string;
  description?: string;
  action?: string;
}

const SubscriptionPrompt = ({ 
  title = "Premium Feature", 
  description = "Subscribe to unlock this feature and access all premium content.",
  action = "Subscribe Now"
}: SubscriptionPromptProps) => {
  const { setShowCheckoutModal } = useAuth();

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-4">
          <div className="rounded-full bg-muted p-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 rounded-full bg-primary p-1">
            <Star className="h-3 w-3 text-primary-foreground fill-current" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        <Button 
          onClick={async () => {
            try {
              const { data, error } = await supabase.functions.invoke('create-checkout');
              if (error) throw error;
              if (data?.url) {
                window.open(data.url, '_blank');
              }
            } catch (error) {
              console.error('Checkout error:', error);
              toast.error('Failed to start checkout process');
            }
          }}
          size="lg"
          className="rounded-full"
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPrompt;