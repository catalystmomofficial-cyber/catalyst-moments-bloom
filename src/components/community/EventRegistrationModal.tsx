import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, Zap, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/hooks/usePoints';
import type { Event } from './EnhancedEventsList';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  userPointsBalance?: number;
  onRegistrationComplete?: () => void;
}

type PaymentMethod = 'points' | 'stripe' | 'free' | 'member_free';

const EventRegistrationModal = ({
  isOpen,
  onClose,
  event,
  userPointsBalance = 0,
  onRegistrationComplete,
}: EventRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    questions: '',
    notifications: 'email',
    experience: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user, profile, subscribed } = useAuth();
  const { awardPoints } = usePoints();

  if (!event) return null;

  // Determine if this event has pricing (from Supabase) or uses the legacy free form
  const isPaidEvent = (event.priceNonMember ?? 0) > 0 || (event.pointsCost ?? 0) > 0;
  const hasEnoughPoints = userPointsBalance >= (event.pointsCost ?? 0);
  const memberPrice = event.priceMember ?? 0;
  const nonMemberPrice = event.priceNonMember ?? 0;
  const displayPrice = subscribed ? memberPrice : nonMemberPrice;
  const isFreeForUser = event.isFreeForMembers && !!subscribed;

  // ── Paid-event registration via Supabase RPC ────────────────────────────
  const handlePaidSubmit = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to register.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Deduct points first if using points
    if (paymentMethod === 'points') {
      const { error: pointsErr } = await supabase.rpc('add_user_points', {
        p_user_id: user.id,
        p_points: -(event.pointsCost ?? 0),
        p_source: 'event_registration',
        p_description: `Registered for ${event.title}`,
      } as any);

      if (pointsErr) {
        toast({ title: 'Points error', description: pointsErr.message, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
    }

    // Atomic registration via RPC
    const { data: result, error: regErr } = await (supabase as any).rpc('register_for_event', {
      p_event_id: event.id,
      p_user_id: user.id,
      p_payment_method: paymentMethod,
      p_points_used: paymentMethod === 'points' ? (event.pointsCost ?? 0) : 0,
      p_amount_paid: paymentMethod === 'stripe' ? displayPrice : 0,
    });

    if (regErr || !result?.success) {
      // Refund points if deduction happened but registration failed
      if (paymentMethod === 'points') {
        await supabase.rpc('add_user_points', {
          p_user_id: user.id,
          p_points: event.pointsCost ?? 0,
          p_source: 'event_registration_refund',
          p_description: `Refund for failed registration: ${event.title}`,
        } as any);
      }
      toast({
        title: 'Registration failed',
        description: result?.error ?? regErr?.message ?? 'Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Award +50 registration points
    await awardPoints(50, 'event_registration', `Registered for ${event.title}`);

    // Confirmation email (non-blocking)
    supabase.functions
      .invoke('send-transactional-email', {
        body: {
          templateName: 'event-confirmation',
          recipientEmail: user.email,
          idempotencyKey: `event-confirm-${event.id}-${user.id}`,
          templateData: {
            firstName: profile?.display_name ?? user.email?.split('@')[0],
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            instructor: event.instructor,
          },
        },
      })
      .catch((err) => console.error('Confirmation email failed:', err));

    setIsSuccess(true);
    onRegistrationComplete?.();
    toast({
      title: "You're registered! +50 pts",
      description: `You're in for ${event.title}. Check your email for the event link.`,
    });

    setTimeout(() => {
      setIsSuccess(false);
      setPaymentMethod('free');
      onClose();
    }, 3000);

    setIsSubmitting(false);
  };

  // ── Free-event / legacy form submission ────────────────────────────────
  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('event_registrations').insert({
      user_id: user?.id ?? null,
      event_id: event.id,
      event_title: event.title,
      event_date: event.date,
      event_time: event.time,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      questions: formData.questions || null,
      experience: formData.experience || null,
      notification_pref: formData.notifications,
      payment_method: 'free',
    });

    setIsSubmitting(false);

    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      return;
    }

    // Award +50 registration points
    if (user) await awardPoints(50, 'event_registration', `Registered for ${event.title}`);

    // Confirmation email (non-blocking)
    supabase.functions
      .invoke('send-transactional-email', {
        body: {
          templateName: 'event-confirmation',
          recipientEmail: formData.email,
          idempotencyKey: `event-confirm-${event.id}-${formData.email}`,
          templateData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            instructor: event.instructor,
          },
        },
      })
      .catch((err) => console.error('Confirmation email failed:', err));

    setIsSuccess(true);
    toast({
      title: "Registration Successful! +50 pts",
      description: `You're registered for ${event.title}. A confirmation email is on its way.`,
    });

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', questions: '', notifications: 'email', experience: '' });
      onClose();
    }, 3000);
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground mb-4">
              Registration confirmed for {event.title}
            </p>
            <Badge variant="secondary" className="mb-4">
              <Calendar className="h-3 w-3 mr-1" />
              {event.date} at {event.time}
            </Badge>
            <p className="text-sm text-muted-foreground">
              You earned +50 points for registering. You'll receive the event link via email.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Paid-event modal ────────────────────────────────────────────────────
  if (isPaidEvent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-primary`} />
              Register for {event.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Event summary */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{event.date} at {event.time}</span>
              </div>
              {event.instructor && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{event.instructor}</span>
                </div>
              )}
            </div>

            {/* Points balance */}
            {user && (
              <div className="flex items-center gap-2 text-sm bg-accent/20 rounded-lg px-4 py-2">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Your balance: <strong>{userPointsBalance.toLocaleString()} pts</strong>
                  {' '}(${(userPointsBalance / 100).toFixed(2)} value)
                </span>
              </div>
            )}

            {/* Payment options */}
            <div className="space-y-2">
              <Label>Choose how to register</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="space-y-2"
              >
                {/* Free for active members */}
                {isFreeForUser && (
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'member_free' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="member_free" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Register Free (Member Benefit)</p>
                      <p className="text-xs text-muted-foreground">Included with your subscription</p>
                    </div>
                  </label>
                )}

                {/* Use all points */}
                {(event.pointsCost ?? 0) > 0 && (
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'points' ? 'border-primary bg-primary/5' : 'border-border'} ${!hasEnoughPoints ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <RadioGroupItem value="points" disabled={!hasEnoughPoints} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        Use {(event.pointsCost ?? 0).toLocaleString()} pts — Attend Free
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hasEnoughPoints
                          ? `You'll have ${(userPointsBalance - (event.pointsCost ?? 0)).toLocaleString()} pts remaining`
                          : `You need ${((event.pointsCost ?? 0) - userPointsBalance).toLocaleString()} more pts`}
                      </p>
                    </div>
                  </label>
                )}

                {/* Pay via Stripe */}
                {displayPrice > 0 && (
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="stripe" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5 text-primary" />
                        Pay ${(displayPrice / 100).toFixed(2)}
                        {subscribed && <Badge variant="outline" className="ml-1 text-xs py-0">Member price</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">Secure checkout via Stripe</p>
                    </div>
                  </label>
                )}
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handlePaidSubmit}
                disabled={isSubmitting || (!user)}
              >
                {isSubmitting ? 'Registering...' : 'Confirm Registration'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You'll earn +50 pts just for registering, and +200 pts for attending live.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Free-event / legacy full form ──────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-primary`} />
            Register for {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-3">{event.description}</p>
            )}
            {event.instructor && (
              <p className="text-sm mt-2">
                <span className="font-medium">Instructor:</span> {event.instructor}
              </p>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleFreeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            {event.type === 'qa' && (
              <div className="space-y-2">
                <Label htmlFor="questions">Questions for the Expert (optional)</Label>
                <Textarea
                  id="questions"
                  placeholder="What would you like to ask during the Q&A session?"
                  value={formData.questions}
                  onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
                />
              </div>
            )}

            {(event.type === 'meditation' || event.type === 'fitness') && (
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <RadioGroup
                  value={formData.experience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notification Preferences</Label>
              <RadioGroup
                value={formData.notifications}
                onValueChange={(value) => setFormData(prev => ({ ...prev, notifications: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-notif" />
                  <Label htmlFor="email-notif">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms-notif" />
                  <Label htmlFor="sms-notif">SMS notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both-notif" />
                  <Label htmlFor="both-notif">Both email and SMS</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register Now'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
