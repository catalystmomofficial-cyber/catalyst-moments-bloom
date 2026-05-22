import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, Zap, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/hooks/usePoints';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { Event } from './EnhancedEventsList';

const PAYPAL_CLIENT_ID =
  (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) ||
  'AVx-CDjcjaMtNsqlKBIm-edzwezhGiMtti86hVwfMbc967nLU2QlJXTAn62Vsk6HCPB6nB8sfOz8khKB';

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<'select' | 'checkout'>('select');
  const [gateway, setGateway] = useState<'stripe' | 'paypal' | null>(null);
  const { toast } = useToast();
  const { user, profile, subscribed } = useAuth();
  const { awardPoints } = usePoints();

  const pointsCost = event?.pointsCost ?? 0;
  const memberPrice = event?.priceMember ?? 0;
  const nonMemberPrice = event?.priceNonMember ?? 0;
  const displayPrice = subscribed ? memberPrice : nonMemberPrice;
  const isFreeForUser = !!(event?.isFreeForMembers && subscribed);
  const hasEnoughPoints = userPointsBalance >= pointsCost;
  const isPaidEvent = nonMemberPrice > 0 || pointsCost > 0;

  // Pre-select the best payment option whenever the event changes
  useEffect(() => {
    if (!event) return;
    if (isFreeForUser) {
      setPaymentMethod('member_free');
    } else if (pointsCost > 0 && hasEnoughPoints) {
      setPaymentMethod('points');
    } else if (displayPrice > 0) {
      setPaymentMethod('stripe');
    } else {
      setPaymentMethod('free');
    }
    setStep('select');
    setGateway(null);
  }, [event?.id]);

  if (!event) return null;

  // Cash amount due after any points credit
  const amountDueCents = paymentMethod === 'stripe' ? displayPrice : 0;

  const finalizeRegistration = async () => {
    if (!user) return;
    // Deduct points upfront if paying with points
    if (paymentMethod === 'points') {
      const { error: pointsErr } = await supabase.rpc('add_user_points', {
        p_user_id: user.id,
        p_points: -pointsCost,
        p_source: 'event_registration',
        p_description: `Registered for ${event.title}`,
      } as any);

      if (pointsErr) {
        toast({ title: 'Points error', description: pointsErr.message, variant: 'destructive' });
        return false;
      }
    }

    const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Member';
    const [firstName, ...rest] = displayName.split(' ');
    const lastName = rest.join(' ') || '-';
    const { data: result, error: regErr } = await (supabase as any).rpc('register_for_event', {
      p_event_id: event.id.toString(),
      p_user_id: user.id.toString(),
      p_payment_method: paymentMethod,
      p_points_used: paymentMethod === 'points' ? pointsCost : 0,
      p_amount_paid: paymentMethod === 'stripe' ? displayPrice : 0,
      p_event_title: event.title,
      p_event_date: event.date ?? null,
      p_event_time: event.time ?? null,
      p_first_name: firstName,
      p_last_name: lastName,
      p_email: user.email ?? null,
    });

    if (regErr || !result?.success) {
      if (paymentMethod === 'points') {
        await supabase.rpc('add_user_points', {
          p_user_id: user.id,
          p_points: pointsCost,
          p_source: 'event_registration_refund',
          p_description: `Refund for failed registration: ${event.title}`,
        } as any);
      }
      toast({
        title: 'Registration failed',
        description: result?.error ?? regErr?.message ?? 'Please try again.',
        variant: 'destructive',
      });
      return false;
    }

    await awardPoints(50, 'event_registration', `Registered for ${event.title}`);

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
      setStep('select');
      onClose();
    }, 3000);
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to register.', variant: 'destructive' });
      return;
    }
    // Cash owed → advance to checkout step (mirrors product workflow)
    if (amountDueCents > 0) {
      setStep('checkout');
      return;
    }
    setIsSubmitting(true);
    await finalizeRegistration();
    setIsSubmitting(false);
  };

  const handleStripeCheckout = async () => {
    setGateway('stripe');
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-event-payment', {
        body: {
          eventId: event.id,
          eventTitle: event.title,
          amountCents: amountDueCents,
          pointsUsed: 0,
        },
      });
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error('Stripe did not return a checkout URL');
      window.open(url, '_blank');
      onClose();
    } catch (e: any) {
      toast({
        title: 'Could not start Stripe checkout',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setGateway(null);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────────
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

  // ── Registration modal ─────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            Register for {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Event summary */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
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
                You have <strong>{userPointsBalance.toLocaleString()} pts</strong>
                {' · '}${(userPointsBalance / 100).toFixed(2)} value
              </span>
            </div>
          )}

          {/* Payment options — only show choice if the event has pricing */}
          {isPaidEvent ? (
            <div className="space-y-2">
              <Label>How would you like to register?</Label>
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
                {pointsCost > 0 && (
                  <label className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${hasEnoughPoints ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${paymentMethod === 'points' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="points" disabled={!hasEnoughPoints} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        {hasEnoughPoints
                          ? `Attend Free — use ${pointsCost.toLocaleString()} pts`
                          : `Use ${userPointsBalance.toLocaleString()} pts + pay $${((displayPrice - userPointsBalance) / 100).toFixed(2)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hasEnoughPoints
                          ? `You'll have ${(userPointsBalance - pointsCost).toLocaleString()} pts remaining`
                          : `You need ${(pointsCost - userPointsBalance).toLocaleString()} more pts for full redemption`}
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
          ) : (
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-3">
              This event is free to attend.
            </p>
          )}

          {/* Member pricing nudge — logged in but not subscribed */}
          {user && !subscribed && isPaidEvent && memberPrice > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary shrink-0" />
              Members pay ${(memberPrice / 100).toFixed(2)} —{' '}
              <a href="/pricing" className="underline text-primary">Join to unlock</a>
            </p>
          )}

          {/* Sign-in prompt — not logged in */}
          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              <a href="/auth" className="underline text-primary">Sign in or create an account</a> to register for this event
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !user}>
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
};

export default EventRegistrationModal;
