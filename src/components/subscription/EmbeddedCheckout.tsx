import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
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
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const MAX_RETRIES = 2;
  const BASE_DELAY = 500; // 500ms base delay
  const INIT_TIMEOUT_MS = 3000;

  const handleRefresh = () => {
    retryCountRef.current = 0;
    setRetryAttempt(0);
    setRefreshKey(prev => prev + 1);
    setError(null);
    hasRetriedRef.current = false;
  };

  const createHostedFallback = async () => {
    try {
      console.log('[CHECKOUT] Falling back to hosted checkout...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, uiMode: 'hosted' }
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.message('Opened secure checkout in a new tab');
      } else {
        throw new Error('Hosted checkout URL not available');
      }
    } catch (e) {
      console.error('[CHECKOUT] Hosted fallback failed:', e);
      setError('Unable to load checkout. Please try again later.');
    }
  };

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
        console.log('[CHECKOUT] Fetching checkout session...');
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout', {
          body: { priceId }
        });

        if (invokeError) {
          console.error('[CHECKOUT] Error invoking create-checkout:', invokeError);
          throw new Error(invokeError.message);
        }

        const clientSecret = data?.clientSecret || data?.client_secret;
        const sessionUrl = data?.url;
        
        console.log('[CHECKOUT] Session received:', { hasClientSecret: !!clientSecret, hasUrl: !!sessionUrl });
        
        if (!clientSecret) {
          throw new Error('No client secret received');
        }
        
        // Store the hosted checkout URL as fallback
        if (sessionUrl) {
          setCheckoutUrl(sessionUrl);
        }

        // Prevent duplicate init with the same session
        if (currentClientSecretRef.current === clientSecret && stripeCheckoutRef.current) {
          console.log('[CHECKOUT] Using existing checkout instance');
          setIsLoading(false);
          isInitializingRef.current = false;
          return;
        }

        // Set initialization timeout fallback to hosted checkout
        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = setTimeout(() => {
          if (mounted && !stripeCheckoutRef.current) {
            console.log('[CHECKOUT] Init timeout reached, falling back to hosted checkout');
            createHostedFallback();
          }
        }, INIT_TIMEOUT_MS);

        // Initialize Stripe (singleton)
        if (!window.Stripe) {
          console.error('[CHECKOUT] Stripe.js not loaded');
          throw new Error('Stripe.js failed to load');
        }
        console.log('[CHECKOUT] Initializing Stripe instance...');
        const PUBLISHABLE_KEY = 'pk_live_51S4sMACNwyQa1NiQmZrjG7oSMVWDUNPdqMWKbGmkk1f8KXcnqXQITGVP2XsI9aXLMxMOQSX8CtU2nEAoNSmrCdGN00aIWz1BSl';
        const stripe = (window.__STRIPE_INSTANCE__ ||= window.Stripe(PUBLISHABLE_KEY));

if (!mounted) return;

// mark global initializing
const gState = (window as any).__STRIPE_EMBEDDED__ || ((window as any).__STRIPE_EMBEDDED__ = { checkout: null, clientSecret: null, ownerId: null, isInitializing: false });
gState.isInitializing = true;

console.log('[CHECKOUT] Mounting embedded checkout...');
// Mount embedded checkout
const checkout = await stripe.initEmbeddedCheckout({
  clientSecret: clientSecret,
});

        if (!mounted) {
          console.log('[CHECKOUT] Component unmounted, cleaning up');
          checkout.unmount();
          return;
        }

stripeCheckoutRef.current = checkout;

if (checkoutRef.current) {
  console.log('[CHECKOUT] Mounting to DOM');
  checkoutRef.current.innerHTML = '';
  checkout.mount(checkoutRef.current);
  console.log('[CHECKOUT] Successfully mounted');
  if (initTimeoutRef.current) { clearTimeout(initTimeoutRef.current); initTimeoutRef.current = null; }
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
            if (typeof window !== 'undefined') {
              initializeCheckout();
            }
          }, 150);
          return;
        }

        // Automatic retry with exponential backoff
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, retryCountRef.current);
          retryCountRef.current++;
          setRetryAttempt(retryCountRef.current);
          
          console.log(`Retrying checkout initialization (attempt ${retryCountRef.current}/${MAX_RETRIES}) in ${delay}ms...`);
          
          retryTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              isInitializingRef.current = false;
              const gRetry = (window as any).__STRIPE_EMBEDDED__;
              if (gRetry) gRetry.isInitializing = false;
              initializeCheckout();
            }
          }, delay);
          
          setIsLoading(true);
          return;
        }

        // Max retries reached
        setError(errorMessage);
        toast.error(`Checkout failed after ${MAX_RETRIES} attempts. Please try again.`);
        setIsLoading(false);
        isInitializingRef.current = false;
        const gErr = (window as any).__STRIPE_EMBEDDED__;
        if (gErr) gErr.isInitializing = false;
      }
    };

    initializeCheckout();

    return () => {
      mounted = false;
      
      // Clear any pending retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      // Clear initialization timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
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
  }, [priceId, refreshKey]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <div className="flex flex-col gap-3 items-center">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload checkout
          </Button>
          {checkoutUrl && (
            <Button
              onClick={() => window.open(checkoutUrl, '_blank')}
              size="lg"
            >
              Open secure checkout in a new tab
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Loading secure checkout...</p>
              {retryAttempt > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Retry attempt {retryAttempt}/{MAX_RETRIES}
                </p>
              )}
            </div>
            {checkoutUrl && (
              <Button
                onClick={() => window.open(checkoutUrl, '_blank')}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Open in new tab instead
              </Button>
            )}
          </div>
        </div>
      )}
      <div ref={checkoutRef} />
    </div>
  );
};

export default EmbeddedCheckout;
