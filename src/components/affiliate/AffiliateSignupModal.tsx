import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AffiliateSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: 'active_member', label: 'Active Member (current Catalyst Mom user)' },
  { value: 'wellness_pro', label: 'Wellness Professional (OB, midwife, doula, PT...)' },
  { value: 'creator', label: 'Creator / Mom Blogger / Influencer' },
  { value: 'other_advocate', label: 'Other Advocate' },
];

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AffiliateSignupModal = ({ isOpen, onClose }: AffiliateSignupModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    socialHandle: '',
    motivation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = user?.email || formData.email;
    if (!email || !isValidEmail(email)) {
      toast({
        title: 'Email Required',
        description: 'Please provide a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: 'Role Required',
        description: 'Please tell us which best describes you.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const roleLabel =
        ROLE_OPTIONS.find((r) => r.value === formData.role)?.label || formData.role;

      const { error } = await (supabase as any).rpc('create_affiliate_application', {
        full_name_param: formData.fullName,
        social_media_param: formData.socialHandle,
        audience_size_param: roleLabel,
        experience_param: roleLabel,
        motivation_param: formData.motivation,
        email_param: email,
      });

      if (error) throw error;

      toast({
        title: 'Application Submitted ✨',
        description:
          "We'll review your application and get back to you via email within 48 hours.",
        duration: 5000,
      });

      onClose();
      setFormData({
        fullName: '',
        email: '',
        role: '',
        socialHandle: '',
        motivation: '',
      });
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Apply to Partner with Catalyst Mom
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Help a mama heal — earn $29 for every paid referral.
          </p>
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
              placeholder="Your full name"
            />
          </div>

          {!user && (
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={isLoading}
                placeholder="your@email.com"
              />
            </div>
          )}

          <div>
            <Label htmlFor="role">Which best describes you? *</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => handleChange('role', v)}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="socialHandle">Social Handle / Website</Label>
            <Input
              id="socialHandle"
              placeholder="@yourhandle or yourwebsite.com"
              value={formData.socialHandle}
              onChange={(e) => handleChange('socialHandle', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="motivation">
              Why do you want to partner with Catalyst Mom? *
            </Label>
            <Textarea
              id="motivation"
              placeholder="Share your story and why you want to help moms heal..."
              value={formData.motivation}
              onChange={(e) => handleChange('motivation', e.target.value)}
              required
              disabled={isLoading}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By applying, you agree to our Partner Terms. We respect your privacy
            and will never share your data.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateSignupModal;
