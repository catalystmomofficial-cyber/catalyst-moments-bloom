import { useState, useEffect } from 'react';
import { useAuth, MotherhoodStage } from '@/contexts/AuthContext';
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
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GoogleAuthOnboarding = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [motherhoodStage, setMotherhoodStage] = useState<MotherhoodStage>('none');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show onboarding if user is authenticated via Google and profile is missing info
    if (user && profile) {
      const needsOnboarding = !profile.display_name || !profile.motherhood_stage;
      
      // Check if user signed in with Google by checking if they have a password
      // Google OAuth users won't have a password set
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
      await updateProfile({
        display_name: displayName,
        motherhood_stage: motherhoodStage,
      });

      toast({
        title: 'Welcome to Catalyst Mom! 🎉',
        description: 'Your profile has been set up successfully.',
      });

      setOpen(false);
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
            Let's personalize your experience. Tell us a bit about yourself.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="How should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherhoodStage">Motherhood Journey *</Label>
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

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              This helps us customize your fitness plans, nutrition guidance, and community recommendations
              specifically for your journey.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !displayName || motherhoodStage === 'none'}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
