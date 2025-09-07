import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Heart, FileText } from 'lucide-react';

interface AffiliateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const AffiliateInfoModal = ({ isOpen, onClose, onApply }: AffiliateInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join Catalyst Moms—Empower Moms, <span className="text-2xl font-bold" style={{fontSize: '24px'}}>Earn $35 Per Sale!</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <p className="text-center text-muted-foreground">
            Why Join? Help moms glow up, share real stories, and earn a flat $35 every time someone signs up or buys—subscription, course, or meal plan. Get templates, reels, and links to make it easy.
          </p>
          
          <div className="flex justify-center pt-4">
            <Button onClick={onApply} className="w-full max-w-md">
              Apply to Become an Affiliate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateInfoModal;