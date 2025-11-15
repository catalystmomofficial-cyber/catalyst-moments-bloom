import { useState, useEffect } from 'react';
import { useAuth, MotherhoodStage } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

export const GoogleAuthOnboarding = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [motherhoodStage, setMotherhoodStage] = useState<MotherhoodStage>('none');
  const [loading, setLoading] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);


  // Calculate profile completion percentage
  useEffect(() => {
    if (profile) {
      let completed = 0;
      const totalFields = 2; // display_name and motherhood_stage
      
      if (profile.display_name) completed++;
      if (profile.motherhood_stage && profile.motherhood_stage !== 'none') completed++;
      
      setCompletionPercentage((completed / totalFields) * 100);
    }
  }, [profile]);

  // Calculate current form completion
  const currentFormCompletion = () => {
    let completed = 0;
    if (displayName.trim()) completed += 50;
    if (motherhoodStage && motherhoodStage !== 'none') completed += 50;
    return completed;
  };

  useEffect(() => {
    // Only show onboarding if user is authenticated via Google and profile is missing info
    if (user && profile) {
      const needsOnboarding = !profile.display_name || !profile.motherhood_stage || profile.motherhood_stage === 'none';
      
      // Check if user signed in with Google
      const isGoogleUser = user.app_metadata?.provider === 'google';
      
      if (needsOnboarding && isGoogleUser) {
        setOpen(true);
        // Pre-fill display name from Google if available
        if (!profile.display_name && user.user_metadata?.full_name) {
          setDisplayName(user.user_metadata.full_name);
        }
      }
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate if this is first-time profile completion
      const wasIncomplete = !profile?.display_name || !profile?.motherhood_stage;
      
      await updateProfile({
        display_name: displayName,
        motherhood_stage: motherhoodStage,
      });

      // Award bonus points for completing profile (only on first completion)
      if (wasIncomplete && user) {
        try {
          const { error: pointsError } = await supabase.rpc('add_user_points', {
            p_user_id: user.id,
            p_points: 100,
            p_source: 'profile_completion',
            p_description: 'Profile completion bonus! Welcome to Catalyst Mom 🎉'
          });

          if (pointsError) {
            console.error('Error awarding points:', pointsError);
          }
        } catch (error) {
          console.error('Error awarding points:', error);
        }
      }

      toast({
        title: wasIncomplete ? 'Profile Complete! +100 Points! 🎉' : 'Profile Updated! 🎉',
        description: wasIncomplete 
          ? 'You earned 100 bonus points for completing your profile!'
          : 'Your profile has been updated successfully.',
      });

      setOpen(false);
      
      // Navigate to dashboard to trigger subscription flow
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl">Welcome to Catalyst Mom!</DialogTitle>
          </div>
          <DialogDescription>
            Let's personalize your experience. Complete your profile to earn bonus points!
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Profile Completion</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{Math.round(currentFormCompletion())}%</span>
            </div>
          </div>
          <Progress value={currentFormCompletion()} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete your profile to earn <strong className="text-primary">100 bonus points!</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="flex items-center gap-2">
              Display Name *
              {displayName.trim() && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </Label>
            <Input
              id="displayName"
              placeholder="How should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherhoodStage" className="flex items-center gap-2">
              Motherhood Journey *
              {motherhoodStage && motherhoodStage !== 'none' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </Label>
            <Select onValueChange={(value) => setMotherhoodStage(value as MotherhoodStage)} required>
              <SelectTrigger id="motherhoodStage">
                <SelectValue placeholder="Select your current stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ttc">Trying to Conceive</SelectItem>
                <SelectItem value="pregnant">Pregnant</SelectItem>
                <SelectItem value="postpartum">Postpartum (0-12 months)</SelectItem>
                <SelectItem value="toddler">Toddler Mom</SelectItem>
                <SelectItem value="none">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Earn Rewards!</p>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to unlock <strong className="text-primary">100 bonus points</strong> and 
                  personalized fitness plans, nutrition guidance, and community recommendations.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !displayName.trim() || !motherhoodStage || motherhoodStage === 'none'}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                {currentFormCompletion() === 100 && <Award className="mr-2 h-4 w-4" />}
                Complete Setup {currentFormCompletion() === 100 && '& Earn 100 Points!'}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
