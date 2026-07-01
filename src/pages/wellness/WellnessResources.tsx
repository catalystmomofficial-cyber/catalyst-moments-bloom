import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Moon,
  HeartHandshake,
  Clock,
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
import momodoroCover from '@/assets/momodoro-planner-cover.png';
import selfCareCover from '@/assets/busy-mom-self-care-cover.png';
import sleepResetCover from '@/assets/sleep-reset-guide-cover.jpg';
import emotionalLoadCover from '@/assets/emotional-load-workbook-cover.jpg';

const PAYPAL_CLIENT_ID =
  (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) ||
  'AVx-CDjcjaMtNsqlKBIm-edzwezhGiMtti86hVwfMbc967nLU2QlJXTAn62Vsk6HCPB6nB8sfOz8khKB';

const MOMODORO_PDF =
  'https://catalystmomofficial.com/Momon%20guide/The%20Momodoro%20Planner.pdf';
const SELFCARE_PDF =
  'https://catalystmomofficial.com/catalyst%20guide/The%20Busy%20Mom%E2%80%99s%20Self-Care%20%26%20Stress%20Relief%20System.pdf';

// Cover artwork from the uploaded design, bundled locally so it never
// expires or depends on external hosting. If a cover is ever missing,
// the branded ProductCoverArt fallback renders instead (see CoverImage).
const MOMODORO_COVER = momodoroCover;
const SELFCARE_COVER = selfCareCover;
const SLEEP_COVER = sleepResetCover;
const EMOTIONAL_COVER = emotionalLoadCover;

type Product = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover?: string;
  fallbackIcon?: React.ReactNode;
  pdf: string;
  cta: string;
  priceCents: number;
  pointsCost: number;
  demand: string;
  category: string;
};

const CATEGORIES = ['All Resources', 'Self-Care', 'Sleep', 'Mindfulness'];

const PRODUCTS: Product[] = [
  {
    slug: 'momodoro-planner',
    title: 'The Momodoro Planner',
    tagline: '15-Minute Focus Sessions for Busy Moms',
    description:
      'A beautifully structured premium time-management tool that helps busy moms organize their days and reclaim their time — one focused 15-minute session at a time.',
    cover: MOMODORO_COVER,
    pdf: MOMODORO_PDF,
    cta: 'Download Planner',
    priceCents: 1200,
    pointsCost: 1200,
    demand: 'HIGH',
    category: 'Self-Care',
  },
  {
    slug: 'busy-mom-self-care',
    title: "The Busy Mom's Self-Care & Stress Relief System",
    tagline: 'Simple Daily Habits to Feel Energized, Relaxed & In Control',
    description:
      'A practical, stress-relief system designed specifically to help busy mothers find calm, recharge, and feel in control — every single day.',
    cover: SELFCARE_COVER,
    pdf: SELFCARE_PDF,
    cta: 'Download System',
    priceCents: 1700,
    pointsCost: 1700,
    demand: 'HIGH',
    category: 'Self-Care',
  },
  {
    slug: 'sleep-reset-guide',
    title: 'Sleep Reset Guide',
    tagline: 'Maximize Rest as a New or Expecting Mom',
    description:
      'A practical guide to resetting your sleep patterns and maximizing rest, even with a newborn or during pregnancy.',
    cover: SLEEP_COVER,
    fallbackIcon: <Moon className="w-10 h-10" />,
    pdf: '#',
    cta: 'Download Guide',
    priceCents: 1500,
    pointsCost: 1500,
    demand: 'MEDIUM',
    category: 'Sleep',
  },
  {
    slug: 'emotional-load-workbook',
    title: 'Emotional Load Workbook',
    tagline: 'Process and Release the Invisible Mental Load',
    description:
      'A guided workbook to help you identify, process, and lighten the invisible emotional and mental load of motherhood.',
    cover: EMOTIONAL_COVER,
    fallbackIcon: <HeartHandshake className="w-10 h-10" />,
    pdf: '#',
    cta: 'Download Workbook',
    priceCents: 1000,
    pointsCost: 1000,
    demand: 'MEDIUM',
    category: 'Mindfulness',
  },
];

