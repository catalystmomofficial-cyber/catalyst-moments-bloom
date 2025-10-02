import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star, Users } from "lucide-react";
import SubscriptionButton from "./SubscriptionButton";

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
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete Your Journey
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Unlock personalized wellness and private community access
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <h3 className="text-lg font-semibold">Monthly Access</h3>
              <div className="text-3xl font-bold text-primary mt-2">$29<span className="text-base font-normal">/month</span></div>
            </div>
            
             <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">Workout that fit your body today</span>
                </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-500 mr-3" />
                 <span className="text-sm">24/7 dedicated wellness coach + voice check-ins</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-500 mr-3" />
                 <span className="text-sm">Kick counter, breathing reset, streaks</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-500 mr-3" />
                 <span className="text-sm">Personalized nutrition plans</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 text-green-500 mr-3" />
                 <span className="text-sm">Private community for your stage</span>
               </div>
             </div>
            
            <SubscriptionButton 
              variant="default" 
              size="lg" 
              className="w-full rounded-full"
            />
          </CardContent>
        </Card>
        
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