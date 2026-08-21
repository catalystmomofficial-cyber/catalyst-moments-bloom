import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Check, Sparkles } from "lucide-react";
import EmbeddedCheckout from "./EmbeddedCheckout";
import PricingToggle from "./PricingToggle";
import posthog from '@/lib/posthog';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // True when user arrived from the assessment funnel — shows warm guidance banner
  const [fromAssessment, setFromAssessment] = useState(false);

  // Reset selection when modal closes to avoid stale checkout instances
  useEffect(() => {
    if (!isOpen) {
      setSelectedPriceId(null);
    } else {
      // Detect assessment funnel arrival and clear the flag so it
      // only shows once (on this first session, not on every re-open).
      const flag = sessionStorage.getItem('cm_from_assessment');
      if (flag) {
        setFromAssessment(true);
        sessionStorage.removeItem('cm_from_assessment');
      }
      // Pre-warm the edge function and Stripe session the moment the modal opens
      // (while user is still reading the plan picker) so the secret is ready to go.
      import('@/integrations/supabase/client').then(({ supabase }) => {
        supabase.functions.invoke('create-checkout', {
          body: { priceId: 'price_1S546jCNwyQa1NiQYpl3OjEe' } // monthly default
        }).catch(() => {});
      });
    }
  }, [isOpen]);
  const handleSuccess = () => {
    onClose();
    navigate('/dashboard?success=true');
  };

  const handleContinueBrowsing = () => {
    onClose();
    navigate('/');
  };

  const handleSelectPlan = (priceId: string) => {
    posthog.capture('subscription_plan_selected');
    // No artificial delay — switch to checkout immediately
    setSelectedPriceId(priceId);
  };

  const handleBack = () => {
    setSelectedPriceId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPriceId(null);
      onClose();
    }
  };

  const currentStep: 1 | 2 | 3 = isTransitioning ? 2 : selectedPriceId ? 2 : 1;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-secondary/20">
        <DialogHeader className="space-y-4 pb-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  step < currentStep 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : step === currentStep 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-1 transition-all ${
                    step < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mb-2">
            {currentStep === 1 ? 'Step 1: Select Your Plan' : currentStep === 2 ? 'Step 2: Payment Details' : 'Step 3: Confirmation'}
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Unlock Your Full Experience
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Join 2,000+ mamas already building stronger, healthier bodies — at every stage of motherhood.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Assessment funnel context banner — shows only for users who just
              completed the assessment. Replaces "surprise paywall" with
              "guided next step" framing. */}
          {fromAssessment && !selectedPriceId && (
            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/8 px-4 py-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  ✅ Your personalized plan has been created and saved.
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                  Here's how to unlock your full experience.
                </p>
              </div>
            </div>
          )}
          {isTransitioning ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading checkout...</p>
            </div>
          ) : !selectedPriceId ? (
            <>
              {/* Clean header — no Founder language, no scarcity */}
              <div className="text-center space-y-1 pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Choose your plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full access to everything — including 1:1 coaching — from day one.
                </p>
              </div>

              {/* Quietly exclusive — one line, no pressure, no seat count.
                  Prevents the "wait, there was a Founder thing?" trust gap
                  without reintroducing scarcity pressure. */}
              <p className="text-xs text-center text-muted-foreground/70 italic">
                Early members may be invited to our Founding Member program — additional benefits and support, by invitation.
              </p>

              <PricingToggle
                onSelectPlan={handleSelectPlan}
                yearlyPriceId="price_1S54B1CNwyQa1NiQGKx1Ps0r"
              />

              
              {/* Money-Back Guarantee Badge */}
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  <span className="text-primary font-semibold">30-Day Fair-Try Guarantee.</span> Use Catalyst Mom for 30 days. If you give it a real shot and it is honestly not right for you, we will refund your payment.
                </p>
              </div>

              {/* Refund & cancellation policy link — published terms, visible before payment */}
              <p className="text-center text-xs text-muted-foreground">
                By subscribing you agree to our{" "}
                <a
                  href="/terms#refunds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  refund &amp; cancellation policy
                </a>
                . Cancel anytime; billing stops at the end of your current period.
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleContinueBrowsing}
                className="w-full"
              >
                Continue browsing
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-4"
              >
                ← Back to plans
              </Button>
              <EmbeddedCheckout key={selectedPriceId!} priceId={selectedPriceId} onSuccess={handleSuccess} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;