const ProductCoverArt = ({
  slug,
  fallbackIcon,
}: {
  slug: string;
  fallbackIcon?: React.ReactNode;
}) => {
  switch (slug) {
    case 'momodoro-planner':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-catalyst-tan via-catalyst-gold to-catalyst-brown overflow-hidden">
          <div className="absolute inset-3 border border-white/30 rounded-sm" />
          <Clock className="w-9 h-9 text-white/90 mb-3" strokeWidth={1.5} />
          <p className="font-serif text-lg tracking-[0.12em] text-white leading-snug">
            THE MOMODORO
            <br />
            PLANNER
          </p>
          <p className="mt-2 text-[10px] tracking-[0.18em] text-white/80 uppercase">
            15-Minute Focus Sessions
          </p>
        </div>
      );
    case 'busy-mom-self-care':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-catalyst-sage via-catalyst-peach to-catalyst-beige overflow-hidden">
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-catalyst-copper/20 blur-2xl" />
          <HeartHandshake className="relative w-9 h-9 text-catalyst-brown mb-3" strokeWidth={1.5} />
          <p className="relative font-semibold text-base text-catalyst-brown leading-snug">
            The Busy Mom's
            <br />
            Self-Care System
          </p>
          <p className="relative mt-1.5 text-[10px] tracking-wide text-catalyst-brown/70 uppercase">
            A Practical Guide to Thriving
          </p>
        </div>
      );
    case 'sleep-reset-guide':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-slate-900 via-slate-800 to-catalyst-brown overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/70"
              style={{ top: `${(i * 37) % 90}%`, left: `${(i * 53) % 95}%` }}
            />
          ))}
          <Moon className="relative w-10 h-10 text-catalyst-gold mb-3" strokeWidth={1.5} />
          <p className="relative font-semibold text-base text-white leading-snug">
            Sleep Reset Guide
          </p>
          <p className="relative mt-1.5 text-[10px] tracking-wide text-white/70 uppercase">
            Find Rest &amp; Restore Balance
          </p>
        </div>
      );
    case 'emotional-load-workbook':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-catalyst-cream overflow-hidden">
          <div className="absolute top-5 left-5 w-16 h-16 rounded-full bg-catalyst-copper/80" />
          <div className="absolute bottom-8 right-6 w-20 h-20 rounded-full border-8 border-catalyst-brown/60" />
          <div className="absolute -bottom-5 left-8 w-12 h-12 rounded-full bg-catalyst-gold/70" />
          <HeartHandshake className="relative z-10 w-9 h-9 text-catalyst-brown mb-3" strokeWidth={1.5} />
          <p className="relative z-10 font-semibold text-base text-catalyst-brown leading-snug">
            Emotional Load
            <br />
            Workbook
          </p>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-catalyst-copper/30 to-catalyst-brown/60 text-white">
          {fallbackIcon}
        </div>
      );
  }
};

// Renders the real cover image when available; if the image fails to
// load (e.g. a temporary URL expired), it gracefully falls back to the
// branded ProductCoverArt so the card is never blank.
const CoverImage = ({
  src,
  alt,
  slug,
  fallbackIcon,
}: {
  src?: string;
  alt: string;
  slug: string;
  fallbackIcon?: React.ReactNode;
}) => {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  return <ProductCoverArt slug={slug} fallbackIcon={fallbackIcon} />;
};

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

  const featured = useMemo(
    () => PRODUCTS.find((p) => p.demand === 'HIGH') ?? PRODUCTS[0],
    [],
  );

  const filteredProducts = useMemo(
    () =>
      (activeCategory === 'All Resources'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory)
      ).filter((p) => p.slug !== featured?.slug),
    [activeCategory, featured],
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
            <div className="hidden md:block w-40 h-40 opacity-20 animate-float shrink-0">
              <Sparkles className="w-full h-full text-catalyst-copper" strokeWidth={1} />
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

          {/* Featured */}
          {featured && (
            <section className="mb-8">
              <div className="relative w-full h-[320px] md:h-[380px] rounded-xl overflow-hidden shadow-soft group cursor-pointer">
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                  <CoverImage
                    src={featured.cover}
                    alt={featured.title}
                    slug={featured.slug}
                    fallbackIcon={featured.fallbackIcon}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                  <Badge className="mb-3 w-fit bg-catalyst-copper text-white border-none gap-1 tracking-wide">
                    <Flame className="w-3 h-3" /> MAMA FAVORITE
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-1 drop-shadow-md">
                    {featured.title}
                  </h2>
                  <p className="text-white/85 max-w-xl mb-4 drop-shadow-sm">
                    {featured.tagline}
                  </p>
                  <Button
                    className="w-fit bg-catalyst-copper hover:bg-catalyst-copper/90 gap-2"
                    onClick={() => setModalProduct(featured)}
                  >
                    {renderUnlockButton(featured)}
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Product grid */}
          <section className="mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const isOwned = owned.has(p.slug);

                return (
                  <Card
                    key={p.slug}
                    className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                        <CoverImage
                          src={p.cover}
                          alt={`${p.title} cover`}
                          slug={p.slug}
                          fallbackIcon={p.fallbackIcon}
                        />
                      </div>
                      {/* dark gradient for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* top-right badge */}
                      <div className="absolute top-3 right-3">
                        {isOwned ? (
                          <div className="bg-emerald-500 text-white rounded-full p-1 shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <Badge className="bg-black/40 text-white border-0 backdrop-blur-sm text-[10px] gap-0.5 px-2 py-0.5">
                            <Flame className="w-2.5 h-2.5" /> {p.demand}
                          </Badge>
                        )}
                      </div>

                      {/* overlay content at bottom */}
                      <div className="absolute bottom-0 inset-x-0 p-4 space-y-2">
                        <h4 className="font-semibold text-sm text-white leading-snug drop-shadow">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-white/75 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-white font-bold text-sm drop-shadow">
                            ${(p.priceCents / 100).toFixed(2)}
                          </span>
                          <span className="text-white/65 text-[11px]">
                            or {p.pointsCost.toLocaleString()} pts
                          </span>
                        </div>
                        {isOwned ? (
                          <Button
                            asChild
                            size="sm"
                            className="w-full bg-white text-foreground hover:bg-white/90 h-8 text-xs font-semibold"
                          >
                            <a
                              href={p.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              {p.cta}
                            </a>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full bg-white text-foreground hover:bg-white/90 h-8 text-xs font-semibold"
                            onClick={() => setModalProduct(p)}
                          >
                            {renderUnlockButton(p)}
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
