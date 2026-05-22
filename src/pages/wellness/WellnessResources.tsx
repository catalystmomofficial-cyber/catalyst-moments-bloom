import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Download,
  Sparkles,
  CheckCircle2,
  Flame,
  Lock,
  Zap,
  CreditCard,
  Loader2,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import busyMomSelfCareCover from '@/assets/busy-mom-self-care-cover.png';
import momodoroCover from '@/assets/momodoro-planner-cover.png';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const MOMODORO_PDF =
  'https://catalystmomofficial.com/Momon%20guide/The%20Momodoro%20Planner.pdf';
const SELFCARE_PDF =
  'https://catalystmomofficial.com/The%20Busy%20Mom%E2%80%99s%20Self-Care%20%26%20Stress%20Relief%20System.pdf';

type Product = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  pdf: string;
  cta: string;
  priceCents: number;
  pointsCost: number;
  demand: string;
};

const PRODUCTS: Product[] = [
  {
    slug: 'momodoro-planner',
    title: 'The Momodoro Planner',
    tagline: '15-Minute Focus Sessions for Busy Moms',
    description:
      'A beautifully structured premium time-management tool that helps busy moms organize their days and reclaim their time — one focused 15-minute session at a time.',
    cover: momodoroCover,
    pdf: MOMODORO_PDF,
    cta: 'Download Planner',
    priceCents: 1200,
    pointsCost: 1200,
    demand: 'HIGH',
  },
  {
    slug: 'busy-mom-self-care',
    title: "The Busy Mom's Self-Care & Stress Relief System",
    tagline: 'Simple Daily Habits to Feel Energized, Relaxed & In Control',
    description:
      'A practical, stress-relief system designed specifically to help busy mothers find calm, recharge, and feel in control — every single day.',
    cover: busyMomSelfCareCover,
    pdf: SELFCARE_PDF,
    cta: 'Download System',
    priceCents: 1700,
    pointsCost: 1700,
    demand: 'HIGH',
  },
];

type PaymentMethod = 'points' | 'stripe';

