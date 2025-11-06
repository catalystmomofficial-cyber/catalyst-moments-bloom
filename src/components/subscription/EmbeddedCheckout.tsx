import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmbeddedCheckoutProps {
  priceId: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Stripe: any;
    __STRIPE_EMBEDDED__?: {
      checkout: any | null;
      clientSecret: string | null;
      ownerId: symbol | null;
      isInitializing: boolean;
    };
    __STRIPE_INSTANCE__?: any;
  }
}

const EmbeddedCheckout = ({ priceId, onSuccess }: EmbeddedCheckoutProps) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const stripeCheckoutRef = useRef<any>(null);
  const currentClientSecretRef = useRef<string | null>(null);
  const instanceIdRef = useRef(Symbol('embeddedCheckoutInstance'));
  const isInitializingRef = useRef(false);
  const hasRetriedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeCheckout = async () => {
      try {
        if (isInitializingRef.current || (window as any).__STRIPE_EMBEDDED__?.isInitializing) return;
        isInitializingRef.current = true;
        setIsLoading(true);
        setError(null);

// Clean up any existing checkout instance (global + local)
const g = (window as any).__STRIPE_EMBEDDED__ || ((window as any).__STRIPE_EMBEDDED__ = { checkout: null, clientSecret: null, ownerId: null, isInitializing: false });
try {
  if (g.checkout) {
    try { g.checkout.unmount(); } catch (e) { console.log('Global cleanup error:', e); }
    g.checkout = null;
    g.clientSecret = null;
    g.ownerId = null;
    await new Promise((r) => setTimeout(r, 50));
  }
  if (stripeCheckoutRef.current) {
    try { stripeCheckoutRef.current.unmount(); } catch (e) { console.log('Local cleanup error:', e); }
    stripeCheckoutRef.current = null;
    await new Promise((r) => setTimeout(r, 10));
  }
} catch (_) {}


        // Get client secret from edge function
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout', {
          body: { priceId }
        });

        if (invokeError) {
          throw new Error(invokeError.message);
        }

        const clientSecret = data?.clientSecret || data?.client_secret;
        const sessionUrl = data?.url;
        if (!clientSecret) {
          throw new Error('No client secret received');
        }
        
        // Store the hosted checkout URL as fallback
        if (sessionUrl) {
          setCheckoutUrl(sessionUrl);
        }

        // Prevent duplicate init with the same session
        if (currentClientSecretRef.current === clientSecret && stripeCheckoutRef.current) {
          setIsLoading(false);
          isInitializingRef.current = false;
          return;
        }

        // Initialize Stripe (singleton)
        if (!window.Stripe) {
          throw new Error('Stripe.js failed to load');
        }
        const PUBLISHABLE_KEY = 'pk_live_51S4sMACNwyQa1NiQmZrjG7oSMVWDUNPdqMWKbGmkk1f8KXcnqXQITGVP2XsI9aXLMxMOQSX8CtU2nEAoNSmrCdGN00aIWz1BSl';
        const stripe = (window.__STRIPE_INSTANCE__ ||= window.Stripe(PUBLISHABLE_KEY));

if (!mounted) return;

// mark global initializing
const gState = (window as any).__STRIPE_EMBEDDED__ || ((window as any).__STRIPE_EMBEDDED__ = { checkout: null, clientSecret: null, ownerId: null, isInitializing: false });
gState.isInitializing = true;

// Mount embedded checkout
const checkout = await stripe.initEmbeddedCheckout({
  clientSecret: clientSecret,
});

        if (!mounted) {
          checkout.unmount();
          return;
        }

stripeCheckoutRef.current = checkout;

if (checkoutRef.current) {
  checkoutRef.current.innerHTML = '';
  checkout.mount(checkoutRef.current);
}

currentClientSecretRef.current = clientSecret;

// update global singleton
const gFinal = (window as any).__STRIPE_EMBEDDED__ || ((window as any).__STRIPE_EMBEDDED__ = { checkout: null, clientSecret: null, ownerId: null, isInitializing: false });
gFinal.checkout = checkout;
gFinal.clientSecret = clientSecret;
gFinal.ownerId = instanceIdRef.current;
gFinal.isInitializing = false;

setIsLoading(false);
isInitializingRef.current = false;
      } catch (err) {
        console.error('Checkout initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize checkout';

        // If Stripe complains about multiple embedded instances, force a hard reset and retry once
        if (/multiple.*embedded/i.test(String(errorMessage)) && !hasRetriedRef.current) {
          hasRetriedRef.current = true;
          try {
            const gForce = (window as any).__STRIPE_EMBEDDED__;
            if (gForce?.checkout) {
              try { gForce.checkout.unmount(); } catch {}
              gForce.checkout = null;
              gForce.clientSecret = null;
              gForce.ownerId = null;
              gForce.isInitializing = false;
            }
            if (stripeCheckoutRef.current) {
              try { stripeCheckoutRef.current.unmount(); } catch {}
              stripeCheckoutRef.current = null;
            }
            if (checkoutRef.current) checkoutRef.current.innerHTML = '';
            await new Promise((r) => setTimeout(r, 200));
          } catch {}
          // Retry once after a brief delay
          setTimeout(() => {
            // Avoid retry if component unmounted
            if (typeof window !== 'undefined') {
              initializeCheckout();
            }
          }, 150);
          return;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        isInitializingRef.current = false;
        const gErr = (window as any).__STRIPE_EMBEDDED__;
        if (gErr) gErr.isInitializing = false;
      }
    };

    initializeCheckout();

    return () => {
      mounted = false;
      // Properly unmount the checkout on cleanup
      const g = (window as any).__STRIPE_EMBEDDED__;
      if (g?.ownerId === instanceIdRef.current && g.checkout) {
        try {
          g.checkout.unmount();
        } catch (e) {
          console.log('Global cleanup error:', e);
        }
        g.checkout = null;
        g.clientSecret = null;
        g.ownerId = null;
        g.isInitializing = false;
      }
      if (stripeCheckoutRef.current) {
        try {
          stripeCheckoutRef.current.unmount();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        stripeCheckoutRef.current = null;
      }
    };
  }, [priceId]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <div className="flex flex-col gap-3 items-center">
          {checkoutUrl && (
            <Button
              onClick={() => window.open(checkoutUrl, '_blank')}
              size="lg"
            >
              Open secure checkout in a new tab
            </Button>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="text-primary hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading secure checkout...</p>
          </div>
        </div>
      )}
      <div ref={checkoutRef} />
    </div>
  );
};

export default EmbeddedCheckout;
