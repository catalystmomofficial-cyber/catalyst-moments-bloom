import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Clock3,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import SEO from '@/components/seo/SEO';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import {
  DIGITAL_PRODUCTS,
  PRODUCT_CATEGORIES,
  isAvailable,
  type DigitalProduct,
} from '@/data/digitalProducts';
import { CoverImage } from '@/components/wellness/ProductCoverArt';

const PAYPAL_CLIENT_ID =
  (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) ||
  'AVx-CDjcjaMtNsqlKBIm-edzwezhGiMtti86hVwfMbc967nLU2QlJXTAn62Vsk6HCPB6nB8sfOz8khKB';

const CATEGORIES = [...PRODUCT_CATEGORIES];
const PRODUCTS = DIGITAL_PRODUCTS;
type Product = DigitalProduct;

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
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-product-payment',
        {
          body: {
            productSlug: product.slug,
            productTitle: product.title,
            amountCents: amountPaidCents,
            pointsUsed,
          },
        },
      );
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error('Stripe did not return a checkout URL');
      // Redirect to Stripe Checkout in a new tab; verification happens on return.
      window.open(url, '_blank');
      onClose();
    } catch (e: any) {
      toast({
        title: 'Could not start Stripe checkout',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setGateway(null);
    }
  };

  // PayPal Smart Buttons use onApprove callback below — no manual handler needed.

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'checkout' ? 'Complete payment' : `Unlock ${product.title}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
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
                <Link to="/auth" className="underline text-primary">
                  Sign in
                </Link>{' '}
                to unlock this guide
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={submitting || !user}>
                {submitting
                  ? 'Unlocking...'
                  : amountPaidCents > 0
                  ? 'Continue to payment'
                  : 'Confirm Unlock'}
              </Button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="space-y-5">
            {/* Order summary */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{product.title}</span>
                <span className="font-medium">
                  ${(product.priceCents / 100).toFixed(2)}
                </span>
              </div>
              {pointsUsed > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    Points credit ({pointsUsed.toLocaleString()} pts)
                  </span>
                  <span>− ${(pointsUsed / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Due today</span>
                <span>${(amountPaidCents / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Gateway buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Choose a payment method</p>

              <Button
                onClick={handleStripePayment}
                disabled={submitting}
                size="lg"
                className="w-full bg-[#635BFF] hover:bg-[#5147e6] text-white shadow-sm"
              >
                {gateway === 'stripe' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Pay with Credit Card
              </Button>

              <div className="relative">
                {gateway === 'paypal' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                <PayPalScriptProvider
                  options={{
                    clientId: PAYPAL_CLIENT_ID,
                    currency: 'USD',
                    intent: 'capture',
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: 'horizontal',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                      tagline: false,
                      height: 45,
                    }}
                    disabled={submitting || amountPaidCents <= 0}
                    forceReRender={[amountPaidCents, product.slug]}
                    createOrder={(_data, actions) =>
                      actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                          {
                            description: product.title,
                            amount: {
                              currency_code: 'USD',
                              value: (amountPaidCents / 100).toFixed(2),
                            },
                          },
                        ],
                      })
                    }
                    onApprove={async (_data, actions) => {
                      setGateway('paypal');
                      try {
                        // Capture the payment in the browser.
                        const details = await actions.order?.capture();
                        const status = details?.status;
                        if (status !== 'COMPLETED') {
                          throw new Error(
                            `PayPal payment not completed (status: ${status ?? 'unknown'})`,
                          );
                        }
                        toast({
                          title: 'Payment successful',
                          description: `Charged $${(amountPaidCents / 100).toFixed(2)} via PayPal.`,
                        });
                        // Call the existing RPC directly — deducts points,
                        // logs the purchase, unlocks the download.
                        await finalizePurchase();
                      } catch (e: any) {
                        toast({
                          title: 'PayPal payment failed',
                          description: e?.message ?? 'Please try again.',
                          variant: 'destructive',
                        });
                      } finally {
                        setGateway(null);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error', err);
                      toast({
                        title: 'PayPal error',
                        description: 'Something went wrong with PayPal. Please try again.',
                        variant: 'destructive',
                      });
                      setGateway(null);
                    }}
                    onCancel={() => setGateway(null)}
                  />
                </PayPalScriptProvider>
              </div>

              <p className="text-[11px] text-center text-muted-foreground pt-1">
                Encrypted & secure · You will not be charged until confirmation
              </p>
            </div>

            <div className="flex justify-between gap-3 pt-1">
              <Button
                variant="ghost"
                onClick={() => setStep('select')}
                disabled={submitting}
              >
                ← Back
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const WellnessResources = () => {
  const { user } = useAuth();
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [highlighted, setHighlighted] = useState<string | null>(null);

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
    setPoints(Math.max(0, pointsRes.data?.total_points ?? 0));
  }, [user]);

  useEffect(() => {
    refresh();
    const onPts = () => refresh();
    window.addEventListener('points-updated', onPts);
    return () => window.removeEventListener('points-updated', onPts);
  }, [refresh]);

  // Verify Stripe checkout on return: ?payment=success&session_id=...&slug=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');
    if (payment !== 'success' || !sessionId || !user) return;

    (async () => {
      const { data, error } = await supabase.functions.invoke(
        'verify-product-payment',
        { body: { sessionId } },
      );
      // Clean URL regardless of outcome
      window.history.replaceState({}, '', '/wellness/resources');
      if (error || !(data as any)?.paid) return;
      window.dispatchEvent(new Event('points-updated'));
      refresh();
    })();
  }, [user, refresh]);

  // Deep links from the wellness funnel: /wellness/resources?product=slug
  // (and optional ?category=). We open the tab that holds the guide, scroll to
  // it, and give it a brief ring so a mother lands exactly on what she tapped.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const slug = params.get('product');
    if (category && (CATEGORIES as readonly string[]).includes(category)) setActiveCategory(category as typeof CATEGORIES[number]);
    if (!slug) return;
    setActiveCategory('All Resources');
    setHighlighted(slug);
    const raf = requestAnimationFrame(() => {
      document
        .getElementById(`product-${slug}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    const timer = window.setTimeout(() => setHighlighted(null), 2800);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  // One clean library — no oversized hero banner. Available guides sort first
  // so what a mother can actually get today leads the grid.
  const filteredProducts = useMemo(
    () =>
      (activeCategory === 'All Resources'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory)
      )
        .slice()
        .sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a))),
    [activeCategory],
  );

  const renderUnlockButton = (p: Product) => {
    const isOwned = owned.has(p.slug);
    const hasEnoughPoints = points >= p.pointsCost;
    const shortfall = Math.max(0, p.priceCents - points);

    if (isOwned) {
      return (
        <>
          <Download className="w-4 h-4 mr-2" /> {p.cta}
        </>
      );
    }
    if (hasEnoughPoints) {
      return (
        <>
          <Zap className="w-4 h-4 mr-2" />
          Unlock with {p.pointsCost.toLocaleString()} pts
        </>
      );
    }
    if (points > 0) {
      return (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Use {points.toLocaleString()} pts + pay $
          {(shortfall / 100).toFixed(2)}
        </>
      );
    }
    return (
      <>
        <Lock className="w-4 h-4 mr-2" />
        Unlock for ${(p.priceCents / 100).toFixed(2)}
      </>
    );
  };

  return (
    <PageLayout>
      <SEO
        title="Wellness Resources for Moms | Catalyst Mom"
        description="Guides, planners, and tools for maternal wellness — self-care, stress relief, sleep, nutrition, and mindfulness resources for pregnancy and postpartum."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <section className="relative py-6 md:py-10 mb-8 text-center md:text-left md:flex md:items-center md:justify-between gap-8 overflow-hidden">
            <div className="md:max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-catalyst-copper mb-3 leading-tight">
                Premium Wellness Resources
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Digital guides crafted for every stage of your motherhood
                journey. Nurture your mind, body, and soul with curated
                professional wisdom.
              </p>
              <Badge variant="outline" className="gap-1.5 border-catalyst-copper/30 text-catalyst-copper px-3 py-1.5 text-sm">
                <Sparkles className="w-4 h-4" />
                {points.toLocaleString()} points available
              </Badge>
            </div>
          </section>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? 'default' : 'outline'}
                className={`rounded-full shrink-0 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-catalyst-copper hover:bg-catalyst-copper/90 text-white shadow-sm'
                    : 'border-catalyst-copper/20 text-catalyst-copper bg-catalyst-cream hover:bg-catalyst-copper/10'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Product grid */}
          <section className="mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const isOwned = owned.has(p.slug);
                const available = isAvailable(p);

                return (
                  <Card
                    key={p.slug}
                    id={`product-${p.slug}`}
                    className={`group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                      highlighted === p.slug
                        ? 'ring-2 ring-catalyst-copper ring-offset-2 ring-offset-background'
                        : ''
                    }`}
                  >
                    {/* Cover — a calm, contained thumbnail, not a full-bleed banner */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                        <CoverImage
                          src={p.cover}
                          alt={`${p.title} cover`}
                          slug={p.slug}
                          title={p.title}
                        />
                      </div>
                      <div className="absolute top-3 right-3">
                        {isOwned ? (
                          <div className="rounded-full bg-emerald-500 p-1 text-white shadow">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        ) : available ? (
                          <Badge className="border-0 bg-black/40 px-2 py-0.5 text-[10px] gap-0.5 text-white backdrop-blur-sm">
                            <Flame className="h-2.5 w-2.5" /> {p.demand}
                          </Badge>
                        ) : (
                          <Badge className="border-0 bg-catalyst-copper/90 px-2 py-0.5 text-[10px] gap-1 uppercase tracking-wide text-white backdrop-blur-sm">
                            <Clock3 className="h-2.5 w-2.5" /> Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content on the card surface — the clean library layout */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-catalyst-copper">
                        {p.category}
                      </p>
                      <h4 className="mb-1 font-semibold leading-snug text-foreground">
                        {p.title}
                      </h4>
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {p.tagline}
                      </p>

                      <div className="mt-auto space-y-2.5">
                        {available ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-foreground">
                              ${(p.priceCents / 100).toFixed(2)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              or {p.pointsCost.toLocaleString()} pts
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            In the studio now · members get first access
                          </p>
                        )}

                        {isOwned ? (
                          <Button
                            asChild
                            size="sm"
                            className="h-9 w-full bg-catalyst-copper text-xs font-semibold text-white hover:bg-catalyst-copper/90"
                          >
                            <a href={p.pdf} target="_blank" rel="noopener noreferrer" download>
                              <Download className="mr-1.5 h-3.5 w-3.5" />
                              {p.cta}
                            </a>
                          </Button>
                        ) : available ? (
                          <Button
                            size="sm"
                            className="h-9 w-full bg-catalyst-copper text-xs font-semibold text-white hover:bg-catalyst-copper/90"
                            onClick={() => setModalProduct(p)}
                          >
                            {renderUnlockButton(p)}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="h-9 w-full cursor-not-allowed border-catalyst-copper/30 text-xs font-semibold text-muted-foreground"
                          >
                            <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
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
                <WellnessCoachButton variant="outline" className="mt-2" />
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
