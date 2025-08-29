import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PremiumGuard = ({ children, fallback }: PremiumGuardProps) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      // Allow admin user (you) to access everything
      if (user.email === 'catalystmom@outlook.com') {
        setIsPremium(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('premium_users')
          .select('is_premium, subscription_end')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking premium status:', error);
          setIsPremium(false);
        } else if (data) {
          const isActive = data.is_premium && (
            !data.subscription_end || 
            new Date(data.subscription_end) > new Date()
          );
          setIsPremium(isActive);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to access premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => window.location.href = '/auth/login'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isPremium) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <Crown className="h-16 w-16 mx-auto mb-4 text-amber-500" />
          <CardTitle className="text-2xl gradient-text">Premium Feature</CardTitle>
          <CardDescription className="text-lg">
            Unlock the full potential of your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI-powered wellness coaching</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Personalized meal plans & workouts</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Phone consultations with Dr. Maya</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Advanced progress tracking</span>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold gradient-text">$29.99/month</div>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Premium subscription will be available soon!",
                });
              }}
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Premium
            </Button>
            <p className="text-xs text-muted-foreground">
              Cancel anytime • 7-day free trial
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default PremiumGuard;