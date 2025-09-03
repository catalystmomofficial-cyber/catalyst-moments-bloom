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
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete Your Journey
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Unlock wellness tracking and community access
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
                <div className="text-3xl font-bold text-primary mt-2">$14.99<span className="text-base font-normal">/month</span></div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">Dashboard & wellness tracking</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">General wellness resources</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">Community access</span>
                </div>
              </div>
              
              <SubscriptionButton 
                variant="default" 
                size="lg" 
                className="w-full rounded-full"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/30 bg-green-50/30">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="bg-green-500 text-white px-2 py-1 text-xs rounded-full mb-2 inline-block">
                  BEST VALUE
                </div>
                <h3 className="text-lg font-semibold">Yearly Access</h3>
                <div className="text-3xl font-bold text-primary mt-2">$119.99<span className="text-base font-normal">/year</span></div>
                <div className="text-sm text-green-600 font-medium">Save $60 per year!</div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">Dashboard & wellness tracking</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">General wellness resources</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm">Community access</span>
                </div>
              </div>
              
              <SubscriptionButton 
                variant="default" 
                size="lg" 
                className="w-full rounded-full bg-green-600 hover:bg-green-700"
              />
            </CardContent>
          </Card>
        </div>
        
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