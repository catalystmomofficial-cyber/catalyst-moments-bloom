import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Coins, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CreditPurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const credits = searchParams.get('credits');
  const userId = searchParams.get('user_id');

  useEffect(() => {
    const addCredits = async () => {
      if (!credits || !userId) {
        setProcessing(false);
        return;
      }

      try {
        const { error } = await supabase.functions.invoke('add-credits', {
          body: { user_id: userId, credits: parseInt(credits) }
        });

        if (error) throw error;

        setSuccess(true);
        toast({
          title: "Credits Added!",
          description: `${credits} credits have been added to your account.`,
        });
      } catch (error) {
        console.error('Error adding credits:', error);
        toast({
          title: "Error",
          description: "There was an issue adding your credits. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    };

    addCredits();
  }, [credits, userId, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {processing ? (
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <h2 className="text-xl font-semibold">Processing your purchase...</h2>
              <p className="text-muted-foreground">Adding credits to your account</p>
            </div>
          ) : success ? (
            <div className="space-y-6">
              <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-green-600">Purchase Successful!</h2>
                <p className="text-muted-foreground mt-2">
                  Thank you for your purchase
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-primary">{credits}</span>
                  <span className="text-muted-foreground">credits added</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/wellness')} 
                  className="w-full"
                >
                  Talk to Wellness Coach
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-20 w-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Coins className="h-12 w-12 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-muted-foreground">
                Please contact support if your payment was processed.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditPurchaseSuccess;
