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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Crown className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Complete Your Journey</h2>
            <p className="text-muted-foreground">
              Unlock full access to all programs and features
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-xl font-semibold">Premium Access</h3>
            </div>
            
            <div className="text-3xl font-bold mb-4">$49.99/month</div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">All workout programs & courses</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Personalized nutrition plans</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Access to dedicated Wellness Coach</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Progress tracking & analytics</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">Community support</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubscribe}
            size="lg" 
            className="w-full mb-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Crown className="h-5 w-5 mr-2" />
            Join 1,000+ moms on their wellness journey
          </Button>

          <Button 
            onClick={handleContinueBrowsing}
            variant="ghost" 
            className="w-full text-muted-foreground"
          >
            Continue browsing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPrompt;