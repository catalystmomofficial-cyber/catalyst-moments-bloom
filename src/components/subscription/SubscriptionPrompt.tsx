import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SubscriptionPrompt = () => {
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription process');
    }
  };

  const handleContinueBrowsing = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-none">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Complete Your Journey</h1>
            <p className="text-muted-foreground">
              Unlock full access to all programs and features
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Premium Access</h3>
              </div>
              
              <div className="text-3xl font-bold">$49.99/month</div>
              
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All workout programs & courses</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Personalized nutrition plans</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Access to dedicated Wellness Coach</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progress tracking & analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Community support</span>
                </div>
              </div>

              <Button 
                onClick={handleSubscribe}
                className="w-full mt-4"
                size="lg"
              >
                Join 1,000+ moms on their wellness journey
              </Button>
            </CardContent>
          </Card>

          <Button 
            onClick={handleContinueBrowsing}
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
          >
            Continue browsing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPrompt;