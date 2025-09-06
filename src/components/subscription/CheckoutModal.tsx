import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { PricingCard } from "@/components/ui/pricing-card";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const navigate = useNavigate();

  const handleContinueBrowsing = () => {
    onClose();
    navigate('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Complete Your Journey</DialogTitle>
          <DialogDescription>Unlock wellness tracking and community access</DialogDescription>
        </DialogHeader>
        
        <PricingCard />
        
        <div className="flex items-center justify-center mt-4 mb-4">
          <Users className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-sm text-muted-foreground">Join 1,000+ moms on their wellness journey</span>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={handleContinueBrowsing}
          className="w-full"
        >
          Continue browsing
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;