const PurchaseModal = ({
  product,
  open,
  onClose,
  pointsBalance,
  onPurchased,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  pointsBalance: number;
  onPurchased: () => void;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [method, setMethod] = useState<PaymentMethod>('points');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'select' | 'checkout'>('select');
  const [gateway, setGateway] = useState<'stripe' | 'paypal' | null>(null);

  const hasEnoughPoints = product ? pointsBalance >= product.pointsCost : false;
  const shortfallCents = product
    ? Math.max(0, product.priceCents - pointsBalance)
    : 0;

  useEffect(() => {
    if (!product) return;
    setMethod(hasEnoughPoints ? 'points' : 'stripe');
    setStep('select');
    setGateway(null);
  }, [product?.slug, hasEnoughPoints]);

  if (!product) return null;

  const pointsUsed =
    method === 'points'
      ? product.pointsCost
      : Math.min(pointsBalance, product.priceCents);
  const amountPaidCents =
    method === 'points' ? 0 : product.priceCents - pointsUsed;

  const finalizePurchase = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to unlock this guide.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);

    const { data, error } = await supabase.rpc(
      'purchase_digital_product' as any,
      {
        p_product_slug: product.slug,
        p_payment_method: method,
        p_points_used: pointsUsed,
        p_amount_paid_cents: amountPaidCents,
      } as any,
    );

    setSubmitting(false);

    const result = data as { success?: boolean; error?: string } | null;
    if (error || !result?.success) {
      toast({
        title: 'Unlock failed',
        description: result?.error ?? error?.message ?? 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    window.dispatchEvent(new Event('points-updated'));
    toast({
      title: 'Unlocked!',
      description: `${product.title} is now in your library.`,
    });
    onPurchased();
    onClose();
  };

  const handleConfirm = async () => {
    if (amountPaidCents > 0) {
      setStep('checkout');
      return;
    }
    await finalizePurchase();
  };

  const handleStripePayment = async () => {
    setGateway('stripe');
    setSubmitting(true);
    // Placeholder: simulate a secure Stripe checkout round-trip.
    // TODO: replace with real Stripe Checkout session once Stripe is enabled.
    await new Promise((r) => setTimeout(r, 1200));
    toast({
      title: 'Payment successful',
      description: `Charged $${(amountPaidCents / 100).toFixed(2)} via Stripe.`,
    });
    await finalizePurchase();
    setGateway(null);
  };

  const handlePayPalPayment = async () => {
    setGateway('paypal');
    setSubmitting(true);
    // Placeholder: simulate PayPal smart button approval.
    // TODO: replace with real PayPal SDK + server-side capture.
    await new Promise((r) => setTimeout(r, 1200));
    toast({
      title: 'Payment successful',
      description: `Charged $${(amountPaidCents / 100).toFixed(2)} via PayPal.`,
    });
    await finalizePurchase();
    setGateway(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock {product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm bg-accent/20 rounded-lg px-4 py-2">
            <Zap className="h-4 w-4 text-primary shrink-0" />
            <span>
              You have{' '}
              <strong>{pointsBalance.toLocaleString()} pts</strong> · $
              {(pointsBalance / 100).toFixed(2)} value
            </span>
          </div>

          <div className="space-y-2">
            <Label>How would you like to unlock it?</Label>
            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as PaymentMethod)}
              className="space-y-2"
            >
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  hasEnoughPoints
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                } ${
                  method === 'points'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <RadioGroupItem
                  value="points"
                  disabled={!hasEnoughPoints}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    {hasEnoughPoints
                      ? `Unlock Free — use ${product.pointsCost.toLocaleString()} pts`
                      : `Need ${(product.pointsCost - pointsBalance).toLocaleString()} more pts`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasEnoughPoints
                      ? `You'll have ${(pointsBalance - product.pointsCost).toLocaleString()} pts remaining`
                      : `Earn more points to redeem for free`}
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  method === 'stripe'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <RadioGroupItem value="stripe" className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                    {pointsBalance > 0 && pointsBalance < product.priceCents
                      ? `Use ${pointsBalance.toLocaleString()} pts + pay $${(shortfallCents / 100).toFixed(2)}`
                      : `Pay $${(product.priceCents / 100).toFixed(2)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Secure checkout · instant access
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              <a href="/auth" className="underline text-primary">
                Sign in
              </a>{' '}
              to unlock this guide
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={submitting || !user}>
              {submitting ? 'Unlocking...' : 'Confirm Unlock'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const WellnessResources = () => {
  const { user } = useAuth();
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setOwned(new Set());
      setPoints(0);
      return;
    }
    const [purchaseRes, pointsRes] = await Promise.all([
      supabase
        .from('digital_product_purchases' as any)
        .select('product_slug')
        .eq('user_id', user.id),
      supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);
    const slugs = ((purchaseRes.data as any[]) ?? []).map(
      (r: any) => r.product_slug as string,
    );
    setOwned(new Set(slugs));
    setPoints(pointsRes.data?.total_points ?? 0);
  }, [user]);

  useEffect(() => {
    refresh();
    const onPts = () => refresh();
    window.addEventListener('points-updated', onPts);
    return () => window.removeEventListener('points-updated', onPts);
  }, [refresh]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Wellness Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium digital guides crafted to support every stage of your
              motherhood journey.
            </p>
          </div>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                Journey-Specific Resources
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PRODUCTS.map((p) => {
                const isOwned = owned.has(p.slug);
                const hasEnoughPoints = points >= p.pointsCost;
                const shortfall = Math.max(0, p.priceCents - points);

                let buttonLabel: React.ReactNode;
                if (isOwned) {
                  buttonLabel = (
                    <>
                      <Download className="w-4 h-4 mr-2" /> {p.cta}
                    </>
                  );
                } else if (hasEnoughPoints) {
                  buttonLabel = (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Unlock with {p.pointsCost.toLocaleString()} pts
                    </>
                  );
                } else if (points > 0) {
                  buttonLabel = (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Use {points.toLocaleString()} pts + pay $
                      {(shortfall / 100).toFixed(2)}
                    </>
                  );
                } else {
                  buttonLabel = (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock for ${(p.priceCents / 100).toFixed(2)}
                    </>
                  );
                }

                return (
                  <Card
                    key={p.slug}
                    className="group relative overflow-hidden border-border/60 bg-card shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[3/4]"
                  >
                    {/* Full-card background */}
                    <img
                      src={p.cover}
                      alt={`${p.title} cover`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    {/* Top-right demand / owned chip */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                      {isOwned ? (
                        <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <Badge className="bg-orange-500/95 text-white border-0 backdrop-blur gap-1">
                          <Flame className="w-3 h-3" /> Demand: {p.demand}
                        </Badge>
                      )}
                    </div>

                    {/* Bottom content */}
                    <CardContent className="absolute inset-x-0 bottom-0 p-6 space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-white">
                          ${(p.priceCents / 100).toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-white/80">
                          or {p.pointsCost.toLocaleString()} pts
                        </span>
                      </div>

                      <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>

                      {isOwned ? (
                        <Button
                          asChild
                          size="lg"
                          className="w-full bg-white text-black hover:bg-white/90"
                        >
                          <a
                            href={p.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            {buttonLabel}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full bg-white text-black hover:bg-white/90"
                          onClick={() => setModalProduct(p)}
                        >
                          {buttonLabel}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <Card className="bg-muted/30 border-border/60">
              <CardContent className="p-8 text-center space-y-3">
                <h3 className="text-xl font-semibold">Need More Resources?</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Can't find what you're looking for? Our wellness coach can
                  recommend personalized resources.
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <a href="/wellness-coach">Chat with Wellness Coach</a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <PurchaseModal
        product={modalProduct}
        open={!!modalProduct}
        onClose={() => setModalProduct(null)}
        pointsBalance={points}
        onPurchased={refresh}
      />
    </PageLayout>
  );
};

export default WellnessResources;
