import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmbeddedCheckout from "./EmbeddedCheckout";
import PricingToggle from "./PricingToggle";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handleSuccess = () => {
    onClose();
    navigate('/dashboard?success=true');
  };

  const handleContinueBrowsing = () => {
    onClose();
    navigate('/');
  };

  const handleSelectPlan = (priceId: string) => {
    setSelectedPriceId(priceId);
  };

  const handleBack = () => {
    setSelectedPriceId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-secondary/20">
        <DialogHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Complete Your Subscription
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Join 1,000+ moms transforming their wellness journey
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedPriceId ? (
            <>
              <PricingToggle 
                onSelectPlan={handleSelectPlan}
                yearlyPriceId="price_1S54B1CNwyQa1NiQGKx1Ps0r"
              />
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
              <EmbeddedCheckout priceId={selectedPriceId} onSuccess={handleSuccess} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;