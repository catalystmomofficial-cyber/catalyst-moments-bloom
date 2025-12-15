import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, X, Sparkles, Zap, Crown } from 'lucide-react';
import { useCredits, CREDIT_PACKS } from '@/hooks/useCredits';

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  requiredCredits: number;
}

const CreditPurchaseModal = ({ isOpen, onClose, currentCredits, requiredCredits }: CreditPurchaseModalProps) => {
  const { purchaseCredits } = useCredits();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handlePurchase = async (packId: keyof typeof CREDIT_PACKS) => {
    setLoading(packId);
    const result = await purchaseCredits(packId);
    if (!result.success) {
      console.error('Purchase failed:', result.error);
    }
    setLoading(null);
  };

  const packIcons = {
    small: Coins,
    medium: Sparkles,
    large: Crown,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">Get More Credits</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You need {requiredCredits} credits. You have {currentCredits}.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6">
            <p className="text-sm text-destructive">
              Insufficient credits! Purchase a credit pack to continue.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(CREDIT_PACKS).map(([id, pack]) => {
              const Icon = packIcons[id as keyof typeof packIcons];
              const pricePerCredit = (pack.price / pack.credits).toFixed(3);
              
              return (
                <div
                  key={id}
                  className={`relative border rounded-lg p-4 transition-all hover:border-primary ${
                    pack.popular ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  {pack.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        id === 'small' ? 'bg-blue-100 text-blue-600' :
                        id === 'medium' ? 'bg-purple-100 text-purple-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{pack.label}</p>
                        <p className="text-xs text-muted-foreground">
                          ${pricePerCredit} per credit
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(id as keyof typeof CREDIT_PACKS)}
                      disabled={loading !== null}
                      size="sm"
                      variant={pack.popular ? 'default' : 'outline'}
                    >
                      {loading === id ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        `$${pack.price.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Zap className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Credits are used for Wellness Coach calls (5 credits) and chats (2 credits). 
                Subscribers get bonus credits monthly!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditPurchaseModal;
