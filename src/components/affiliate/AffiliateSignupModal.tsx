import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AffiliateSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AffiliateSignupModal = ({ isOpen, onClose }: AffiliateSignupModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    socialMediaHandles: '',
    audienceSize: '',
    experience: '',
    motivation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const { error } = await (supabase as any).rpc('create_affiliate_application', {
        full_name_param: formData.fullName,
        social_media_param: formData.socialMediaHandles,
        audience_size_param: formData.audienceSize,
        experience_param: formData.experience,
        motivation_param: formData.motivation,
        email_param: user?.email || 'guest@example.com'
      });

      if (error) throw error;

      toast({
        title: "Application Submitted! ✨",
        description: "We'll review your application within 24 hours and get back to you via email.",
        duration: 5000,
      });
      
      onClose();
      setFormData({
        fullName: '',
        socialMediaHandles: '',
        audienceSize: '',
        experience: '',
        motivation: ''
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join Catalyst Moms—Empower Moms, <span className="text-2xl font-bold">Earn $35 Per Sale!</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="socialMedia">Social Media Handles</Label>
            <Input
              id="socialMedia"
              placeholder="@yourusername on Instagram, TikTok, etc."
              value={formData.socialMediaHandles}
              onChange={(e) => handleChange('socialMediaHandles', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="audience">Audience Size (approximate)</Label>
            <Input
              id="audience"
              placeholder="e.g., 1K Instagram followers, 500 email subscribers"
              value={formData.audienceSize}
              onChange={(e) => handleChange('audienceSize', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Previous Affiliate/Marketing Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about any previous experience with affiliate marketing, content creation, or promoting products..."
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="motivation">Which moms do you want to help first? *</Label>
            <Textarea
              id="motivation"
              placeholder="Share your story and why you're passionate about helping other moms..."
              value={formData.motivation}
              onChange={(e) => handleChange('motivation', e.target.value)}
              required
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium mb-1">What happens next?</p>
          <ul className="space-y-1">
            <li>• We'll review your application within 24 hours</li>
            <li>• If approved, you'll receive an email with your affiliate dashboard access</li>
            <li>• Start earning <span className="font-bold text-lg">$35 per sale</span> for every subscription, course, or meal plan!</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateSignupModal;