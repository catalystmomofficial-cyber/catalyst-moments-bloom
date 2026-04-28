import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, checkSubscription } = useAuth();
  const [status, setStatus] = useState<'syncing' | 'success' | 'pending'>('syncing');
  const sentRef = useRef(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user || sentRef.current) return;
    sentRef.current = true;

    let cancelled = false;
    const sync = async () => {
      // Poll subscription status (Stripe → check-subscription)
      let confirmed = false;
      for (let i = 0; i < 8 && !cancelled; i++) {
        try {
          await checkSubscription();
          const { data } = await supabase.functions.invoke('check-subscription');
          if (data?.subscribed) {
            confirmed = true;
            break;
          }
        } catch (e) {
          console.error('[SUB_SUCCESS] poll error', e);
        }
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (cancelled) return;
      setStatus(confirmed ? 'success' : 'pending');

      // Send confirmation email (idempotent via session id)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        const firstName = profile?.display_name?.split(' ')[0];

        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'subscription-confirmation',
            recipientEmail: user.email,
            idempotencyKey: `sub-confirm-${sessionId || user.id}`,
            templateData: {
              firstName,
              planName: 'Premium Membership',
              amount: '$49.99/month',
            },
          },
        });
      } catch (e) {
        console.error('[SUB_SUCCESS] email send error', e);
      }
    };

    sync();
    return () => {
      cancelled = true;
    };
  }, [user, sessionId, checkSubscription]);

  useEffect(() => {
    if (status === 'success') {
      toast.success("You're all set! Welcome to Catalyst Mom 💛");
    }
  }, [status]);

  return (
    <>
      <Helmet>
        <title>Subscription Confirmed | Catalyst Mom</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              {status === 'syncing' ? (
                <>
                  <div className="h-16 w-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <h1 className="text-2xl font-bold">Confirming your subscription…</h1>
                  <p className="text-muted-foreground">Hang tight, this only takes a moment.</p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="relative h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                    <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-primary/60" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Thank you for subscribing!</h1>
                    <p className="text-muted-foreground">
                      Welcome to <strong>Catalyst Mom</strong>. Your premium membership is{' '}
                      {status === 'success' ? 'active' : 'being activated'}.
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        A confirmation email is on its way to <strong>{user?.email}</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        Charges appear as <strong>CATALYST MOM</strong> on your statement.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button onClick={() => navigate('/dashboard')} className="flex-1" size="lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      <Link to="/questionnaire">Personalize my plan</Link>
                    </Button>
                  </div>

                  {status === 'pending' && (
                    <p className="text-xs text-muted-foreground">
                      Still syncing? Refresh your dashboard in a minute — your access will appear automatically.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SubscriptionSuccess;
