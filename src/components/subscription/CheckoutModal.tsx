import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";
import EmbeddedCheckout from "./EmbeddedCheckout";
import PricingToggle from "./PricingToggle";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset selection when modal closes to avoid stale checkout instances
  useEffect(() => {
    if (!isOpen) {
      setSelectedPriceId(null);
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
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPriceId(priceId);
      setIsTransitioning(false);
    }, 300);
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
                Complete Your Subscription
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                After supporting over 2,000 mamas with our digital guides, we built the Catalyst Mom App to take your recovery even deeper.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {isTransitioning ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading checkout...</p>
            </div>
          ) : !selectedPriceId ? (
            <>
              <PricingToggle 
                onSelectPlan={handleSelectPlan}
                yearlyPriceId="price_1S54B1CNwyQa1NiQGKx1Ps0r"
              />
              
              {/* Money-Back Guarantee Badge */}
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  <span className="text-primary font-semibold">30-Day Money-Back Guarantee</span> - Try risk-free, cancel anytime
                </p>
              </div>

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